import React, { useState } from "react";
import moment from "moment";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardHeader,
} from "@mui/material";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  CardContent,
  Card,
  Typography,
  Button,
  CardMedia,
  Tooltip,
  Chip,
  Avatar,
} from "@mui/material";
import { Room, DesktopWindows, LaptopMac, Person } from "@mui/icons-material";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import SchoolIcon from "@mui/icons-material/School";
import useFirebase from "../../hooks/useFirebase";
import "./DetailCalendar.css";
import { useNavigate } from "react-router-dom";

export default function DetailCalendar(props) {
  console.log(props);
  let navigate = useNavigate();
  const { user } = useFirebase();
  const [event, setEvent] = useState(props.event);
  const eventTimeStart = moment(event.start).format("HH:mm:ss");
  const eventDateEnd = moment(event.end.split("T")[0]).format("DD/MM/YYYY");
  const eventTimeEnd = moment(event.end).format("HH:mm:ss");
  const style = {
    position: "absolute",
    top: "30%",
    left: "30%",
    width: 900,
    boxShadow: 30,
  };
  const style_card = {
    display: "flex",
    justifyContent: "space-between",
  };
  return (
    <>
      <Card sx={[style, { maxWidth: "50%", minWidth: "fit-content" }]}>
        <CardHeader
          title={
            <Typography color="text.default" variant="h6">
              {event.title}{" "}
              <Chip
                label={
                  <>
                    <div style={{ display: "flex" }}>
                      <Typography>{event.courseClass.name}</Typography>
                      <SchoolIcon />
                    </div>
                  </>
                }
              />
            </Typography>
          }
          subheader={
            <Typography color="text.default">
              {" "}
              {eventTimeStart} à {eventTimeEnd} le {eventDateEnd}
            </Typography>
          }
          titleTypographyProps={{
            variant: "h5",
          }}
        />
        <CardMedia
          sx={{
            display: "flex",
            width: "100%",
            maxHeight: "210px",
            minHeight: "210px",
            justifyContent: "center",
            margin: "0",
          }}
          component="img"
          src={event.imageCourseUrl}
          alt="course image"
        />

        <CardContent sx={style_card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <List sx={{ padding: 0 }}>
              <ListItem disablePadding>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText
                  primary={event.instructor.map((inst) => (
                    <Chip
                      avatar={
                        <Avatar
                          key={inst.id}
                          alt={
                            inst.lastname.toUpperCase() +
                            "" +
                            inst.firstname +
                            "photo-profile"
                          }
                          src={inst.image}
                        />
                      }
                      variant="outlined"
                      label={
                        <>
                          <Typography>
                            {inst.lastname.toUpperCase()} {inst.firstname}
                          </Typography>
                        </>
                      }
                    />
                  ))}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  {event.campusNumerique ? <SchoolIcon /> : <Room />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    event.campusNumerique ? "À Distance" : event.location
                  }
                />
              </ListItem>
            </List>
            {user.status === "etudiant" && event.private === true ? (
              <>
                <Tooltip title="Private">
                  <LockRoundedIcon />
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Allez vers le cours ">
                  <IconButton
                    onClick={() => navigate(`/coursinfo/${event.courseId}`)}
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
