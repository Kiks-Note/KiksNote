import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tree from "react-d3-tree";
import Button from "@material-ui/core/Button";
import { Icon } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  AddRounded,
  EditNotificationsRounded,
  NoEncryption,
} from "@mui/icons-material";
import { array } from "prop-types";
import { isNameExists, generateUniqueName } from "../../utils/FunctionsUtils";
import InputNode from "./arbre/InputNode";
import DrawTools from "./arbre/DrawTools";
import { green } from "@mui/material/colors";

const useStyles = makeStyles((theme) => ({
  treeContainer: {
    height: "100vh",
    width: "100vh",
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
  const [showToolbar, setShowToolbar] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [currentProjetId, setCurrentProjetId] = useState(null);
  const [showInputFor, setShowInputFor] = useState(null);
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

  const handleNodeMouseOver = (event) => {
    console.log(event);
    setHoveredNode(event);
  };

  const handleNodeMouseOut = () => {
    setHoveredNode(null);
  };

  const handleUpdateThree = (data) => {
    console.log(data);
    setTreeData(data);
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
  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps,
  }) => (
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
      {showeDrawer && (
        <DrawTools
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          style={{ height: "100vh", right: 0 }}
          nodeToUpdate={nodeToUpdate}
          sendUpdateThree={handleUpdateThree}
          oldTreeData={treeData}
        ></DrawTools>
      )}
    </>
  );
};

export default Arbre;
