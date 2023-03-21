const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const app = express();
const { db } = require("./firebase");
const WebSocket = require("ws");
const http = require("http");

dotenv.config({ path: "./.env.login" });

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
require("./routes/auth")(app, db, jwt, bcrypt);
require("./routes/call")(app, wss, db);

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

// app.post("/addUser", (req, res) => {
//   const data = req.body;
//   db.collection("users").add(data);
//   res.send({ message: "User created successfully" });
// });
//
app.get("/users", (req, res) => {
  db.collection("users")
    .get()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

server.listen(PORT, () => {
  // const adress = server.address();
  console.log(`Listening on port ${PORT}`);
});
