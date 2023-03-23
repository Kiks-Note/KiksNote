const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv').config();
const app = express();
const { db, auth } = require("./firebase");

const { signInWithEmailAndPassword, sendPasswordResetEmail, authClient } = require("./firebase_auth");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;

require("./routes/auth")(app, db, jwt, auth, authClient, signInWithEmailAndPassword);
require("./routes/resetpass")(app, db, bcrypt, auth, authClient, sendPasswordResetEmail);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
