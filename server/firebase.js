const {initializeApp, cert} = require("firebase-admin/app");
const {
  getFirestore,
  FieldValue,
  Timestamp,
} = require("firebase-admin/firestore");
const {getAuth} = require("firebase-admin/auth");


const serviceAccount = require("./credentials.json");


const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const auth = getAuth();

module.exports = { db, auth, FieldValue, Timestamp };
