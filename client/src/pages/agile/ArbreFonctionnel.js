import { useState } from "react";
import { makeStyles } from "@mui/styles";


import {
  Typography,

} from "@mui/material";



import Arbre from "../../components/agile/Arbre.js";

const drawerWidth = 160;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100vh',
    height: '100%',

  },
  drawer: {
    width: '100vh',

    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    height: '100%',
  },
  content: {
    flexGrow: 1,

  },
  container_arbre: {
    backgroundcolor: 'white!', width: '100vh',
    height: '100%'
  },
  ro: {
    flexGrow: 1,
  }
}));
function ArbreFonctionnel() {
  const classes = useStyles();
  const [selectedProject, setSelectedProject] = useState({
    id: 1, name: 'Nouveau projet', content: {
      name: 'Root',
      children: [
      ],
    }
  });

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };



  const projects = [
    {
      id: 1, name: 'Nouveau projet', content: {
        name: 'Root',
        children: [
        ],
      }
    },
    {
      id: 2, name: 'Projet 2', content: {
        name: 'Root',
        children: [
          {
            name: 'Node 1',
            children: [

            ],
          },
          {
            name: 'Node 2',
          },
        ],
      }
    },
    {
      id: 3, name: 'Projet 3', content: {
        name: 'Root',
        children: [
          {
            name: 'Node 1',
            children: [

            ],
          },

        ],
      }
    },
  ];





  const handleDelete = (event, nodeId) => {
    // Logic to delete the node
    console.log('Deleting node:', nodeId);
  };



  return (
    <div className={classes.root}>
      {/* Barre de sélection des projets */}

      {/* Mode d'édition du projet sélectionné */}
      <div className={classes.container_arbre}>
        {selectedProject ? (
          <Arbre projet={selectedProject}></Arbre>
        ) : (
          <Typography variant="h5">Sélectionnez un projet ou cré</Typography>
        )}
      </div>
    </div>
  );
}

export default ArbreFonctionnel;
