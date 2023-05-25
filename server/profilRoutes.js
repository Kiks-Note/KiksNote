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
  // Route Profil

  router.put("/:userId", upload.single("image"), updateProfil);
  router.put(
    "/background/:userId",
    upload.single("image"),
    updateBackgroundImage
  );
  router.get("/student/:userId", getStudent);

  switch (pathname) {
    case "/profil":
      profilRequests(connection);
      break;
    default:
      break;
  }

  return router;
};
