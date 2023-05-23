import React, { useState } from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

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
    <div>
      <button onClick={handlePrev}>Previous</button>
      <button onClick={handleNext}>Next</button>

      <Card>
        <CardContent>
          <CardMedia
            component="img"
            alt={activeItem.nameProject}
            height="140"
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
    </div>
  );
};

export default CarouselProjects;
