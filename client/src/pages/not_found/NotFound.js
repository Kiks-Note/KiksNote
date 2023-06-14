import { Typography, Box, Container } from "@mui/material";
import React from "react";
import "./NotFound.scss";
function NotFound() {
  return (
    <Container>
      <div className="section">
        <h1 className="error">404</h1>
        <Box style={{ margin: "2%" }}>
          <Typography variant="h5" sx={{ margin: "2" }}>
            Ooops!!! La page que vous recherchez n'existe pas.
          </Typography>
        </Box>

        <a className="back-home" href="/">
          Retour à l'accueil
        </a>
      </div>
    </Container>
  );
}

export default NotFound;
