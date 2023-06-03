const express = require("express");
const router = express.Router();

const {
  getAllJpo,
  getPastJpo,
  getJpoById,
  createJpo,
  linkProjectStudents,
  updateJpoById,
  deleteJpoById,
} = require("./controllers/jpo");

module.exports = function () {
  // Routes Jpo
  router.get("/jpo", getAllJpo);
  router.get("/pastjpo", getPastJpo);
  router.get("/jpo/:id", getJpoById);
  router.post("/jpo", createJpo);
  router.post("/jpo/:jpoId", linkProjectStudents);
  router.put("/jpo/:jpoId", updateJpoById);
  router.delete("/jpo/:jpoId", deleteJpoById);
  return router;
};
