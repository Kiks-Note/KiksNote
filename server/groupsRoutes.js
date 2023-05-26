const express = require("express");
const router = express.Router();

const {
    getStudents,
    sendGroups
} = require("./controllers/groupsCreation")

router.get("/:classStudents", getStudents);
router.post("/exportGroups", sendGroups); 

module.exports = router;