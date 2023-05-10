const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv").config();
const app = express();
const { db, auth } = require("./firebase");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const webSocketServer = require("websocket").server;
const http = require("http");
const {db, auth} = require("./firebase");
const {parse} = require("url");
const saltRounds = 12;
const fs = require("fs");

const {signInWithEmailAndPassword, authClient} = require("./firebase_auth");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5050;
const server = http.createServer(app);

const wsI = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});


// require("./routes/auth")(app, db, auth, authClient, signInWithEmailAndPassword);

const inventoryRoutes = require("./inventoryRoutes");
const authRoutes = require("./authRoutes");
app.use("/inventory", inventoryRoutes(wsI));
app.use("/auth", authRoutes);


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// app.post("/register", (req, res) => {
//   const {
//     userEmail,
//     userPassword,
//     userFirstName,
//     userLastName,
//     userBirthDate,
//     userStatus,
//     userClass,
//   } = req.body;
//   auth
//     .createUser({
//       email: userEmail,
//       password: userPassword,
//     })
//     .then((user) => {
//       if (userClass === "") {
//         db.collection("users")
//           .doc(user.uid)
//           .set({
//             firstname: userFirstName,
//             lastname: userLastName,
//             password: bcrypt.hashSync(userPassword, saltRounds),
//             dateofbirth: new Date(userBirthDate),
//             status: userStatus,
//             email: userEmail,
//           });
//       } else {
//         db.collection("users")
//           .doc(user.uid)
//           .set({
//             firstname: userFirstName,
//             lastname: userLastName,
//             password: bcrypt.hashSync(userPassword, saltRounds),
//             dateofbirth: new Date(userBirthDate),
//             status: userStatus,
//             email: userEmail,
//             class: userClass,
//           });
//       }
//       res.send({message: "User created successfully"});
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// const wss = new WebSocket.Server({ server });
