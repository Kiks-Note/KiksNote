import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const StudentProjectInfo = (props) => {
  const [creatorData, setCreatorData] = useState([]);
  const [promoData, setPromoData] = useState([]);

  const getClassId = async (id) => {
    try {
      await axios
        .get(`http://localhost:5050/ressources/class/${id}`)
        .then((res) => {
          setPromoData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getCreatorProject = async (id) => {
    try {
      await axios
        .get(`http://localhost:5050/ressources/student/${id}`)
        .then((res) => {
          setCreatorData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getClassId(props.projectData.promoProject);
    // Fix backend iddoc user
    // getCreatorProject(props.projectData.StudentId);
  }, []);

  console.log(props.projectData.createdProjectAt);

  return (
    <Dialog
      open={props.openProject}
      onClose={props.handleCloseProject}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "40%",
          width: "100%",
          height: "90%",
          maxHeight: "90%",
          overflowY: "visible",
          overflowX: "hidden",
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          top: "47%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          "@media (max-width: 600px)": {
            width: "100%",
            maxHeight: "100%",
            margin: 0,
          },
        },
      }}
    >
      <DialogActions
        sx={{
          backgroundImage: `url(${props.projectData.imgProject})`,
          height: "400px",
          backgroundSize: "cover",
        }}
      >
        <IconButton
          sx={{ position: "fixed", top: "2%", backgroundColor: "grey" }}
          onClick={props.handleCloseProject}
        >
          <CloseIcon />
        </IconButton>
      </DialogActions>
      <DialogTitle>{props.projectData.nameProject}</DialogTitle>
      <DialogContent dividers>
        <Typography>{props.projectData.typeProject}</Typography>
        <Typography>{props.projectData.descriptionProject}</Typography>
        <a href={props.projectData.RepoProjectLink}>Lien pour le github</a>
        <Typography sx={{ textAlign: "right" }}>
          {/* {props.projectData.memberProject} */}
          {promoData && promoData.data && promoData.data.name}
        </Typography>
        <Typography>{props.projectData.counterRef}</Typography>
        <Typography></Typography>
        <Typography>{creatorData}</Typography>
      </DialogContent>
    </Dialog>
  );
};
export default StudentProjectInfo;
