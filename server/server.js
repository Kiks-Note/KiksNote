const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const app = express();
const WebSocket = require("ws");
const { db, auth } = require("./firebase");
const { signInWithEmailAndPassword } = require("./firebase_auth");

dotenv.config({ path: "./.env.login" });
dotenv.config({ path: "./.env" });

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

require("./routes/auth")(app, db, jwt, auth, signInWithEmailAndPassword);
const wss = new WebSocket.Server({ port: 4050 });

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
app.post("/callAdd", (req, res) => {
  db.collection("calls")
    .add({
      id_lesson: req.body.id_lesson,
      qrcode: req.body.qrcode,
      student_scan: req.body.student_scan,
      chats: req.body.chats,
    })
    .then(() => {
      res.send("Item added to inventory");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/calls", (req, res) => {
  db.collection("calls")
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

app.get("/getcall", (req, res) => {
  db.collection("calls")
    .doc(req.query.id)
    .get()
    .then((data) => {
      res.send(data.data());
    });
});

app.post("/updatecall", (req, res) => {
  db.collection("calls")
    .doc(req.body.id)
    .update(req.body.object)
    .then(() => {
      res.send("modification effectué");
    })
    .catch((err) => {
      console.log(err);
    });
});

const server = app.listen(PORT, () => {
  const adress = server.address();
  console.log(`Listening on port ${PORT} + ${adress.address}`);
});
