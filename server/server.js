const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const app = express();
const { db } = require("./firebase");

dotenv.config({ path: "./.env.login" });

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;

require("./routes/auth")(app, db, jwt, bcrypt);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
