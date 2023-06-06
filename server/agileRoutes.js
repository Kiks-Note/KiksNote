const express = require("express");
const router = express.Router();

const {
  addImpactMapping,
  getImpactMapping,
  getFoldersAgile,
  getZipFolderAgile,
  updatePdfInAgileFolder,
  addPersona,
  empathyRequest,
  personaRequest,
  changeIndex,
  createPostit,
  deletePostit,
} = require("./controllers/agile");

module.exports = function (connection, pathname, upload) {
  router.put("/:dashboardId/add_impact_mapping", addImpactMapping);
  router.get("/:dashboardId/get_impact_mapping", getImpactMapping);
  router.get("/:userId/agile_folder", getFoldersAgile);
  router.get("/folder", getZipFolderAgile);
  router.post(
    "/:dashboardId/folder",
    upload.single("pdfFile"),
    updatePdfInAgileFolder
  );
  router.post("/:dashboardId/persona/:actorId/create", addPersona);
  router.put("/:dashboardId/empathy/:actorId/setPostit", changeIndex);
  router.put(
    "/:dashboardId/empathy/:actorId/column/:columnId/addPostit",
    createPostit
  );
  router.delete(
    "/:dashboardId/empathy/:actorId/column/:columnId/postit/:postitId",
    deletePostit
  );

  switch (pathname) {
    case "/empathy":
      empathyRequest(connection);
      console.log("empathy");
      break;
    case "/persona":
      personaRequest(connection);
      console.log("persona");
      break;
    default:
      break;
  }

  return router;
};
