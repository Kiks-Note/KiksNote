import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { Box, Button, CardActionArea, Typography } from "@mui/material";

export default function CardBoard({ picture, sprint_group, fav, isFavoris }) {
  return (
    <CardActionArea href="#" sx={{ height: 150, maxWidth: 345 }}>
      <Card
        sx={{
          height: 150,
          maxWidth: 345,
          backgroundImage: `url(${picture})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          opacity: 0.8,
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
            {sprint_group}
          </Typography>
          <Box
            sx={{
              zIndex: 500,
              bottom: 0,
              right: "-14px",
              position: "absolute",
            }}
          >
            {fav ? (
              <Button
                size="small"
                variant="text"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  isFavoris();
                }}
              >
                <StarIcon sx={{ color: "purple" }}  />
              </Button>
            ) : (
              <Button
                size="small"
                variant="text"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  isFavoris();
                }}
              >
                <StarBorderIcon sx={{ color: "purple" }} />
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </CardActionArea>
  );
}
