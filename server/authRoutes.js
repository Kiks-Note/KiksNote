const express = require("express");
const router = express.Router();
const {db} = require("./firebase");
const {parse} = require("url");

const {login} = require("./controllers/auth");

router.post("/login", login);

module.exports = router;
