const express = require("express");
const router = express.Router();

const {
  addImpactMapping,
  getImpactMapping,
  getFoldersAgile,
  getZipFolderAgile,
} = require("./controllers/agile");

module.exports = function () {
  router.put("/:dashboardId/add_impact_mapping", addImpactMapping);
  router.get("/:dashboardId/get_impact_mapping", getImpactMapping);
  router.get("/:userId/agile_folder", getFoldersAgile);
  router.get("/folder", getZipFolderAgile);

  return router;
};
