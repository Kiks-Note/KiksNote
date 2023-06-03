const express = require("express");
const router = express.Router();

const {
    addRetro,
    retroRequests,
    getRetro
} = require("./controllers/retro");




function retroRoutesWsNotNeeded() {
  console.log("in route");
  router.post("/newRetro", addRetro);
  router.get("/getRetro", getRetro);
  return router;
}

function retroRoutesWsNeeded(connection, pathname) { 
  //  router.post("/newRetro", addRetro);
  switch (pathname) {
    case "/retro":
        retroRequests(connection);
      break;
    default:
      break;
  }

  return router;
}


module.exports = { retroRoutesWsNotNeeded, retroRoutesWsNeeded };
