// // public/firebase-messaging-sw.js
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// firebase.initializeApp({
//   apiKey: "AIzaSyAeXJQornKkPOmbu4Lxs_oCBSHgzyNqVBE",
//   authDomain: "keddi-foci-app.firebaseapp.com",
//   projectId: "keddi-foci-app",
//   storageBucket: "keddi-foci-app.firebasestorage.app",
//   messagingSenderId: "820443052164",
//   appId: "1:820443052164:web:7d375a8cf5a47ff58b2ad1",
//   measurementId: "G-L7BEHE67NM"
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/logo.png'
//   };
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
