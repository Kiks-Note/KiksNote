const express = require("express");
const router = express.Router();

const { saveWidget } = require("./controllers/home");

router.post("/saveWidget/:userId'", saveWidget);

module.exports = router;
