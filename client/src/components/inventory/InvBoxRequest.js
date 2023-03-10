import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ClearIcon from "@mui/icons-material/Clear";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const faces = [
  "http://i.pravatar.cc/300?img=1",
  "http://i.pravatar.cc/300?img=2",
  "http://i.pravatar.cc/300?img=3",
  "http://i.pravatar.cc/300?img=4",
];

export default function InvBoxRequest({
  image,
  label,
  reference,
  category,
  campus,
  status,
  onClickRequest,
  acceptRequest,
  refuseRequest,
}) {
  const [statusColor, setStatusColor] = useState("");
  const [deviceStatus, setDeviceStatus] = useState("");
  const admin = true;

  useEffect(() => {
    if (status === "available") {
      setStatusColor("#4CAF50");
      setDeviceStatus("Disponible");
    } else if (status === "requested") {
      setStatusColor("#FFC107");
      setDeviceStatus("Demandé");
    } else if (status === "unavailable") {
      setStatusColor("#E44434");
      setDeviceStatus("Indisponible");
    } else if (status === "borrowed") {
      setStatusColor("#2196F3");
      setDeviceStatus("Emprunté");
    }
  }, [status]);

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
          style={{paddingTop: "56.25%"}}
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
            Reference : {reference}
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
          <Typography
            paragraph
            className={"MuiTypography--subheading"}
            variant={"caption"}
            sx={{fontSize: 14, fontFamily: "poppins-regular"}}
          >
            Demandé par : Rui Gaspar
          </Typography>
          <Typography
            paragraph
            className={"MuiTypography--subheading"}
            variant={"caption"}
            sx={{fontSize: 14, fontFamily: "poppins-regular"}}
          >
            Pour le : 12/12/2021
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            {onClickRequest && (
              <IconButton onClick={onClickRequest}>
                <AccessibilityNewIcon />
              </IconButton>
            )}
            <>
              <Tooltip title="Accepter la demande">
                <IconButton onClick={acceptRequest}>
                  <CheckIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refuser la demande">
                <IconButton onClick={refuseRequest}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
