const express = require("express");
const router = express.Router();

const {
  getAllCours,
  getAllClasses,
  getCoursById,
  getClassById,
  createClass,
  getInstructors,
  getInstructorById,
  createCours,
  updateCours,
  uploadCoursPdf,
  uploadBackLogPdf,
  deleteCoursPdf,
  deleteBackLogPdf,
  deleteCours,
} = require("./controllers/cours");

module.exports = function () {
  // Route Cours
  router.get("/cours", getAllCours);
  router.get("/classes", getAllClasses);
  router.get("/instructors", getInstructors);
  router.get("/instructor/:id", getInstructorById);
  router.get("/cours/:id", getCoursById);
  router.get("/class/:id", getClassById);
  router.post("/class", createClass);
  router.post("/cours", createCours);
  router.put("/cours/:id", updateCours);
  router.post("/cours/upload-pdf", uploadCoursPdf);
  router.post("/cours/backlog/upload-pdf", uploadBackLogPdf);
  router.delete("/cours/delete-pdf", deleteCoursPdf);
  router.delete("/backlog/delete-pdf", deleteBackLogPdf);
  router.delete("/cours/:id", deleteCours);

  return router;
};
