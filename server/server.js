const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const app = express();
const WebSocket = require("ws");
const webSocketServer = require("websocket").server;
const http = require("http");
const { db, auth } = require("./firebase");
const { signInWithEmailAndPassword } = require("./firebase_auth");
const { parse } = require("url");
const bcrypt = require('bcrypt');
const saltRounds = 12;

const { signInWithEmailAndPassword, authClient } = require("./firebase_auth");


app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
const ws = new webSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
});
require("./routes/groupscreation")(app, db);

ws.on("request", (request) => {
    const connection = request.accept(null, request.origin);
    const {pathname} = parse(request.httpRequest.url);
    console.log("request.httpServer => ", request);
    console.log("request.url => ", request.pathname);
    console.log("pathname => ", pathname);
    connection ? console.log("connection ok") : console.log("connection failed");

    require("./blog_back.js")(app, pathname, db, connection);
    require("./routes/call")(app, db, connection, pathname);
    require("./routes/auth")(app, db, jwt, auth, signInWithEmailAndPassword);
    require("./dashboard")(app, db, ws, parse);

});

app.post('/register', (req, res) => {
    const {userEmail, userPassword, userFirstName, userLastName, userBirthDate, userStatus, userClass} = req.body;
    auth.createUser({
        email: userEmail,
        password: userPassword,
    }).then((user) => {
        if (userClass === "") {
            db.collection("users").doc(user.uid).set({
                firstname: userFirstName,
                lastname: userLastName,
                password: bcrypt.hashSync(userPassword, saltRounds),
                dateofbirth: new Date(userBirthDate),
                status: userStatus,
                email: userEmail
            })
        } else {
            db.collection("users").doc(user.uid).set({
                firstname: userFirstName,
                lastname: userLastName,
                password: bcrypt.hashSync(userPassword, saltRounds),
                dateofbirth: new Date(userBirthDate),
                status: userStatus,
                email: userEmail,
                class: userClass
            })
        }
        res.send({ message: "User created successfully" })
    }).catch((err)=>{
        console.log(err);
    })
})

app.post("/addUser", (req, res) => {
  const data = req.body;
  db.collection("users").add(data);
  res.send({ message: "User created successfully" });
});

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

// const wss = new WebSocket.Server({ server });
require("./routes/call")(app, ws, db, parse);
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
