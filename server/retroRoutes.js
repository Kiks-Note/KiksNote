const express = require("express");


const {
  addRetro,
  retroRequests,
  getRetro,
  getRetrosByUser,
  getAll,
  editPostit,
  addPostIt,
  movePostIt,
  getTeamMates,
  getRetroForStudent
} = require("./controllers/retro");

const retroRoutesWsNotNeeded = () => {
  const router = express.Router(); // Create a new router instance

  console.log("in route");
  router.post("/newRetro", addRetro);
  router.get("/getRetro", getRetro);
  router.get("/getAll", getAll)
  router.put("/editPostit", editPostit)
  router.post("/addPostIt", addPostIt)
  router.put("/movePostIt", movePostIt)
  router.get("/getTeamMates/:studentClass/:studentId", getTeamMates)
  return router;
}

const retroRoutesWsNeeded = (connection, pathname) => {
  const router = express.Router(); // Create a new router instance

  router.get("/getRetrosByUser/:idUser", getRetrosByUser),
  router.get("/getRetroForStudent/:userName/:userClass", getRetroForStudent)
  
  
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
