// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBAiSmuwua4VOplciC_HcM33cW4oBZCJjE",
  authDomain: "realtime-67635.firebaseapp.com",
  projectId: "realtime-67635",
  storageBucket: "realtime-67635.appspot.com",
  messagingSenderId: "986398368427",
  appId: "1:986398368427:web:a940e3020a1b877faa0dee",
  measurementId: "G-H0YS0LQBX7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Auth state change listener
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("chat-section").style.display = "block";
    document.getElementById("logoutBtn").style.display = "block"; // Show logout button
    loadMessages();
  } else {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("chat-section").style.display = "none";
    document.getElementById("logoutBtn").style.display = "none"; // Hide logout button
  }
});

// Show Signup Form
function showSignup() {
  document.getElementById("username-group").style.display = "block";
  document.getElementById("signupBtn").style.display = "inline-block";
  document.getElementById("showLoginBtn").style.display = "inline-block";
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("showSignupBtn").style.display = "none";
}

// Show Login Form
function showLogin() {
  document.getElementById("username-group").style.display = "none";
  document.getElementById("signupBtn").style.display = "none";
  document.getElementById("showLoginBtn").style.display = "none";
  document.getElementById("loginBtn").style.display = "inline-block";
  document.getElementById("showSignupBtn").style.display = "inline-block";
}

// Sign Up
function signup() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!username) {
    alert("Please enter a username.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      // Save the username to the database
      db.ref("users/" + user.uid).set({
        username: username,
        email: email
      });
      alert("Signup Successful!");
      // Reset the form
      document.getElementById("username-group").style.display = "none";
      document.getElementById("signupBtn").style.display = "none";
      document.querySelector(".auth-buttons button[onclick='login()']").style.display = "inline-block";
      document.querySelector(".auth-buttons button[onclick='showSignup()']").style.display = "inline-block";
    })
    .catch(err => alert(err.message));
}

// Login
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
}

// Logout
function logout() {
  auth.signOut();
}

// Send Message
function sendMessage() {
  const message = document.getElementById("message").value.trim();
  const user = auth.currentUser;

  if (!message || !user) return;

  db.ref("messages").push({
    uid: user.uid,
    name: user.email.split("@")[0],
    text: message,
    timestamp: Date.now() // Save the current timestamp
  });

  document.getElementById("message").value = "";
}

// Load Messages
function loadMessages() {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";

  db.ref("messages").orderByChild("timestamp").on("child_added", snapshot => {
    const msg = snapshot.val();
    const msgElement = document.createElement("div");
    msgElement.classList.add("chat-message");

    // Format the timestamp
    const date = new Date(msg.timestamp);
    const formattedTime = date.toLocaleString(); // e.g., "5/13/2025, 10:30:00 AM"

    // Display the message with the timestamp
    msgElement.innerHTML = `<span>${msg.name} <small>${formattedTime}</small></span>${msg.text}`;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
