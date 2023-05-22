const express = require("express");
const router = express.Router();

const { createStudentProject } = require("./controllers/studentsProjects");

module.exports = function () {
  router.post("/students-projects", createStudentProject);
  return router;
};
