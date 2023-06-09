const express = require("express");
const router = express.Router();
const { db } = require("./firebase");
const { parse } = require("url");

const { login, register, sendemail } = require("./controllers/auth");

router.post("/login", login);
router.post("/signup", register);
router.post("/sendemail", sendemail);

module.exports = router;
