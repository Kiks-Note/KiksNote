import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Typography, IconButton, Button } from "@mui/material";
import {
  isNameExists,
  generateUniqueName,
  findParent,
} from "../../../functions/FunctionsUtils";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const useStyles = makeStyles((theme) => ({
  drawer: {
    padding: "10px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  drawerPaper: {
    padding: "10px",
    width: "320px",
    height: "100vh",
  },
  addButton: {
    color: theme.palette.primary.contrastText,
    backgroundColor: "green",
    "&:hover": {
      backgroundColor: theme.palette.primary.white,
    },
  },
  editButton: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: "yellow",
    "&:hover": {
      backgroundColor: theme.palette.secondary.white,
    },
  },
  deleteButton: {
    color: theme.palette.error.contrastText,
    backgroundColor: "red",
    "&:hover": {
      backgroundColor: theme.palette.error.white,
    },
  },
  titleDraw: {
    textAlign: "center",
    marginBottom: 70,
  },
  addSection: {
    backgroundColor: "red",
    marginBottom: 70,
  },
  nameSection: {
    marginBottom: 30,
  },
  deleteSection: {
    marginBottom: 30,
  },
}));
const DrawTools = ({
  nodeToUpdate,
  sendUpdateThree,
  oldTreeData,
  dashboardId,
}) => {
  const classes = useStyles();
  const [isEditingName, setIsEditingName] = useState(false);
  const [node, setNode] = useState(nodeToUpdate);
  const [nameEdit, setNameEdit] = useState("");
  const [nameAdd, setNameAdd] = useState("");

  useEffect(() => {
    setNode(nodeToUpdate);
  }, [nodeToUpdate]);

  const handleNameClick = () => {
    setNameEdit(node.name);
    setIsEditingName(true);
  };

  const handleAddButton = () => {
    const newBranch = { name: "Nouveau", children: [] };
    if (nameAdd && nameAdd !== "") {
      newBranch.name = nameAdd;
    }
    if (isNameExists(newBranch.name, oldTreeData)) {
      newBranch.name = generateUniqueName(newBranch.name, oldTreeData);
    }
    const updatedOldTreeData = findAndReplaceObject(
      node.name,
      newBranch,
      oldTreeData,
      "add"
    );
    setNode(newBranch);
    setNameAdd("");
    sendUpdateThree(updatedOldTreeData);
  };

  const handleEditButton = () => {
    if (!nameEdit || nameEdit === "") {
      setIsEditingName(false);
      return;
    }
    const newBranch = { ...node };
    newBranch.name = nameEdit;
    if (isNameExists(newBranch.name, oldTreeData)) {
      newBranch.name = generateUniqueName(newBranch.name, oldTreeData);
    }
    const updatedOldTreeData = findAndReplaceObject(
      node.name,
      newBranch,
      oldTreeData,
      "edit"
    );
    setNameEdit("");
    setNode(newBranch);

    sendUpdateThree(updatedOldTreeData);
    setIsEditingName(false);
  };

  const handleNameAdd = (e) => {
    setNameAdd(e.target.value);
  };

  const handleNameEdit = (e) => {
    setNameEdit(e.target.value);
  };

  const handleDeletedButton = () => {
    const parentNode = findParent(oldTreeData, node.name);
    console.log(parentNode);
    if (parentNode === null) {
      return;
    }
    const updatedChildren = parentNode.children.filter(
      (obj) => obj.name !== node.name
    );
    parentNode.children.splice(
      0,
      parentNode.children.length,
      ...updatedChildren
    );
    const updatedOldTreeData = findAndReplaceObject(
      parentNode.name,
      parentNode,
      oldTreeData,
      "edit"
    );
    setNode(parentNode);
    sendUpdateThree(updatedOldTreeData);
  };
  const exportToPDF = () => {
    const element = document.getElementById("pdf-content");
    const opt = {
      margin: [0, 0, 0, 0],
      filename: "tree.pdf",
      image: { type: "jpeg", quality: 0.9 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        return pdf.output("arraybuffer");
      })
      .then((buffer) => {
        const formData = new FormData();
        formData.append(
          "pdfFile",
          new Blob([buffer], { type: "application/pdf" }),
          "three.pdf"
        );
        formData.append("fieldName", "tree");

        return axios.post(
          `${process.env.REACT_APP_SERVER_API}/agile/` +
            dashboardId +
            "/folder",
          formData
        );
      })
      .then((response) => {
        toast.success("Votre Arbre a été ajouté a votre dossier agile", {
          duration: 5000,
        });
      })
      .catch((error) => {
        toast.error(
          "Une erreur s'est produite veuillez réessayer ultérieurement" + error,
          {
            duration: 5000,
          }
        );
      });
  };
  const findAndReplaceObject = (targetName, newBranch, oldTreeData, mode) => {
    let updatedOldTreeData = { ...oldTreeData };
    if (updatedOldTreeData.name === targetName) {
      if (updatedOldTreeData.children) {
        if (mode === "add") {
          updatedOldTreeData.children.push(newBranch);
        } else if (mode === "edit") {
          updatedOldTreeData = { ...newBranch };
        }
      }
    } else if (updatedOldTreeData.children) {
      updatedOldTreeData.children = updatedOldTreeData.children.map((child) =>
        findAndReplaceObject(targetName, newBranch, child, mode)
      );
    }
    return updatedOldTreeData;
  };

  return (
    <>
      <Toaster />
      <div
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className="headerDraw">
          <div className="titleDraw">
            {isEditingName ? (
              <TextField
                value={nameEdit}
                onChange={handleNameEdit}
                onBlur={handleEditButton}
              />
            ) : (
              <>
                <Typography color="text.default" align="center" variant="h5">
                  Élement sélectionné :
                </Typography>
                <Typography
                  color="text.default"
                  align="center"
                  variant="body1"
                  style={{ cursor: "pointer" }}
                  onClick={handleNameClick}
                >
                  {node.name}
                </Typography>
              </>
            )}
          </div>
        </div>
        <div>
          <IconButton onClick={handleDeletedButton}>
            <DeleteIcon color="error" />
          </IconButton>
        </div>
        <div className="addSection">
          <div>
            <TextField
              value={nameAdd}
              onChange={handleNameAdd}
              label="Ajouter un élément"
            />
            <IconButton onClick={handleAddButton}>
              <AddIcon color="success" />
            </IconButton>
          </div>
        </div>
        <div>
          <Button variant="contained" onClick={exportToPDF}>
            Ajouter au dossier à Agile
          </Button>
        </div>
      </div>
    </>
  );
};

export default DrawTools;
