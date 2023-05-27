import React from "react";
import axios from "axios";
import useFirebase from "../../../hooks/useFirebase";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { EffectCoverflow, Pagination, Navigation } from "swiper";

import "./CarouselProjects.scss";

const CarouselProjects = (props) => {
  const { user } = useFirebase();
  const userStatus = user?.status;

  let votePo = 5;
  let votePedago = 3;
  let voteStudent = 1;

  const referStudentProject = async (projectId, countRefAdd) => {
    try {
      await axios
        .post("http://localhost:5050/ressources/refprojects", {
          projectId: projectId,
          counterRefToAdd: countRefAdd,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      throw error;
    }
  };

  let filteredProjects = props.projects;

  if (props.selectedIdFilterClass !== "") {
    filteredProjects = filteredProjects.filter(
      (project) => project.promoProject === props.selectedIdFilterClass
    );
  }

  if (props.selectedFilterType !== "") {
    filteredProjects = filteredProjects.filter(
      (project) => project.typeProject === props.selectedFilterType
    );
  }

  if (filteredProjects.length === 0) {
    return <div>No items to display</div>;
  }

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
        >
          {filteredProjects.map((project) => (
            <SwiperSlide key={project.id}>
              <Card
                onClick={() => {
                  // props.handleOpenProject();
                }}
              >
                <CardContent>
                  <CardMedia
                    component="img"
                    alt={project.nameProject}
                    height="500"
                    image={project.imgProject}
                  />
                  <Typography variant="h5">{project.nameProject}</Typography>
                  {userStatus === "po" ? (
                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                        referStudentProject(project.id, votePo);
                      }}
                    >
                      {project.counterRef} <FavoriteIcon />
                    </Button>
                  ) : userStatus === "pedago" ? (
                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                        referStudentProject(project.id, votePedago);
                      }}
                    >
                      {project.counterRef} <FavoriteIcon />
                    </Button>
                  ) : (
                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                        referStudentProject(project.id, voteStudent);
                      }}
                    >
                      {project.counterRef} <FavoriteIcon />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CarouselProjects;
