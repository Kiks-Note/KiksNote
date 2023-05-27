const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  getStudentById,
  getStudentProjectById,
  getAllStudentsProjects,
  createStudentProject,
  refStudentProject,
} = require("./controllers/studentsProjects");

module.exports = function () {
  router.get("/students", getAllStudents);
  router.get("/student/:id", getStudentById);
  router.get("/studentsprojects/:id", getStudentProjectById);
  router.get("/students-projects", getAllStudentsProjects);
  router.post("/students-projects", createStudentProject);
  router.post("/refprojects", refStudentProject);
  return router;
};
