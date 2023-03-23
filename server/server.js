const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const app = express();
const WebSocket = require("ws");
const http = require("http");
const { db, auth } = require("./firebase");
const { signInWithEmailAndPassword } = require("./firebase_auth");

dotenv.config({ path: "./.env.login" });
dotenv.config({ path: "./.env" });

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
require("./routes/call")(app, wss, db);
require("./routes/auth")(app, db, jwt, auth, signInWithEmailAndPassword);

let currentData;

const broadcastData = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};
// Handle incoming connections from clients
wss.on("connection", (ws, req) => {
  // Send the current data to the new client
  ws.send(currentData);
  ws.onmessage = (event) => {
    currentData = event.data;
    broadcastData(event.data);
  };
});

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
      console.log(req.query.id);
      console.log(data.data());
      res.send(data.data());
    });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
