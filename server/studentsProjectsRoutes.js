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
  uploadMediaProject,
  refStudentProject,
  removeRefStudentProject,
  createLinkedBlogTuto,
  removeLinkedBlogTuto,
  updateStudentProject,
  deleteStudentProject,
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
  router.post("/upload-media-project", uploadMediaProject);
  router.post("/refprojects", refStudentProject);
  router.post("/removerefprojects", removeRefStudentProject);
  router.post("/linkblogtuto/:projectId", createLinkedBlogTuto);
  router.put("/student-project/:projectId", updateStudentProject);
  router.delete("/student-project", deleteStudentProject);
  router.delete("/linkblogtuto/:projectId", removeLinkedBlogTuto);
  return router;
};
