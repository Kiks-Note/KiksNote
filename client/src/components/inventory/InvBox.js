import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";

const faces = [
  "http://i.pravatar.cc/300?img=1",
  "http://i.pravatar.cc/300?img=2",
  "http://i.pravatar.cc/300?img=3",
  "http://i.pravatar.cc/300?img=4",
];

export default function InvBox({
  image,
  label,
  reference,
  category,
  campus,
  onClickRequest,
}) {
  return (
    <div className="App">
      <Card
        className={"classes.card"}
        style={{
          width: 250,

          margin: "auto",
          transition: "0.3s",
          boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
          "&:hover": {
            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
          },
        }}
      >
        <CardMedia
          className={"classes.media"}
          style={{paddingTop: "56.25%", resizeMode: "contain"}}
          image={image}
        />
        <CardContent
          className={"classes.content"}
          style={{
            textAlign: "left",
            flexDirection: "column",
            //    padding: muiBaseTheme.spacing.unit * 3
          }}
        >
          <Typography
            className={"MuiTypography--heading"}
            variant={"h6"}
            gutterBottom
            paragraph
            sx={{fontSize: 14, fontFamily: "poppins-semibold"}}
          >
            {label}
          </Typography>
          <Typography
            paragraph
            className={"MuiTypography--subheading"}
            variant={"caption"}
            sx={{fontSize: 14, fontFamily: "poppins-regular"}}
          >
            Ref : {reference}
          </Typography>
          <Typography
            className={"MuiTypography--subheading"}
            variant={"caption"}
            paragraph
            sx={{fontSize: 14, fontFamily: "poppins-regular"}}
          >
            Categorie : {category}
          </Typography>
          <Typography
            paragraph
            className={"MuiTypography--subheading"}
            variant={"caption"}
            sx={{fontSize: 14, fontFamily: "poppins-regular"}}
          >
            Campus : {campus}
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Tooltip title="Faire une demande">
              <IconButton onClick={onClickRequest}>
                <AccessibilityNewIcon />
              </IconButton>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
