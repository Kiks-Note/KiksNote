const express = require("express");
const router = express.Router();

const {
    exportMailCall,
    // callRequests
} = require("./controllers/call");

router.post("/exportCall", exportMailCall);
module.exports = router;
