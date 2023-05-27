const express = require("express");
const router = express.Router();

const {
    addNewRetro,
    getRetro
} = require("./controllers/retro");

module.exports = function () {
    router.post("/new/newretro", addNewRetro);
    router.get("/get/retro", getRetro);

    return router;
}