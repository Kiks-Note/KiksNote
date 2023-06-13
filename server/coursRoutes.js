const express = require("express");
const router = express.Router();

const {
  getAllCours,
  getCoursesByOwnerId,
  getAllClasses,
  getCoursById,
  getClassById,
  createClass,
  getInstructors,
  getInstructorById,
  createCours,
  createLinkedCours,
  removeLinkedCours,
  updateCours,
  uploadCoursPdf,
  uploadBackLogPdf,
  deleteCoursPdf,
  deleteBackLogPdf,
  deleteCours,
  getCoursByClass,
  getCoursesByPo,
} = require("./controllers/cours");

module.exports = function () {
  // Routes Cours
  router.get("/cours", getAllCours);
  router.get("/coursbyowner/:ownerid", getCoursesByOwnerId);
  router.get("/classes", getAllClasses);
  router.get("/instructors", getInstructors);
  router.get("/instructor/:id", getInstructorById);
  router.get("/cours/:id", getCoursById);
  router.get("/class/:id", getClassById);
  router.get("/cours/getCourses/:classId", getCoursByClass);
  router.get("/getCoursesByPo/:poId", getCoursesByPo);
  router.post("/class", createClass);
  router.post("/cours", createCours);
  router.post("/linkcours/:courseId", createLinkedCours);
  router.delete("/linkcours/:courseId", removeLinkedCours);
  router.put("/cours/:id", updateCours);
  router.post("/cours/upload-pdf", uploadCoursPdf);
  router.post("/cours/backlog/upload-pdf", uploadBackLogPdf);
  router.delete("/cours/delete-pdf", deleteCoursPdf);
  router.delete("/backlog/delete-pdf", deleteBackLogPdf);
  router.delete("/cours/:id", deleteCours);

  return router;
};
