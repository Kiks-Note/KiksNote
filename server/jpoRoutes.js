const express = require("express");
const router = express.Router();

const {
  getAllJpo,
  getPastJpo,
  getJpoById,
  getAllJpoParticipants,
  getAllJpoByParticipant,
  createJpo,
  linkProjectStudents,
  unlinkProjectStudents,
  updateJpoById,
  updateJpoPDF,
  deleteJpoById,
} = require("./controllers/jpo");

module.exports = function () {
  // Routes Jpo
  router.get("/jpo", getAllJpo);
  router.get("/pastjpo", getPastJpo);
  router.get("/jpo/:id", getJpoById);
  router.get("/jpo/user/:id", getAllJpoByParticipant);
  router.get("/jpoparticipants", getAllJpoParticipants);
  router.get("/jpoparticipant/:participantId", getAllJpoParticipants);
  router.post("/jpo", createJpo);
  router.post("/jpo/:jpoId", linkProjectStudents);
  router.delete("/jpo/:jpoId", unlinkProjectStudents);
  router.put("/jpo/:jpoId", updateJpoById);
  router.put("/jpopdf/:jpoId", updateJpoPDF);
  router.delete("/jpo", deleteJpoById);
  return router;
};
