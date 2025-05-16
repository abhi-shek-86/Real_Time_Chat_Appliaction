
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js"
const firebaseConfig = {
  apiKey: "AIzaSyBAiSmuwua4VOplciC_HcM33cW4oBZCJjE",
  authDomain: "realtime-67635.firebaseapp.com",
  databaseURL: "https://realtime-67635-default-rtdb.firebaseio.com",
  projectId: "realtime-67635",
  storageBucket: "realtime-67635.firebasestorage.app",
  messagingSenderId: "986398368427",
  appId: "1:986398368427:web:a940e3020a1b877faa0dee",
  measurementId: "G-H0YS0LQBX7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);
