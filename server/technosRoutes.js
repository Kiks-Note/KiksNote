const express = require("express");
const router = express.Router();

const {
  getAllTechnos,
  getTechnoById,
  createTechno,
  deleteTechnoById,
} = require("./controllers/technos");

module.exports = function () {
  // Routes Technos
  router.get("/technos", getAllTechnos);
  router.get("/technos/:id", getTechnoById);
  router.post("/technos", createTechno);
  router.delete("/technos", deleteTechnoById);
  return router;
};
