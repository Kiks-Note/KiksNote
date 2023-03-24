const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express();
const { db, auth } = require("./firebase");

const { signInWithEmailAndPassword, authClient } = require("./firebase_auth");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;

require("./routes/auth")(app, db, auth, authClient, signInWithEmailAndPassword);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
