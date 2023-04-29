import React, {useState } from "react";
import moment from "moment";
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import {
  Room,
  Comment,
  DesktopWindows,
  LaptopMac,
  Person,
} from "@mui/icons-material";
import "./DetailCalendar.css";

export default function DetailCalendar(props) {
  const [event, setEvent] = useState(props.event);
  const eventTimeStart = moment(event.start).format("HH:mm:ss");
  const eventDateEnd = moment(event.end.split("T")[0]).format("DD/MM/YYYY");
  const eventTimeEnd = moment(event.end).format("HH:mm:ss");
  const style = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    boxShadow: 24,
    margin: 0,
  };
  const style_card = {
    display: "flex",
    justifyContent: "space-between",
  };
  return (
    <>
      <Card sx={[style, { maxWidth: "50%", minWidth: "fit-content" }]}>
        <div>
          <CardHeader
            title={
              <Typography color="text.default" variant="h6">
                {" "}
                {event.title}
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
          <CardContent sx={style_card}>
            <div style={{ width: "-webkit-fill-available" }}>
              <div>
                <List sx={{ padding: 0 }}>
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Formateur(s):`}
                      secondary={
                        <React.Fragment>
                          {event.instructor.map((inst) => (
                            <ListItemText
                              key={inst.uid}
                              primary={`${inst.lastname} ${inst.firstname}`}
                              component="li"
                            />
                          ))}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <Room />
                    </ListItemIcon>
                    <ListItemText primary={`Salle(s): ${event.location}`} />
                  </ListItem>
                  {event.commentaire && (
                    <ListItem disablePadding>
                      <ListItemIcon>
                        <Comment />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Commentaire ${event.commentaire}`}
                      />
                    </ListItem>
                  )}
                  {event.meteriel && (
                    <ListItem disablePadding>
                      <ListItemIcon>
                        {event.distanciel ? <LaptopMac /> : <DesktopWindows />}
                      </ListItemIcon>
                      <ListItemText primary={`Matériel(s) ${event.meteriel}`} />
                    </ListItem>
                  )}
                  {event.distanciel && (
                    <ListItem disablePadding>
                      <ListItemIcon>
                        <LaptopMac />
                      </ListItemIcon>
                      <ListItemText primary="Distanciel" />
                    </ListItem>
                  )}
                </List>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </>
  );
}
