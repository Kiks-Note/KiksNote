const express = require("express");
const router = express.Router();

const {
    getStudents
} = require("./controllers/groupsCreation")

router.get("/:classStudents", getStudents);

module.exports = router;