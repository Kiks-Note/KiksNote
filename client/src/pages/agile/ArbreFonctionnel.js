import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { w3cwebsocket } from "websocket";
import { Typography } from "@mui/material";

import Arbre from "../../components/agile/Arbre.js";

const drawerWidth = 160;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100vh",
    height: "100%",
  },
  drawer: {
    width: "100vh",

    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    height: "100%",
  },
  content: {
    flexGrow: 1,
  },
  ro: {
    flexGrow: 1,
  },
}));
function ArbreFonctionnel({ dashboardId }) {
  const classes = useStyles();
  const [selectedProject, setSelectedProject] = useState({
    id: 1,
    name: "Nouveau projet",
    content: {
      name: "Root",
      children: [],
    },
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const wsComments = new w3cwebsocket(`ws://localhost:5050/three`);
    wsComments.onopen = function (e) {
      wsComments.send(JSON.stringify(dashboardId));
    };
    wsComments.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        console.log(data);
        // setLoading(false);
      } catch (error) {
        //setLoading(true);
        console.error(error);
      }
    };
  }, []);
  return (
    <>
      <div className={classes.container_arbre}>
        {selectedProject ? (
          <Arbre projet={selectedProject}></Arbre>
        ) : (
          <Typography variant="h5">Sélectionnez un projet ou crée</Typography>
        )}
      </div>
    </>
  );
}

export default ArbreFonctionnel;
