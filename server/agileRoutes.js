const express = require("express");
const router = express.Router();

const {
  addImpactMapping,
  impactMappingRequest,
  getFoldersAgile,
  getZipFolderAgile,
  updatePdfInAgileFolder,
  addPersona,
  deleteActor,
  updateElevatorPitch,
  resetElevatorPitch,
  changeIndex,
  createPostit,
  putTree,
  deletePostit,
  empathyRequest,
  personaRequest,
  agileRequest,
  treeRequest,
  elevatorPitchRequest
} = require("./controllers/agile");

module.exports = function (connection, pathname, upload) {
  router.put("/:dashboardId/add_impact_mapping", addImpactMapping);
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
  router.delete("/:dashboardId/actor/:actorId", deleteActor);
  router.put("/:dashboardId/tree", putTree);
  router.put("/:dashboardId/updateElevator", updateElevatorPitch);
  router.put("/:dashboardId/resetElevator", resetElevatorPitch)


  switch (pathname) {
    case "/agile":
      agileRequest(connection);
      console.log("agile");
      break;
    case "/impact":
      impactMappingRequest(connection);
      console.log("impact");
      break;
    case "/empathy":
      empathyRequest(connection);
      console.log("empathy");
      break;
    case "/persona":
      personaRequest(connection);
      console.log("persona");
      break;
    case "/three":
      treeRequest(connection);
      console.log("three");
      break
    case "/elevator":
      elevatorPitchRequest(connection);
      console.log("elevator");
    default:
      break;
  }

  return router;
};
