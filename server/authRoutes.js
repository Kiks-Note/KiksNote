const express = require("express");
const router = express.Router();
const { db } = require("./firebase");
const { parse } = require("url");

const { login, register } = require("./controllers/auth");

router.post("/connexion", login);
router.post("/inscription", register);

module.exports = router;
