const express = require("express");
const router = express.Router();

const {
  addImpactMapping,
  getImpactMapping,
  getFoldersAgile,
  getZipFolderAgile,
  getPdfEmpathyMapToFolderAgile,
  empathyRequest,
} = require("./controllers/agile");

module.exports = function (connection, pathname, upload) {
  router.put("/:dashboardId/add_impact_mapping", addImpactMapping);
  router.get("/:dashboardId/get_impact_mapping", getImpactMapping);
  router.get("/:userId/agile_folder", getFoldersAgile);
  router.get("/folder", getZipFolderAgile);
  router.post(
    "/empathy_map",
    upload.single("pdfFile"),
    getPdfEmpathyMapToFolderAgile
  );

  switch (pathname) {
    case "/empathy":
      empathyRequest(connection);
      console.log("empathy");
      break;
    default:
      break;
  }

  return router;
};
