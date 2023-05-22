const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");


const serviceAccount = require("./credentials.json");

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.REACT_APP_STORAGEBUKET,
});

const db = getFirestore();
const auth = getAuth();

const storageFirebase = admin.storage();

module.exports = { db, auth, storageFirebase, FieldValue };
