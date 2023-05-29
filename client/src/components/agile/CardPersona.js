import React, { useState, useEffect } from "react";
import {
  Typography,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Grid,
} from "@mui/material";


const CardPersona = ({ info }) => {
      const [civilite, setCivilite] = useState(null);
      useEffect(() => {
   setCivilite(info.gender == "Masculin" ? "Mr" : "Mme");
  }, []);
  return (
    <>
      <Card sx={{ maxWidth: 700 }}>
        <CardHeader
          title={`${info.firstName} ${info.lastName}`}
          subheader={`${info.age} ans ${info.city}, ${info.country}`}
          avatar={
            <Avatar
              alt="Avatar"
              src={info.avatar}
              sx={{ width: 100, height: 100 }}
            />
          }
        />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" color="text.primary">
                Bio:
              </Typography>
              <Typography variant="body2" color="text.primary">
                {info.bio}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" color="text.primary">
                Fristrations:
              </Typography>
              <Typography variant="body2" color="text.primary">
                {info.frustrations}
              </Typography>
              <Typography variant="h6" color="text.primary">
                Objectif:
              </Typography>
              <Typography variant="body2" color="text.primary">
                {info.objectives}
              </Typography>
              <Typography variant="h6" color="text.primary">
                Besoin:
              </Typography>
              <Typography variant="body2" color="text.primary">
                {info.needs}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.primary">
                Me joindre par mail: {info.email}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default CardPersona;
