import { useState, useEffect } from "react";
import moment from "moment";
import { Grid, Typography } from "@material-ui/core";
import axios from "axios";
import CalendarStudent from "../../components/calendar/CalendarStudent";
import CalendarPo from "../../components/calendar/CalendarPo";
import CalendarViewPedago from "../../components/calendar/CalendarViewPedago";
import useFirebase from "../../hooks/useFirebase";

export default function Calendar() {
  const { user } = useFirebase();
  console.log(user.status);
  useEffect(() => {
    // Ajoutez ici le code à exécuter après le rendu du composant
  }, []);

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={10}>
        {user.status === "po" && <CalendarPo />}
        {user.status === "etudiant" && <CalendarStudent />}
        {user.status === "pedago" && <CalendarViewPedago />}
      </Grid>
    </Grid>
  );
}
