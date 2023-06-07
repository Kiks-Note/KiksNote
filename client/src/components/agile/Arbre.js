import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tree from "react-d3-tree";

import DrawTools from "./arbre/DrawTools";


const useStyles = makeStyles((theme) => ({
  treeContainer: {
    height: "100vh",
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
  node__leaf: {
    color: " green",
    /* Let's also make the radius of leaf nodes larger */
    r: 40,
  },
}));

const Arbre = ({ projet }) => {
  const classes = useStyles();

  const [currentProjetId, setCurrentProjetId] = useState(null);

  const [treeData, setTreeData] = useState({
    name: "Root",
    children: [],
  });
  const [showeDrawer, setShoweDrawer] = useState(false);
  const [nodeToUpdate, setNodeToUpdate] = useState(null);

  useEffect(() => {
    if (currentProjetId == null || projet.id != currentProjetId) {
      setTreeData(projet.content);
      setCurrentProjetId(projet.id);
    }
  }, [projet]);



  const handleUpdateThree = (data) => {
    setNodeToUpdate(data.updateNode)
    setTreeData(data.updateTree);
    showDrawer(null, data.updateNode)

  };

  /*FINNNNN TOOOOLBAR*/

  const showDrawer = (e, node) => {
    setShoweDrawer(false);
    if (nodeToUpdate != null && node.name == nodeToUpdate.name && e != null) {
      setShoweDrawer(false);
      setNodeToUpdate(null);
      return;
    }
    setShoweDrawer(true);
    setNodeToUpdate(node);
  };
  const renderForeignObjectNode = ({
    nodeDatum,
  }) => (
    <g transform="rotate(180,0,0)">
      <rect
        width="100"
        height="50"
        x="-50"
        y="-30"
        onClick={(e) => showDrawer(e, nodeDatum)}

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
    <>
      <div className={classes.treeContainer}>
        <Tree
          data={treeData}
          orientation="vertical"
          translate={translate}
          separation={{ siblings: 0.5, nonSiblings: 0.5 }}
          nodeSize={nodeSize}
          leafNodeClassName={classes.node__leaf}
          renderCustomNodeElement={(rd3tProps) =>
            renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
          }
        />
      </div>

      <DrawTools
        nodeToUpdate={nodeToUpdate}
        sendUpdateThree={handleUpdateThree}
        oldTreeData={treeData}
        open={showeDrawer ? true : false}
      />

    </>
  );
};

export default Arbre;
