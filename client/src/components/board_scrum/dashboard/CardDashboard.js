import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import CardActions from "@material-ui/core/CardActions";
import { Button, Typography } from "@mui/material";
import { PropTypes } from "prop-types";
import OverView from "../../../pages/board_scrum/overview/OverView";

CardDashboard.propTypes = {
  picture: PropTypes.string.isRequired,
  sprint_group: PropTypes.string.isRequired,
  fav: PropTypes.bool.isRequired,
  isFavoris: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
CardDashboard.defaultProps = {
  isFavoris: () => {},
};

export default function CardDashboard({
  addTab,
  picture,
  sprint_group,
  fav,
  isFavoris,
  id,
}) {
  const moveToOverView = () => {
    var x = JSON.parse(localStorage.getItem("tabs")) || [];
    x.push({
      id: id,
      label: `OverView ${sprint_group}`,
      closeable: true,
      tab: "OverView " + sprint_group,
      component: <OverView id={id} addTab={addTab} />,
    });
    localStorage.setItem("tabs", JSON.stringify(x));

    addTab({
      id: id,
      label: `OverView ${sprint_group}`,
      closeable: true,
      tab: "OverView " + sprint_group,
      component: <OverView id={id} addTab={addTab} />,
    });
  };
  return (
    <Card
      onClick={moveToOverView}
      sx={{
        height: 150,
        maxWidth: 345,
        backgroundImage: `url(${picture})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        opacity: 0.8,
        position: "relative",
        cursor: "pointer",
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
      </CardContent>
      <CardActions
        style={{
          display: "flex",
          flexDirection: "row-reverse",
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
              isFavoris(id, !fav);
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
              isFavoris(id, !fav);
            }}
          >
            <StarBorderIcon sx={{ color: "purple" }} />
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
