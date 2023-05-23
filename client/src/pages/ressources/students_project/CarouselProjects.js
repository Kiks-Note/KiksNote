import React, { useState } from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { EffectCoverflow, Pagination, Navigation } from "swiper";

import "./CarouselProjects.scss";

const CarouselProjects = ({ projects }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + projects.length) % projects.length
    );
  };
  if (projects.length === 0) {
    return <div>No items to display</div>;
  }

  const activeItem = projects[activeIndex];

  return (
    <div className="carousel-container">
      <button onClick={handlePrev}>Previous</button>
      <div className="carousel">
        <Swiper
          spaceBetween={50}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          onSwiper={(swiper) => console.log(swiper)}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
            clickable: true,
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="swiper_container"
        >
          <SwiperSlide>
            <Card>
              <CardContent>
                <CardMedia
                  component="img"
                  alt={activeItem.nameProject}
                  height="500"
                  image={activeItem.imgProject}
                />
                <Typography variant="h5">{activeItem.nameProject}</Typography>
                {activeItem.descriptionProject && (
                  <Typography variant="body2">
                    {activeItem.descriptionProject}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </SwiperSlide>
        </Swiper>
      </div>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default CarouselProjects;
