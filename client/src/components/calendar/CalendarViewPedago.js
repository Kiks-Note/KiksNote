import { useState, useEffect } from "react";
import { Typography, Button, Grid, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import { w3cwebsocket } from "websocket";

export default function CalendarViewPedago() {
  const [allClass, setAllClass] = useState([]);
  useEffect(() => {
    const fetchSocket = async () => {
      const wsComments = new w3cwebsocket(
        `ws://localhost:5050/calendar/pedago`
      );

      wsComments.onopen = function (e) {};

      wsComments.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setAllClass(data);
      };
    };

    fetchSocket();
  }, []);
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h2">
            Calendrier des formations
          </Typography>
        </Grid>
        {allClass.map((card) => (
          <Grid item key={card.id} xs={12} sm={6} md={4}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "1rem",
              }}
            >
              <Typography variant="h5" component="h2">
                {card.name} {card.promo}
              </Typography>
              <Button
                component={Link}
                to={`/calendrier/${card.id}`}
                size="small"
                variant="contained"
              >
                Accéder 
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
