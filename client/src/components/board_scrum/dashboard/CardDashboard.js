import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { Box, Button, CardActionArea, Typography } from "@mui/material";

export default function CardDashboard({ picture, sprint_group, fav, isFavoris, id }) {
  const moveToOverView = () => {
    var x = JSON.parse(localStorage.getItem("tabs")) || [];
    var push = true;
    for (var tab of x) {
      if (tab.id === id) {
        push = false;
      }
    }
    if (push) {
      x.push({ id: id, type: "overView", label: `OverView ${sprint_group}` });
      localStorage.setItem("tabs", JSON.stringify(x));
    }
    localStorage.setItem("activeTab", JSON.stringify(id));
  };
  return (
    <CardActionArea onClick={moveToOverView} sx={{ height: 150, maxWidth: 345 }}>
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
          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: "bold",
              backgroundColor: "#000000a8",
              width: "fit-content",
            }}
          >
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
                <StarIcon sx={{ color: "purple" }} />
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
