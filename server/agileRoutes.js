const express = require("express");
const router = express.Router();


const {
   addImpactMapping
} = require("./controllers/agile")

module.exports = function (){
    router.put("/:dashboardId/impact_mapping", addImpactMapping);

}

module.exports = router;