const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const app = express();
const { db, auth } = require("./firebase");
const { signInWithEmailAndPassword } = require("./firebase_auth");

dotenv.config({ path: "./.env.login" });
dotenv.config({ path: "./.env" });

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;

require("./routes/auth")(app, db, jwt, auth, signInWithEmailAndPassword);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
