import React, { useState } from "react";

import useFirebase from "../../../hooks/useFirebase";

import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  List,
  ListItem,
  Collapse,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import BackHandRoundedIcon from "@mui/icons-material/BackHandRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import MediationRoundedIcon from "@mui/icons-material/MediationRounded";
import ConstructionIcon from "@mui/icons-material/Construction";
import AddLinkIcon from "@mui/icons-material/AddLink";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import GitHubLogo from "../../../assets/logo/GitHub-Logo.png";
import NoVotesImg from "../../../assets/img/votes-students-projects.svg";

import "./StudentsProjectsInfo.scss";

const StudentProjectInfo = (props) => {
  const { user } = useFirebase();

  const [openVoters, setOpenVoters] = useState(false);

  const handleClickVoters = () => {
    setOpenVoters(!openVoters);
  };

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
          flexDirection: "column",
          justifyContent: "top",
          top: "47%",
          left: "50%",
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
      <DialogTitle>{props.projectData.nameProject}</DialogTitle>
      <DialogActions>
        <IconButton
          sx={{ position: "fixed", top: "2%" }}
          onClick={props.handleCloseProject}
        >
          <CloseIcon />
        </IconButton>
      </DialogActions>
      <div className="project-content">
        <div className="left-side-project">
          {props.projectData.typeProject === "Web" ? (
            <div className="type-project-info-container">
              <Typography sx={{ marginRight: "5px" }}>
                Type du projet :{" "}
              </Typography>
              <Typography> {props.projectData.typeProject}</Typography>
              <DesktopWindowsRoundedIcon sx={{ marginLeft: "5px" }} />
            </div>
          ) : props.projectData.typeProject === "Mobile" ? (
            <div className="type-project-info-container">
              <Typography sx={{ marginRight: "5px" }}>
                Type du projet :{" "}
              </Typography>
              <Typography> {props.projectData.typeProject}</Typography>
              <SmartphoneRoundedIcon sx={{ marginLeft: "5px" }} />
            </div>
          ) : props.projectData.typeProject === "Gaming" ? (
            <div className="type-project-info-container">
              <Typography sx={{ marginRight: "5px" }}>
                Type du projet :{" "}
              </Typography>
              <Typography> {props.projectData.typeProject}</Typography>
              <SportsEsportsRoundedIcon sx={{ marginLeft: "5px" }} />
            </div>
          ) : props.projectData.typeProject === "IA" ? (
            <div className="type-project-info-container">
              <Typography sx={{ marginRight: "5px" }}>
                Type du projet :{" "}
              </Typography>
              <Typography> {props.projectData.typeProject}</Typography>
              <SmartToyRoundedIcon sx={{ marginLeft: "5px" }} />
            </div>
          ) : props.projectData.typeProject === "DevOps" ? (
            <div className="type-project-info-container">
              <Typography sx={{ marginRight: "5px" }}>
                Type du projet :{" "}
              </Typography>
              <Typography> {props.projectData.typeProject}</Typography>
              <MediationRoundedIcon />
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
            Classe :{" "}
            {props.projectData &&
              props.projectData.promoProject &&
              props.projectData.promoProject.name}
          </Typography>
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              border: "10px grey",
              borderRadius: "20px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <Typography>
              <ConstructionIcon /> Membres du projet :{" "}
            </Typography>
            {props.projectData &&
              props.projectData.membersProject &&
              props.projectData.membersProject.map((member, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={member.firstname} src={member.image} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        member.lastname.toUpperCase() + " " + member.firstname
                      }
                      secondary={
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {member.status}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index !== props.projectData.membersProject.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))}
          </List>
          <div className="btn-link-blog-container">
            {props.projectData &&
            props.projectData.creatorProject &&
            props.projectData.creatorProject.id === user?.id ? (
              <Button
                onClick={props.handleClickOpen}
                sx={{
                  backgroundColor: "#de7700",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                <AddLinkIcon />
                Lier à un article blog tuto
              </Button>
            ) : (
              <div></div>
            )}
          </div>
          <div className="list-counter-ref">
            <div className="counter-container">
              <BackHandRoundedIcon sx={{ height: "16px" }} />{" "}
              <Typography>
                {props.projectData.counterRef} Mis en avant
              </Typography>
            </div>
            <Divider />
            <div className="voters-container">
              <Typography
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                Liste des personnes qui ont mis en avant le projet
              </Typography>
              {props.projectData &&
              props.projectData.voters &&
              props.projectData.voters.length > 0 ? (
                <List>
                  <ListItem button onClick={handleClickVoters}>
                    <ListItemText
                      primary={"Afficher"}
                      style={{ textAlign: "center" }}
                    />
                    {openVoters ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={openVoters} timeout="auto" unmountOnExit>
                    <List disablePadding>
                      {props.projectData.voters.map((voter, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            {voter.status === "etudiant" && (
                              <Typography variant="body2" component="span">
                                1
                              </Typography>
                            )}
                            {voter.status === "po" && (
                              <Typography variant="body2" component="span">
                                5
                              </Typography>
                            )}
                            {voter.status === "pedago" && (
                              <Typography variant="body2" component="span">
                                3
                              </Typography>
                            )}
                            <BackHandRoundedIcon sx={{ height: "16px" }} />{" "}
                            <ListItemText
                              primary={
                                voter.lastname.toUpperCase() +
                                " " +
                                voter.firstname
                              }
                            />
                          </ListItem>
                          {index !== props.projectData.voters.length - 1 && (
                            <Divider variant="inset" component="li" />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </Collapse>
                </List>
              ) : (
                <div className="no-votes-student-projects-container">
                  <p className="no-votes-student-projects-p">
                    Personne n'a encore mis en avant votre projet
                  </p>
                  <img
                    className="no-votes-student-projects-img"
                    src={NoVotesImg}
                    alt="no-votes-projects-students"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="right-side-project">
          <img src={props.projectData.imgProject} alt="" />
          <DialogContent>
            <Typography sx={{ textAlign: "justify" }}>
              {props.projectData.descriptionProject}
            </Typography>
            <Typography sx={{ paddingTop: "20px", textAlign: "right" }}>
              Publié par :{" "}
              {props.projectData &&
                props.projectData.StudentId &&
                props.projectData.StudentId.lastname.toUpperCase()}{" "}
              {props.projectData &&
                props.projectData.StudentId &&
                props.projectData.StudentId.firstname}
            </Typography>
          </DialogContent>
        </div>
      </div>
    </Dialog>
  );
};
export default StudentProjectInfo;
