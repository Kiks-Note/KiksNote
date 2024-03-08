const express = require("express");
const router = express.Router();

const { login, register, resetPassword } = require("./controllers/auth");

router.post("/login", login);
router.post("/signup", register);
router.post("/reset-password", resetPassword);

module.exports = router;
