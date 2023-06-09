import React from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";

import useFirebase from "../../../hooks/useFirebase";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import BackHandRoundedIcon from "@mui/icons-material/BackHandRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import MediationRoundedIcon from "@mui/icons-material/MediationRounded";
import SchoolIcon from "@mui/icons-material/School";

import {Splide, SplideSlide} from "@splidejs/react-splide";

import "@splidejs/react-splide/css/sea-green";

import studentTopProjectsImg from "../../../assets/img/students-top-projects.jpg";

import "./CarouselProjects.scss";
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from "react-router-dom";

const options = {
  autoClose: 2000,
  className: "",
  position: toast.POSITION.TOP_RIGHT,
  theme: "colored",
};

export const toastSuccess = (message) => {
  toast.success(message, options);
};

export const toastWarning = (message) => {
  toast.warning(message, options);
};

export const toastFail = (message) => {
  toast.error(message, options);
};

const CarouselProjects = (props) => {
  const {user} = useFirebase();
  const userStatus = user?.status;

  let navigate = useNavigate();

  const referStudentProject = async (
    projectId,
    projectName,
    countRefAdd,
    userId
  ) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_API}/ressources/refprojects`,
        {
          projectId: projectId,
          counterRefToAdd: countRefAdd,
          userId: userId,
        }
      );

      if (response.data.message === "Projet étudiant mis à jour avec succès.") {
        toastSuccess(`Vous avez bien mis en avant le projet ${projectName}`);
      } else {
        toastWarning(`Vous avez déjà mis en avant le projet ${projectName}!`);
      }
    } catch (error) {
      console.log(error.response.status);
      console.log(error.response.data.message);
      toastWarning(`Erreur lors de la mise en avant du projet ${projectName}`);
    }
  };

  var votePo = 5;
  var votePedago = 3;
  var voteStudent = 1;

  if (props.topProjects.length === 0) {
    return (
      <>
        <div className="no-projects-container">
          <p>Aucun projet étudiant en top 10 publié pour le moment</p>
          <img
            className="no-class-img"
            src={studentTopProjectsImg}
            alt="no-students-top-projects-uploaded"
          />
        </div>
      </>
    );
  }

  return (
    <div className="carousel-container">
      <div className="carousel">
        <Splide
          options={{
            rewind: true,
            type: "slide",
            perPage: 1,
            perMove: 1,
            autoplay: true,
            pauseOnHover: false,
            gap: "1rem",
            pagination: true,
            arrows: true,
          }}
          className="splide_container"
        >
          {props.topProjects.map((project) => (
            <SplideSlide key={project.id}>
              <Card onClick={() => navigate(project.id)}>
                <CardContent>
                  <CardMedia
                    component="img"
                    alt={project.nameProject}
                    image={project.imgProject}
                    height="700"
                  />
                  <Typography variant="h5" sx={{fontWeight: "bold"}}>
                    {project.nameProject}
                  </Typography>
                  <div className="type-promo-project-container">
                    {project.typeProject === "Web" ? (
                      <div className="project-type-typo">
                        <Typography variant="h5">
                          {project.typeProject}
                        </Typography>
                        <DesktopWindowsRoundedIcon sx={{marginLeft: "5px"}} />
                      </div>
                    ) : project.typeProject === "Mobile" ? (
                      <div className="project-type-typo">
                        <Typography variant="h5">
                          {project.typeProject}
                        </Typography>
                        <SmartphoneRoundedIcon sx={{marginLeft: "5px"}} />
                      </div>
                    ) : project.typeProject === "Gaming" ? (
                      <div className="project-type-typo">
                        <Typography variant="h5">
                          {project.typeProject}
                        </Typography>
                        <SportsEsportsRoundedIcon sx={{marginLeft: "5px"}} />
                      </div>
                    ) : project.typeProject === "IA" ? (
                      <div className="project-type-typo">
                        <Typography variant="h5">
                          {project.typeProject}
                        </Typography>
                        <SmartToyRoundedIcon sx={{marginLeft: "5px"}} />
                      </div>
                    ) : project.typeProject === "DevOps" ? (
                      <div className="project-type-typo">
                        <Typography variant="h5">
                          {project.typeProject}
                        </Typography>
                        <MediationRoundedIcon sx={{marginLeft: "5px"}} />
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <Chip
                      sx={{
                        display: "flex",
                        padding: "10px",
                      }}
                      label={
                        <>
                          <div style={{display: "flex"}}>
                            <Typography>{project.promoProject.name}</Typography>
                            <SchoolIcon />
                          </div>
                        </>
                      }
                    ></Chip>
                  </div>

                  {userStatus === "po" ? (
                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                        referStudentProject(
                          project.id,
                          project.nameProject,
                          votePo,
                          user?.id
                        );
                      }}
                      sx={{color: "#7a52e1"}}
                    >
                      {project.counterRef}{" "}
                      <BackHandRoundedIcon sx={{marginLeft: "3px"}} />
                    </Button>
                  ) : userStatus === "pedago" ? (
                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                        referStudentProject(
                          project.id,
                          project.nameProject,
                          votePedago,
                          user?.id
                        );
                      }}
                      sx={{color: "#7a52e1"}}
                    >
                      {project.counterRef}{" "}
                      <BackHandRoundedIcon sx={{marginLeft: "3px"}} />
                    </Button>
                  ) : (
                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                        referStudentProject(
                          project.id,
                          project.nameProject,
                          voteStudent,
                          user?.id
                        );
                      }}
                      sx={{color: "#7a52e1"}}
                    >
                      {project.counterRef}{" "}
                      <BackHandRoundedIcon sx={{marginLeft: "3px"}} />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </SplideSlide>
          ))}
        </Splide>
        <ToastContainer></ToastContainer>
      </div>
    </div>
  );
};

export default CarouselProjects;
