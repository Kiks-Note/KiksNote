const { initializeApp } = require("firebase/app");
const { signInWithEmailAndPassword, sendPasswordResetEmail, getAuth } = require("firebase/auth");

initializeApp({
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
});

const authClient = getAuth()

module.exports = { signInWithEmailAndPassword, sendPasswordResetEmail, authClient };
