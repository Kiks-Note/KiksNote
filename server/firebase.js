const { initializeApp, cert } = require("firebase-admin/app");
const {
  getFirestore,
  FieldValue,
  Timestamp,
} = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");

const serviceAccount = require("./credentials.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "kiksnote.appspot.com",
});

const db = getFirestore();
const auth = getAuth();

const storageFirebase = admin.storage();

module.exports = { db, auth, storageFirebase, FieldValue, Timestamp };
