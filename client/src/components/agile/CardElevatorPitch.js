import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const ElevatorPitchCard = ({ info }) => {
  return (
    <Card className="elevator-pitch-card">
      <CardContent>
        <div className="elevator-paragraphe">
          <Typography variant="h4">Pour </Typography>
          <Typography variant="h4" className="elevator-info">
            {info.forWho},
          </Typography>
        </div>

        <div className="elevator-paragraphe">
          <Typography variant="h4">qui a besoin de </Typography>
          <Typography variant="h4" className="elevator-info">
            {info.needed}
          </Typography>
        </div>
        <div className="elevator-paragraphe">
          <Typography variant="h4">le produit </Typography>
          <Typography variant="h4" className="elevator-info">
            {info.name}, {info.type}
          </Typography>
        </div>
        <div className="elevator-paragraphe">
          <Typography variant="h4">à la différence de </Typography>
          <Typography variant="h4" className="elevator-info">
            {info.alternative}
          </Typography>
        </div>
        <div className="elevator-paragraphe">
          <Typography variant="h4">Notre produit permet </Typography>
          <Typography variant="h4" className="elevator-info">
            {info.difference}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElevatorPitchCard;
