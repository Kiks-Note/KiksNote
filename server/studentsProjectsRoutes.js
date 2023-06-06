const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  getStudentById,
  getBlogTutorials,
  getBlogById,
  getStudentProjectById,
  getAllStudentsProjects,
  createStudentProject,
  refStudentProject,
  createLinkedBlogTuto,
} = require("./controllers/studentsProjects");

module.exports = function () {
  // Routes Students Projects
  router.get("/students", getAllStudents);
  router.get("/student/:id", getStudentById);
  router.get("/blogstutos", getBlogTutorials);
  router.get("/blogstutos/:id", getBlogById);
  router.get("/studentsprojects/:id", getStudentProjectById);
  router.get("/students-projects", getAllStudentsProjects);
  router.post("/students-projects", createStudentProject);
  router.post("/refprojects", refStudentProject);
  router.post("/linkblogtuto/:projectId", createLinkedBlogTuto);
  return router;
};
