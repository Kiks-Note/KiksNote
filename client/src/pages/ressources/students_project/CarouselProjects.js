import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { EffectCoverflow, Pagination, Navigation } from "swiper";

import "./CarouselProjects.scss";

const CarouselProjects = ({
  projects,
  selectedFilterType,
  selectedIdFilterClass,
}) => {
  const filteredProjects =
    selectedIdFilterClass !== "" && selectedFilterType !== ""
      ? projects.filter(
          (project) =>
            project.promoProject === selectedIdFilterClass &&
            project.typeProject === selectedFilterType
        )
      : projects;

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
              <Card>
                <CardContent>
                  <CardMedia
                    component="img"
                    alt={project.nameProject}
                    height="500"
                    image={project.imgProject}
                  />
                  <Typography variant="h5">{project.nameProject}</Typography>
                  {project.descriptionProject && (
                    <Typography variant="body2">
                      {project.descriptionProject}
                    </Typography>
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
