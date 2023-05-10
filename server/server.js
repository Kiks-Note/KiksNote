const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const app = express();
const { parse } = require("url");
const webSocketServer = require("websocket").server;
const http = require("http");
const multer = require("multer");
const DIR = "uploads/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg, .jpeg and .pdf format allowed!"));
    }
  },
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5050;
const server = http.createServer(app);

const wsI = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

const inventoryRoutes = require("./inventoryRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const profilRoutes = require("./profilRoutes");
const authRoutes = require("./authRoutes");

app.use("/auth", authRoutes);
wsI.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  const { pathname } = parse(request.httpRequest.url);
  console.log("pathname => ", pathname);
  connection ? console.log("connection ok") : console.log("connection failed");

  // require("./blog_back.js")(app, pathname, db, connection);
  // require("./routes/call")(app, db, connection, pathname);
  // require("./dashboardWebSocket")(app, db, connection, pathname);
  // require("./routes/groupscreation")(app, db);
  // require("./calendar")(app, db);
  // require("./calendarWebSocket")(app, db, connection, pathname);
  // require("./userInfo")(app, pathname, db, connection, upload, path, fs);
app.use("/inventory", inventoryRoutes(connection, pathname));
app.use("/dashboard", dashboardRoutes(connection, pathname));
app.use("/profil", profilRoutes(connection, pathname, upload));

  connection.on("error", (error) => {
    console.log(`WebSocket Error: ${error}`);
  });

  connection.on("close", (reasonCode, description) => {
    console.log(
      `WebSocket closed with reasonCode ${reasonCode} and description ${description}`
    );
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
