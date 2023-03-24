const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv').config();
const app = express();
const WebSocket = require("ws");
const http = require("http");
const { db, auth } = require("./firebase");
const { parse } = require("url");

const { signInWithEmailAndPassword, authClient } = require("./firebase_auth");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
require("./routes/call")(app, wss, db, parse);
require("./routes/auth")(app, db, jwt, auth, signInWithEmailAndPassword);

app.get("/users", (req, res) => {
  db.collection("users")
    .get()
    .then((snapshot) => {
      let item = {};
      const data = [];
      snapshot.forEach((doc) => {
        item = doc.data();
        item["id"] = doc.id;
        data.push(item);
      });
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/user", (req, res) => {
  db.collection("users")
    .doc(req.query.id)
    .get()
    .then((data) => {
      let item = {};
      item = data.data();
      item["id"] = data.id;
      res.send(item);
    });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
