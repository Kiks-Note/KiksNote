const express = require("express");
const cors = require("cors");
const app = express();
const {db} = require("./firebase");
const bodyParser = require("body-parser");
const webSocketServer = require("websocket").server;
const http = require("http");
const PORT = process.env.PORT || 5050;
const {parse} = require("url");
const fs = require("fs");
const moment = require("moment");

const user = {
  firstname: "Rui",
  lastname: "Gaspar",
  mail: "ruigaspar@hotmail.com",
  birthdate: "28-10-2003",
  class: "L2 ALT Cergy",
  admin: false,
  ref: "/users/ruigaspar@hotmail.com",
};

const server = http.createServer(app);

const ws = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

ws.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  const {pathname} = parse(request.httpRequest.url);
  // console.log("request.httpServer => ", request);
  // console.log("request.url => ", request.pathname);
  console.log("pathname => ", pathname);
  connection ? console.log("connection ok") : console.log("connection failed");
  require("./inventory")(app, db, pathname, connection, user, fs);
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(bodyParser.json());

// require("./inventory")(app, db, ws, parse, fs, moment);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
