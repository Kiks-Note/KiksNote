import React from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

import useFirebase from "../../../hooks/useFirebase";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import BackHandRoundedIcon from "@mui/icons-material/BackHandRounded";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { EffectCoverflow, Pagination, Navigation } from "swiper";

import "./CarouselProjects.scss";
import "react-toastify/dist/ReactToastify.css";

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
  const { user } = useFirebase();
  const userStatus = user?.status;

  const referStudentProject = async (
    projectId,
    projectName,
    countRefAdd,
    userId
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5050/ressources/refprojects",
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

  return (
    <div className="carousel-container">
      <div className="carousel">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="swiper_container"
          style={{ maxWidth: "80%" }}
        >
          {props.topProjects.map((project) => (
            <SwiperSlide key={project.id}>
              <Card onClick={() => props.handleOpenProject(project.id)}>
                <CardContent>
                  <CardMedia
                    component="img"
                    alt={project.nameProject}
                    height="500"
                    image={project.imgProject}
                  />

                  <Typography variant="h5">{project.nameProject}</Typography>
                  <Typography variant="h5">{project.typeProject}</Typography>
                  <Typography variant="h5">
                    {project.promoProject.name}
                  </Typography>
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
                      sx={{ color: "#7a52e1" }}
                    >
                      {project.counterRef}{" "}
                      <BackHandRoundedIcon sx={{ marginLeft: "3px" }} />
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
                      sx={{ color: "#7a52e1" }}
                    >
                      {project.counterRef}{" "}
                      <BackHandRoundedIcon sx={{ marginLeft: "3px" }} />
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
                      sx={{ color: "#7a52e1" }}
                    >
                      {project.counterRef}{" "}
                      <BackHandRoundedIcon sx={{ marginLeft: "3px" }} />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
        <ToastContainer></ToastContainer>
      </div>
    </div>
  );
};

export default CarouselProjects;
