const express = require("express");
const router = express.Router();
const { parse } = require("url");

const {
  updateProfil,
  updateBackgroundImage,
  profilRequests,
  getStudent,
} = require("./controllers/profil");

module.exports = function (connection, pathname,upload) {
  // Accept wsI as an argument

  router.put("/:userId", upload.single("image"), updateProfil);
  router.put(
    "/background/:userId",
    upload.single("image"),
    updateBackgroundImage
  );
  router.get("/student", getStudent);

  switch (pathname) {
    case "/profil":
      profilRequests(connection);
      break;
    default:
      break;
  }

  return router;
};