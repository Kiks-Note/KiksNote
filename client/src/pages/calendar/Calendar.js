import { useState, useEffect } from "react";
import moment from "moment";
import { Grid, Typography } from "@material-ui/core";
import axios from "axios";
import CalendarStudent from "../../components/calendar/CalendarStudent";
import CalendarPo from "../../components/calendar/CalendarPo";
import CalendarViewPedago from "../../components/calendar/CalendarViewPedago";

export default function Calendar() {
  const loggedUser = localStorage.getItem("user");
  const loggedUserParsed = JSON.parse(loggedUser);
  const userStatus = loggedUserParsed.status;

  useEffect(() => {
    // Ajoutez ici le code à exécuter après le rendu du composant
  }, []);

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={10}>
        {userStatus === "po" && <CalendarPo />}
        {userStatus === "etudiant" && <CalendarStudent />}
        {userStatus === "pedago" && <CalendarViewPedago />}
      </Grid>
    </Grid>
  );
}
