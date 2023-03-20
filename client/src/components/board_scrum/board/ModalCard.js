import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import PersonIcon from "@mui/icons-material/Person";
import LabelIcon from "@mui/icons-material/Label";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { List, Box, Button } from "@mui/material/";
import ListItem from "@mui/material/ListItem";
import BallotIcon from "@mui/icons-material/Ballot";
import TextField from "@mui/material/TextField";
import CircleIcon from "@mui/icons-material/Circle";
import NotesIcon from "@mui/icons-material/Notes";

export default function ModalCard(props) {
  const info = props.info;
  //NAME LISTENER
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(info.name);
  //DESCRIPTION LISTENER
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(info.desc);

  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionChange = (event) => {
    setDescriptionValue(event.target.value);
  };

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameChange = (event) => {
    setNameValue(event.target.value);
  };
  const handleSaveClick = () => {
    setIsEditingDescription(false);
  };
  const handleCancelClick = () => {
    setIsEditingDescription(false);
  };
  const handleNameBlur = (event) => {
    setNameValue(event.target.value);
    setIsEditingName(false);
  };
  const style = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "#FFFFFF",
    boxShadow: 24,
    margin: 0,
  };

  const style_card = {
    display: "flex",
  };

  const style_item_button = {
    margin: "1vh 0 0 0vh",
  };

  const style_text = {
    margin: "1vh 0 0 2vh",
  };
  const style_title = {
    margin: "0 0 0 2vh",
    color: "text.default",
  };

  var Labels = null;

  if (props.Label != null) {
    Labels = props.Label.map((label) => (
      <div
        style={{
          display: "flex",
          backgroundColor: label.color + "A6",
          borderColor: label.color,
          borderStyle: "solid",
          borderRadius: "3px",
          marginRight: "5px",
          fontSize: "medium",
          padding: "3px",
          marginBottom: "5%",
        }}
      >
        <CircleIcon
          style={{
            color: label.color,
          }}
        ></CircleIcon>
        <p style={{}}>{label.name}</p>
      </div>
    ));
  }

  const deleteCard = () => {
    // axios
    //   .delete(`/api/element/${props.id}`)
    //   .then((response) => {
    //    window.location.reload();
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     // gérer l'erreur
    //   });
    console.log("Faut faire le back tu crois quoi ");
  };

  return (
    <Card sx={style}>
      <div>
        <CardHeader
          title={
            isEditingName ? (
              <TextField
                inputProps={{
                  style: { color: "black" },
                }}
                value={nameValue}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
              />
            ) : (
              <Typography color="text.default" variant="h5" onClick={handleNameClick}>
                {nameValue}
              </Typography>
            )
          }
          subheader={<Typography color="text.default">In list {props.list_name}</Typography>}
          avatar={
            <BallotIcon
              sx={{
                fontSize: 50,
              }}
              color="primary"
            ></BallotIcon>
          }
          titleTypographyProps={{
            variant: "h5",
          }}
        />
        <CardContent sx={style_card}>
          <div style={{ width: "-webkit-fill-available" }}>
            <div>
              <Typography sx={style_title} color="text.default">
                {" "}
                <LabelIcon style={{ color: "gray", marginRight: "5px" }} />
                Étiquettes
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  marginLeft: "2vh",
                  color: "text.default",
                }}
              >
                {Labels}
              </Typography>
            </div>
            <div>
              <Typography sx={style_title}>
                <NotesIcon style={{ color: "gray", marginRight: "5px" }} />
                Description
              </Typography>
              {isEditingDescription || descriptionValue === "" ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexDirection: "column" }}>
                  <TextField
                    inputProps={{ style: { color: "black" } }}
                    sx={{ width: "100%" }}
                    value={descriptionValue}
                    onChange={handleDescriptionChange}
                    placeholder="Ajouter une description…"
                    multiline
                    maxRows={4}
                  />
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      margin: "5px",
                      width: "100%",
                    }}
                  >
                    <Button variant="contained" color="primary" onClick={handleSaveClick} disabled={!descriptionValue}>
                      Enregistrer
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancelClick}
                      disabled={!descriptionValue}
                    >
                      Annuler
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography color="text.default" onClick={handleDescriptionClick} sx={style_text}>
                  {descriptionValue}
                </Typography>
              )}
            </div>
          </div>
          <List>
            <ListItem disablePadding sx={style_item_button}>
              <ListItemButton>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Rejoindre" primaryTypographyProps={{ color: "text.default" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={style_item_button}>
              <ListItemButton>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Membres" primaryTypographyProps={{ color: "text.default" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={style_item_button}>
              <ListItemButton>
                <ListItemIcon>
                  <LabelIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Etiquettes" primaryTypographyProps={{ color: "text.default" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={style_item_button}>
              <ListItemButton onClick={deleteCard}>
                <ListItemIcon>
                  <DeleteIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Supprimer" primaryTypographyProps={{ color: "text.default" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </CardContent>
      </div>
    </Card>
  );
}
