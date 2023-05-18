const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");


const serviceAccount = require("./credentials.json");


const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const auth = getAuth(app)

module.exports = { db, auth };