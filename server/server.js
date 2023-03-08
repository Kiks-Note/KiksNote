const express = require("express");
const cors = require("cors");
const app = express();
const {db} = require("./firebase");
const bodyParser = require("body-parser");

const user = {
  firstname: "Rui",
  lastname: "Gaspar",
  mail: "ruigaspar@hotmail.com",
  birthdate: "28-10-2003",
  class: "L2 ALT Cergy",
  admin: false,
};

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
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;

require("./inventory")(app, db, user);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
