import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Button, Typography } from "@material-ui/core";
import useFirebase from "../../hooks/useFirebase";
import "./agile.css";

export default function AgileHome({ dashboardId, actorId }) {
  const { user } = useFirebase();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wsComments = new w3cwebsocket(`ws://localhost:5050/agile`);
    wsComments.onopen = function (e) {
      wsComments.send(
        JSON.stringify({ dashboardId: dashboardId, actorId: actorId })
      );
    };
    wsComments.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        setLoading(true);
        console.error(error);
      }
    };
  }, []);

  return (
    <Grid container>
      <Grid item xs={2}></Grid>
    </Grid>
  );
}
