import { auth } from "../js/firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

const db = getFirestore();
// Signup function
document.addEventListener("DOMContentLoaded", () => {
  let signUpform = document.getElementById("signUpForm");
  if (signUpform) {
    signUpform.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("pass").value;
      let userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      // Save username to Firestore
      await setDoc(doc(db, "users", userCredentials.user.uid), {
        username,
        email
      });
      await Swal.fire("User created Succesfully");
      location.href = "./login.html";
    });
  }

  // Login function
  let loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      let loginCredentials = await signInWithEmailAndPassword(auth, email, password)
      await Swal.fire("User Logged In Successfully");
      console.log(loginCredentials);
      location.href = "./chat.html"


    });
  }

});


