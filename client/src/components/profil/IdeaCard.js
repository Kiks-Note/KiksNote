import {Image} from "@mui/icons-material";
import {Typography} from "@mui/material";
import React from "react";

function IdeaCard({image, name, id, onClick}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "5px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
        textAlign: "center",
        cursor: "pointer",
        width: "300px",
        height: "250px",
      }}
    >
      <img
        src={image}
        style={{
          width: "300px",
          height: "200px",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          width: "100%",
          height: "50px",
          borderBottomLeftRadius: "5px",
          borderBottomRightRadius: "5px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "poppins-semiBold",
            color: "#000",
          }}
        >
          {name}
        </Typography>
      </div>
    </div>
  );
}

export default IdeaCard;
