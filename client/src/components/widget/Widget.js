import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material";

import "./Widget.scss";

function Widget({ handleOpen, image, text, path }) {
  const theme = useTheme();

  return (
    <div className="home-dashboard-item" onClick={() => handleOpen()}>
      <Link to={path}>
        <img
          src={image}
          alt="illustration"
          style={{
            backgroundColor: theme.palette.custom.button,
          }}
        />
        <div
          className="home-dashboard-item-content"
          style={{
            backgroundColor: theme.palette.background.container,
          }}
        >
          <p
            style={{
              color: theme.palette.text.primary,
            }}
          >
            {text}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default Widget;
