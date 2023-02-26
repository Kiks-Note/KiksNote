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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import BallotIcon from "@mui/icons-material/Ballot";
import TextField from "@mui/material/TextField";
import CircleIcon from "@mui/icons-material/Circle";

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

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    // ! ADD CODE TO UPDATE DESCRIPTION
  };

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameChange = (event) => {
    setNameValue(event.target.value);
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
    // ! ADD CODE TO UPDATE NAME
  };
  const style = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
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
  };

  const label = [
    { name: "Feature", color: "#E6BE65" },
    { name: "Urgent", color: "#FF0000" },
  ];

  const Labels = label.map((label) => (
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
                value={nameValue}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
              />
            ) : (
              <Typography onClick={handleNameClick}>{nameValue}</Typography>
            )
          }
          subheader={<p>In list {props.list_name}</p>}
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
              <Typography sx={style_title}>Étiquettes</Typography>
              <Typography
                sx={{
                  display: "flex",
                  marginLeft: "2vh",
                }}
              >
                {Labels}
              </Typography>
            </div>
            <div>
              <Typography sx={style_title}>Description</Typography>
              {isEditingDescription ? (
                <TextField
                  sx={{ width: "100%" }}
                  value={descriptionValue}
                  onChange={handleDescriptionChange}
                  onBlur={handleDescriptionBlur}
                  multiline
                  maxRows={4}
                />
              ) : (
                <Typography onClick={handleDescriptionClick} sx={style_text}>
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
                <ListItemText primary="Membres" />
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
              <ListItemButton onClick={deleteCard}>
                <ListItemIcon>
                  <DeleteIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Supprimer" />
              </ListItemButton>
            </ListItem>
          </List>
        </CardContent>
      </div>
    </Card>
  );
}
