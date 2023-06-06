const express = require("express");
const router = express.Router();

const {
  getAllJpo,
  getPastJpo,
  getJpoById,
  getAllJpoParticipants,
  createJpo,
  linkProjectStudents,
  updateJpoById,
  updateJpoPDF,
  deleteJpoById,
} = require("./controllers/jpo");

module.exports = function () {
  // Routes Jpo
  router.get("/jpo", getAllJpo);
  router.get("/pastjpo", getPastJpo);
  router.get("/jpo/:id", getJpoById);
  router.get("/jpoparticipants", getAllJpoParticipants);
  router.post("/jpo", createJpo);
  router.post("/jpo/:jpoId", linkProjectStudents);
  router.put("/jpo/:jpoId", updateJpoById);
  router.put("/jpopdf/:jpoId", updateJpoPDF);
  router.delete("/jpo/:jpoId", deleteJpoById);
  return router;
};
