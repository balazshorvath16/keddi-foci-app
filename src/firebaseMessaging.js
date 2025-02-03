// src/firebaseMessaging.js
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAeXJQornKkPOmbu4Lxs_oCBSHgzyNqVBE",
    authDomain: "keddi-foci-app.firebaseapp.com",
    projectId: "keddi-foci-app",
    storageBucket: "keddi-foci-app.firebasestorage.app",
    messagingSenderId: "820443052164",
    appId: "1:820443052164:web:7d375a8cf5a47ff58b2ad1",
    measurementId: "G-L7BEHE67NM"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: 'Rlj60hpU4t-fvPk6KKZJ8LpF4tN2-siOHiXpIT9_iNQ' });
    if (currentToken) {
      console.log('FCM token:', currentToken);
      // Ezt a tokent elmentheted a szervered adatbázisába, ha célzott értesítéseket szeretnél.
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
