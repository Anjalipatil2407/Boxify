importScripts(
  "https://www.gstatic.com/firebasejs/12.4.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging-compat.js"
);


firebase.initializeApp({
   apiKey: "AIzaSyA72w4yxjeoKpTY4wdx55KOtPsU6eUBYs0",
  authDomain: "boxify-5430d.firebaseapp.com",
  projectId: "boxify-5430d",
  storageBucket: "boxify-5430d.firebasestorage.app",
  messagingSenderId: "972053296785",
  appId: "1:972053296785:web:fe52c75374a139e1e9b130",
  measurementId: "G-6NEB2GKY1T"
});


const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {

  console.log(
    "Background notification received:",
    payload
  );

});