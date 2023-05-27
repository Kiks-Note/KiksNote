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
import BackHandRoundedIcon from "@mui/icons-material/BackHandRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import MediationRoundedIcon from "@mui/icons-material/MediationRounded";

import GitHubLogo from "../../../assets/logo/GitHub-Logo.png";

import "./StudentsProjectsInfo.scss";

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

  return (
    <Dialog
      open={props.openProject}
      onClose={props.handleCloseProject}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "60%",
          width: "100%",
          height: "95%",
          maxHeight: "95%",
          overflowY: "visible",
          overflowX: "hidden",
          position: "fixed",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          top: "47%",
          left: "50%",
          backgroundColor: "#424242",
          backgroundImage: "none",
          transform: "translate(-50%, -50%)",
          "@media (max-width: 600px)": {
            width: "100%",
            maxHeight: "100%",
            margin: 0,
          },
        },
      }}
    >
      <div className="left-side-project">
        <DialogTitle>{props.projectData.nameProject}</DialogTitle>
        <DialogContent
          sx={{
            backgroundImage: `url(${props.projectData.imgProject})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            width: "90%",
          }}
        ></DialogContent>
        <DialogContent sx={{ width: "90%" }}>
          <Typography sx={{ textAlign: "justify" }}>
            {props.projectData.descriptionProject}
          </Typography>
          <Typography>{props.projectData.creatorData}</Typography>
        </DialogContent>
      </div>
      <div className="right-side-project">
        <DialogActions>
          <IconButton
            sx={{ position: "fixed", top: "2%", backgroundColor: "grey" }}
            onClick={props.handleCloseProject}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "300px",
          }}
        >
          {props.projectData.typeProject === "Web" ? (
            <div className="type-project-info-container">
              <Typography>Type du projet : </Typography>
              <DesktopWindowsRoundedIcon />
              <Typography>{props.projectData.typeProject}</Typography>
            </div>
          ) : props.projectData.typeProject === "Mobile" ? (
            <div className="type-project-info-container">
              <Typography>Type du projet : </Typography>
              <SmartphoneRoundedIcon />
              <Typography>{props.projectData.typeProject}</Typography>
            </div>
          ) : props.projectData.typeProject === "Gaming" ? (
            <div className="type-project-info-container">
              <Typography>Type du projet : </Typography>
              <SportsEsportsRoundedIcon />
              <Typography>{props.projectData.typeProject}</Typography>
            </div>
          ) : props.projectData.typeProject === "IA" ? (
            <div className="type-project-info-container">
              <Typography>Type du projet : </Typography>
              <SmartToyRoundedIcon />
              <Typography>{props.projectData.typeProject}</Typography>
            </div>
          ) : props.projectData.typeProject === "DevOps" ? (
            <div className="type-project-info-container">
              <Typography>Type du projet : </Typography>
              <MediationRoundedIcon />
              <Typography>{props.projectData.typeProject}</Typography>
            </div>
          ) : (
            <div></div>
          )}
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            Github :{" "}
            <a
              href={props.projectData.RepoProjectLink}
              style={{ color: "#7a52e1", textDecoration: "underline" }}
            >
              <img
                className="github-logo"
                src={GitHubLogo}
                alt="repo-github-link-logo"
              />
            </a>
          </Typography>
          <Typography>
            {/* {props.projectData.memberProject} */}
            Classe : {promoData && promoData.data && promoData.data.name}
          </Typography>
          <Typography sx={{ color: "#7a52e1" }}>
            {props.projectData.counterRef}
            <BackHandRoundedIcon sx={{ height: "16px" }} />
          </Typography>
        </div>
      </div>
    </Dialog>
  );
};
export default StudentProjectInfo;
