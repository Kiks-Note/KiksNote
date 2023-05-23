const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  getAllStudentsProjects,
  createStudentProject,
} = require("./controllers/studentsProjects");

module.exports = function () {
  router.get("/students", getAllStudents);
  router.get("/students-projects", getAllStudentsProjects);
  router.post("/students-projects", createStudentProject);
  return router;
};
