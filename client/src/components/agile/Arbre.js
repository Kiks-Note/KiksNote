import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tree from "react-d3-tree";
import DrawTools from "./arbre/DrawTools";
import axios from "axios";
const useStyles = makeStyles((theme) => ({
  treeContainer: {
    height: "100vh",
    width: "100%",
    transform: "rotate(180deg)",
    backgroundColor: "white",
  },
  treeMarker: {
    position: "relative",
  },
  treeMarkerIcon: {
    position: "absolute",
    background: "transparent",
  },
  addButton: {
    color: theme.palette.primary.contrastText,
    backgroundColor: "green",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  editButton: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: "yellow",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  deleteButton: {
    color: theme.palette.error.contrastText,
    backgroundColor: "red",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const Arbre = ({ projet, dashboardId }) => {
  const classes = useStyles();
  const [showToolbar, setShowToolbar] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [currentProjetId, setCurrentProjetId] = useState(null);
  const [treeData, setTreeData] = useState({});
  const [showeDrawer, setShoweDrawer] = useState(false);
  const [nodeToUpdate, setNodeToUpdate] = useState(null);

  useEffect(() => {
    if (currentProjetId == null || projet.id != currentProjetId) {
      setTreeData(projet.content);
      setCurrentProjetId(projet.id);
    }
  }, [projet]);

  const handleNodeMouseOver = (event) => {
    setHoveredNode(event);
  };

  const handleNodeMouseOut = () => {
    setHoveredNode(null);
  };

  const handleUpdateThree = async (data) => {
    try {
      // Envoie des données au backend
      await axios.put(`http://localhost:5050/agile/${dashboardId}/tree`, data);
    } catch (error) {
      console.error("Erreur lors de l'envoi des données au backend", error);
    }
  };

  /*FINNNNN TOOOOLBAR*/

  const showDrawer = (e, node) => {
    if (nodeToUpdate != null && node.name == nodeToUpdate.name) {
      setShoweDrawer(false);
      setNodeToUpdate(null);
      return;
    }
    setShoweDrawer(true);
    setNodeToUpdate(node);
  };
  const renderForeignObjectNode = ({ nodeDatum }) => (
    <g transform="rotate(180,0,0)">
      <rect
        width="100"
        height="50"
        x="-50"
        y="-30"
        onClick={(e) => showDrawer(e, nodeDatum)}
        onMouseEnter={() => {
          setShowToolbar(true);
          handleNodeMouseOver(nodeDatum.name);
        }}
        onMouseLeave={() => {
          setShowToolbar(false);
          handleNodeMouseOut();
        }}
      ></rect>
      <text dominantBaseline="middle" textAnchor="middle" fill="white">
        {nodeDatum.name}
      </text>
    </g>
  );

  const nodeSize = { x: 400, y: 400 };

  const foreignObjectProps = {
    width: nodeSize.x - 200,
    height: nodeSize.y - 50,
    x: 50,
    y: -20,
  };

  const translate = {
    x: 200,
    y: 50,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {showeDrawer && (
        <DrawTools
          nodeToUpdate={nodeToUpdate}
          sendUpdateThree={handleUpdateThree}
          oldTreeData={treeData}
          dashboardId={dashboardId}
        />
      )}
      <div className={classes.treeContainer} id="pdf-content">
        <Tree
          data={treeData}
          orientation="vertical"
          translate={translate}
          separation={{ siblings: 0.5, nonSiblings: 0.5 }}
          nodeSize={nodeSize}
          renderCustomNodeElement={(rd3tProps) =>
            renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
          }
        />
      </div>
    </div>
  );
};

export default Arbre;
