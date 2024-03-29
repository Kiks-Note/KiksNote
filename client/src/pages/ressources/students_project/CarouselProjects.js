import React, { useState } from "react";
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
  Skeleton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import BackHandRoundedIcon from "@mui/icons-material/BackHandRounded";
import DoNotTouchRoundedIcon from "@mui/icons-material/DoNotTouchRounded";
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
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  /* 
    Update the project identified by the projectId (String) adding countRefAdd (int)
  */

  const referStudentProject = async (
    projectId,
    projectName,
    countRefAdd,
    userId
  ) => {
    try {
      setTimeout(async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_SERVER_API}/ressources/refprojects`,
            {
              projectId: projectId,
              counterRefToAdd: countRefAdd,
              userId: userId,
            }
          );
          // const currentUserHighlightedProject = props.topProjects.find(
          //   (project) => project.voters.some((voter) => voter.id === userId)
          // );

          // if (currentUserHighlightedProject) {
          //   toastWarning(
          //     `Vous avez déjà mis en avant le projet ${projectName}!`
          //   );
          // } else {
          //   toastSuccess(
          //     `Vous avez bien mis en avant le projet ${projectName}`
          //   );
          // }
          if (
            response.data.message === "Projet étudiant mis à jour avec succès."
          ) {
            toastSuccess(
              `Vous avez bien mis en avant le projet ${projectName}`
            );
          }
        } catch (error) {
          if (
            error.response.status === 403 &&
            error.response.data.message ===
              "Vous avez déjà mise en avant ce projet."
          ) {
            toastWarning(
              `Vous avez déjà mise en avant le projet ${projectName}`
            );
          }
        } finally {
          setLoading(false);
        }
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  const removeReferStudentProject = async (
    projectId,
    projectName,
    counterRefToRemove,
    userId
  ) => {
    try {
      setTimeout(async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_SERVER_API}/ressources/removerefprojects`,
            {
              projectId: projectId,
              counterRefToRemove: counterRefToRemove,
              userId: userId,
            }
          );
          if (
            response.data.message === "Projet étudiant mis à jour avec succès."
          ) {
            toastSuccess(
              `Vous avez enlevé votre mise en avant du projet ${projectName}`
            );
          }
        } catch (error) {
          if (
            error.response.status === 403 &&
            error.response.data.message ===
              "Vous n'avez pas encore mis en avant ce projet."
          ) {
            toastWarning(
              `Vous n'avez pas encore mis en avant le projet ${projectName}`
            );
          }
        } finally {
          setLoading(false);
        }
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  var votePo = 5;
  var votePedago = 3;
  var voteStudent = 1;

  if (props.loading) {
    return (
      <>
        <Skeleton variant="rectangular" width="100%" height={800} />
      </>
    );
  }

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
                    height="500"
                    style={{ objectFit: "contain" }}
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
                    <div className="type-promo-project-container">
                      {project.promoProject.map &&
                        project.promoProject.map((promo) => (
                          <Chip
                            sx={{
                              display: "flex",
                              padding: "10px",
                            }}
                            label={
                              <>
                                <div style={{ display: "flex" }}>
                                  <Typography>{promo.name}</Typography>
                                  <SchoolIcon />
                                </div>
                              </>
                            }
                          ></Chip>
                        ))}
                    </div>
                  </div>
                  <div className="type-promo-project-container">
                    {project?.technosProject?.map((techno) => (
                      <Chip
                        avatar={<Avatar alt={techno.name} src={techno.image} />}
                        sx={{
                          display: "flex",
                          padding: "10px",
                        }}
                        label={
                          <>
                            <div style={{ display: "flex" }}>
                              <Typography>{techno.name}</Typography>
                            </div>
                          </>
                        }
                      ></Chip>
                    ))}
                  </div>

                  {userStatus === "po" ? (
                    <>
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
                        sx={{ color: "#df005a" }}
                      >
                        {loading ? (
                          <CircularProgress sx={{ color: "#df005a" }} />
                        ) : (
                          <>
                            {project.counterRef}{" "}
                            <BackHandRoundedIcon
                              sx={{ marginLeft: "3px", color: "#df005a" }}
                            />
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          removeReferStudentProject(
                            project.id,
                            project.nameProject,
                            votePo,
                            user?.id
                          );
                        }}
                        sx={{ color: "#7a52e1" }}
                      >
                        {loading ? (
                          <CircularProgress sx={{ color: "#7a52e1" }} />
                        ) : (
                          <>
                            <DoNotTouchRoundedIcon />
                          </>
                        )}
                      </Button>
                    </>
                  ) : userStatus === "pedago" ? (
                    <>
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
                        sx={{ color: "#df005a" }}
                      >
                        {loading ? (
                          <CircularProgress sx={{ color: "#7a52e1" }} />
                        ) : (
                          <>
                            {project.counterRef}{" "}
                            <BackHandRoundedIcon
                              sx={{ marginLeft: "3px", color: "#df005a" }}
                            />
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          removeReferStudentProject(
                            project.id,
                            project.nameProject,
                            votePedago,
                            user?.id
                          );
                        }}
                        sx={{ color: "#7a52e1" }}
                      >
                        {loading ? (
                          <CircularProgress sx={{ color: "#7a52e1" }} />
                        ) : (
                          <>
                            <DoNotTouchRoundedIcon />
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
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
                        sx={{ color: "#df005a" }}
                      >
                        {loading ? (
                          <CircularProgress sx={{ color: "#df005a" }} />
                        ) : (
                          <>
                            {project.counterRef}{" "}
                            <BackHandRoundedIcon
                              sx={{ marginLeft: "3px", color: "#df005a" }}
                            />
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          removeReferStudentProject(
                            project.id,
                            project.nameProject,
                            voteStudent,
                            user?.id
                          );
                        }}
                        sx={{ color: "#7a52e1" }}
                      >
                        {loading ? (
                          <CircularProgress sx={{ color: "#7a52e1" }} />
                        ) : (
                          <>
                            <DoNotTouchRoundedIcon />
                          </>
                        )}
                      </Button>
                    </>
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
