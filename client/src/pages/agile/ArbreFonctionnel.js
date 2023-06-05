import { useState } from "react";
import { makeStyles } from "@mui/styles";

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
function ArbreFonctionnel() {
  const classes = useStyles();
  const [selectedProject, setSelectedProject] = useState({
    id: 1,
    name: "Nouveau projet",
    content: {
      name: "Root",
      children: [{
        name: "Root",
        children: []
      }],
    },
  });

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
