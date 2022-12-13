import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import PersonIcon from "@mui/icons-material/Person";
import LabelIcon from "@mui/icons-material/Label";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import BallotIcon from "@mui/icons-material/Ballot";

export default function boardModal(props) {
  const style = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    margin: 0,
  };

  const style_card = {
    display: "flex",
  };

  const style_item_button = {
    backgroundColor: "#eeeee4",
    margin: "1vh 0 0 0vh",
  };

  const style_text = {
    margin: "1vh 0 0 2vh",
  };
  const style_title = {
    margin: "0 0 0 2vh",
  };

  const info = props.info;
  return (
    <Card sx={style}>
      <div>
        <CardHeader title={info.name} avatar={<BallotIcon color="primary"></BallotIcon>} />
      </div>

      <CardContent sx={style_card}>
        <div>
          <Typography sx={style_title}>Description</Typography>
          <Typography variant="body2" color="text.secondary" sx={style_text}>
            {info.desc}
          </Typography>
        </div>
        <List>
          <ListItem disablePadding sx={style_item_button}>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Assigné" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={style_item_button}>
            <ListItemButton>
              <ListItemIcon>
                <LabelIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Etiquettes" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={style_item_button}>
            <ListItemButton>
              <ListItemIcon>
                <EditIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Modifier" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={style_item_button}>
            <ListItemButton>
              <ListItemIcon>
                <DeleteIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Supprimer" />
            </ListItemButton>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
