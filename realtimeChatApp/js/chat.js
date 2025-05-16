import { auth } from "../js/firebase-config.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

const db = getFirestore();

const messagesDiv = document.getElementById("messages");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;
let usernames = {}; // uid -> username

// Fetch all usernames once
async function fetchUsernames() {
    const usersSnapshot = await getDocs(collection(db, "users"));
    usersSnapshot.forEach(docSnap => {
        usernames[docSnap.id] = docSnap.data().username;
    });
}

// Listen for auth state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        await fetchUsernames();
        listenForMessages();
    } else {
        window.location.href = "./login.html";
    }
});

// Send message
if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();
        if (!text) return;

        let username = usernames[currentUser.uid];
        if (!username) {
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            username = userDoc.exists() ? userDoc.data().username : currentUser.email;
            usernames[currentUser.uid] = username; // cache it
        }

        await addDoc(collection(db, "messages"), {
            text,
            uid: currentUser.uid,
            username: username,
            createdAt: serverTimestamp()
        });
        messageInput.value = "";
    });
}

// Listen for new messages in real-time
function listenForMessages() {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    onSnapshot(q, (snapshot) => {
        messagesDiv.innerHTML = "";
        snapshot.forEach(doc => {
            const msg = doc.data();
            const isMe = msg.uid === currentUser.uid;
            const div = document.createElement("div");
            div.className = isMe ? "message me" : "message";
            // Show username and message
            div.innerHTML = `<span class="sender">${msg.username || msg.email}</span><br><span class="text">${msg.text}</span>`;
            messagesDiv.appendChild(div);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

// Logout
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "./login.html";
});