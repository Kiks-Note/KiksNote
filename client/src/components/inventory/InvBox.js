import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ClearIcon from "@mui/icons-material/Clear";

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
  status,
  onClickRequest,
  request = false,
  acceptRequest,
  refuseRequest,
}) {
  const [statusColor, setStatusColor] = useState("");

  useEffect(() => {
    if (status === "available") {
      setStatusColor("#4CAF50");
    } else if (status === "requested") {
      setStatusColor("#FFC107");
    } else if (status === "unavailable" || status === "borrowed") {
      setStatusColor("#E44434");
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
            className={"MuiTypography--subheading"}
            variant={"caption"}
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: 14,
              fontFamily: "poppins-regular",
            }}
            // paragraph
          >
            Statut :
            <Box
              sx={{
                height: 10,
                width: 10,
                backgroundColor: statusColor,
                borderRadius: 10,
                marginLeft: 1,
                boxShadow: "10 0 0 1px #fff",
              }}
            />
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
            {request && (
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// const WrappedApp = withStyles(styles)(InvBox);

// const rootElement = document.getElementById("root");
// ReactDOM.render(<WrappedApp />, rootElement);
