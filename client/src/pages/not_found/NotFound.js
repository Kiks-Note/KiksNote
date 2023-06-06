import notFoundImg from "./../../assets/img/not_found.svg";
import React from "react";
import { useTheme } from "@mui/material";

import "./NotFound.scss";

function NotFound() {
  const theme = useTheme();

  return (
    <div
      className="section"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#212121",
      }}
    >
      <img
        src={notFoundImg}
        alt="not found"
        style={{
          width: "50%",
          minWidth: "500px",
          maxWidth: "1000px",
        }}
      />
      <a
        className="back-home"
        href="/"
        style={{
          padding: "10px 20px",
          backgroundColor: theme.palette.custom.button,
          fontSize: "20px",
          fontWeight: "bold",
          color: "white",
          borderRadius: "10px",
          textDecoration: "none",
        }}
      >
        Retour à l'accueil
      </a>
    </div>
  );
}

export default NotFound;
