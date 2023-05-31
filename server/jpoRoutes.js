const express = require("express");
const router = express.Router();

const { getAllJpo, getJpoById, createJpo } = require("./controllers/jpo");

module.exports = function () {
  // Routes Jpo
  router.get("/jpo", getAllJpo);
  router.get("/jpo/:id", getJpoById);
  router.post("/jpo", createJpo);
  return router;
  return router;
};
