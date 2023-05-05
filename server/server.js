const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv").config();
const app = express();
const { db, auth, storageFirebase } = require("./firebase");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const webSocketServer = require("websocket").server;
const http = require("http");
const { parse } = require("url");
const saltRounds = parseInt(process.env.SALTY_ROUNDS);
const multer = require("multer");
const mime = require("mime-types");

const DIR = "uploads/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Le fichier doit être un PDF"));
    }
    cb(null, true);
  },
}).single("file");

const bucket = storageFirebase.bucket();

const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  authClient,
} = require("./firebase_auth");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5050;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const ws = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

ws.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  const { pathname } = parse(request.httpRequest.url);
  console.log("request.httpServer => ", request);
  console.log("request.url => ", request.pathname);
  console.log("pathname => ", pathname);
  connection ? console.log("connection ok") : console.log("connection failed");

  require("./blog_back.js")(app, pathname, db, connection);
  require("./routes/call")(app, db, connection, pathname);
  require("./dashboard")(app, db, ws, parse);
  require("./routes/groupscreation")(app, db);
  require("./userInfo")(app, pathname, db, connection, upload, path, fs);
});

require("./routes/auth")(
  app,
  db,
  bcrypt,
  saltRounds,
  auth,
  authClient,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
);

require("./routes/ressources")(app, db, bucket, mime, upload, multer, fs);
