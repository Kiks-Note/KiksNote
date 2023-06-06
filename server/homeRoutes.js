const express = require("express");
const router = express.Router();

const { saveWidget, getWidget } = require("./controllers/home");

router.get("/:userId", getWidget);
router.post("/save/:userId/widgets", saveWidget);

module.exports = router;
