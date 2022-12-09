const express = require("express");
const cors = require("cors");
const app = express();
const { db } = require("./firebase");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5050;

require("./inventory")(app, db);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
