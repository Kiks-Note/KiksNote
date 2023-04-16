import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IconButton,
  Card,
  CardHeader,
  CardContent,
  Typography,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Box,
  Button,
  ListItem,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Label as LabelIcon,
  Delete as DeleteIcon,
  Ballot as BallotIcon,
  Circle as CircleIcon,
  Notes as NotesIcon,
  Add as AddIcon,
  FormatListBulleted as FormatListBulletedIcon,
} from "@mui/icons-material";
import "./DetailCard.css";

export default function DetailCard(props) {
  const info = props.info;
  //NAME LISTENER
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(info.name);
  //DESCRIPTION LISTENER
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(info.desc);
  // MODAL SETTINGS
  const [open, setOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const handleClick = (event) => {
    saveStory(event);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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

  const handleCancelClick = () => {
    setIsEditingDescription(false);
  };
  const handleNameBlur = (event) => {
    saveName(event.target.value);
    setNameValue(event.target.value);
    setIsEditingName(false);
  };

  const saveStory = (story) => {
    axios.put(
      "http://localhost:5050/dashboard/" +
        props.dashboardId +
        "/board/" +
        props.boardId +
        "/column/" +
        props.columnId +
        "/editCard",
      {
        id: info.id,
        title: info.name,
        desc: info.desc,
        storyId: story.id,
        color: story.color,
        assignedTo: info.assignedTo,
        labels: info.labels,
      }
    );
  };

  const saveName = (title) => {
    axios.put(
      "http://localhost:5050/dashboard/" +
        props.dashboardId +
        "/board/" +
        props.boardId +
        "/column/" +
        props.columnId +
        "/editCard",
      {
        id: info.id,
        title: title,
        desc: info.desc,
        storyId: info.storyId,
        color: info.color,
        assignedTo: info.assignedTo,
        labels: info.labels,
      }
    );
  };

  const saveDesc = () => {
    axios.put(
      "http://localhost:5050/dashboard/" +
        props.dashboardId +
        "/board/" +
        props.boardId +
        "/column/" +
        props.columnId +
        "/editCard",
      {
        id: info.id,
        title: info.name,
        desc: descriptionValue,
        storyId: info.storyId,
        color: info.color,
        assignedTo: info.assignedTo,
        labels: info.labels,
      }
    );
    setIsEditingDescription(false);
  };

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
          backgroundColor: label.color + "40",
          borderColor: label.color + "30",
          borderStyle: "solid",
          borderRadius: "3px",
          marginRight: "2%",
          width: "fit-content",
          paddingRight: "3%",
          paddingLeft: "1%",
        }}
      >
        <div
          style={{ display: "flex", paddingTop: "5%", width: "fit-content" }}
        >
          <CircleIcon
            style={{
              flexDirection: "column",
              justifyContent: "center",
              color: label.color,
              height: "80%",
            }}
          ></CircleIcon>
          <p
            style={{
              flexDirection: "column",
              justifyContent: "center",
              height: "80%",
              paddingLeft: "5%",
              fontSize: "small",
              minWidth: "70px",
              height: "25px",
              paddingTop: "5%",
            }}
          >
            {label.name}
          </p>
        </div>
      </div>
    ));
  }

  Labels.push(
    <Button>
      <AddIcon></AddIcon>
    </Button>
  );

  const deleteCard = () => {
    console.log(info.id);
    console.log(props.columnId);
    axios.delete(
      "http://localhost:5050/dashboard/" +
        props.dashboardId +
        "/board/" +
        props.boardId +
        "/column/" +
        props.columnId +
        "/card/" +
        info.id
    );
    setOpen(false);
  };

  return (
    <>
      <Card sx={[style, { maxWidth: "30%", minWidth: "fit-content" }]}>
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
                <Typography
                  color="text.default"
                  variant="h5"
                  onClick={handleNameClick}
                >
                  {nameValue}
                </Typography>
              )
            }
            subheader={
              <Typography color="text.default">
                Dans {props.list_name}
              </Typography>
            }
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
                {isEditingDescription ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexDirection: "column",
                    }}
                  >
                    <TextField
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
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={saveDesc}
                        disabled={!descriptionValue}
                      >
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
                  <Typography
                    color="text.default"
                    onClick={handleDescriptionClick}
                    sx={style_text}
                  >
                    {descriptionValue}
                  </Typography>
                )}
              </div>
            </div>
            <List>
              <Dialog
                sx={{
                  "& .MuiDialog-paper": {
                    maxHeight: "calc(100% - 64px)",
                    overflowY: "visible",
                    overflowX: "hidden",
                    position: "fixed",
                    top: "25%",
                    left: "65%",
                    transform: "translate(-50%, -50%)",
                    "@media (max-width: 600px)": {
                      width: "100%",
                      maxHeight: "100%",
                      margin: 0,
                    },
                  },
                }}
                open={open}
              >
                <DialogActions>
                  <IconButton onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </DialogActions>
                <DialogTitle>Étiquettes</DialogTitle>
                <DialogContent dividers>
                  <Box
                    component="form"
                    noValidate
                    sx={{ mt: 3 }}
                    autoComplete="off"
                    //onSubmit={handleSubmit(onSubmit)}
                  >
                    <Card sx={style}>
                      <div>
                        <h2 id="modal-title">
                          On va ajouter des étiquettes ici
                        </h2>
                        <p id="modal-description">Contenu de la modale</p>
                        <Button onClick={handleClose}>Fermer la modale</Button>
                      </div>
                    </Card>
                    <Button
                      variant="contained"
                      onClick={handleClose}
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sauvegarder
                    </Button>
                  </Box>
                </DialogContent>
              </Dialog>
              <ListItem disablePadding sx={style_item_button}>
                <ListItemButton>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Rejoindre"
                    primaryTypographyProps={{ color: "text.default" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={style_item_button}>
                <ListItemButton>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Membres"
                    primaryTypographyProps={{ color: "text.default" }}
                  />
                </ListItemButton>
              </ListItem>
              {props.columnId != 0 ? (
                <ListItem disablePadding sx={style_item_button}>
                  <ListItemButton onClick={() => setShowModal(!showModal)}>
                    <ListItemIcon>
                      <FormatListBulletedIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Lier Story"
                      primaryTypographyProps={{ color: "text.default" }}
                    />
                  </ListItemButton>
                </ListItem>
              ) : (
                <></>
              )}
              <ListItem
                onClick={handleOpen}
                disablePadding
                sx={style_item_button}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <LabelIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Etiquettes"
                    primaryTypographyProps={{ color: "text.default" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={style_item_button}>
                <ListItemButton onClick={deleteCard}>
                  <ListItemIcon>
                    <DeleteIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Supprimer"
                    primaryTypographyProps={{ color: "text.default" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </CardContent>
        </div>
      </Card>
      {showModal && (
        <div className="modal-content">
          <h2>List of Items</h2>
          <ul className="item-list">
            {props.stories.map((item) => (
              <li key={item.id}>
                <button onClick={() => handleClick(item)}>{item.name}</button>
              </li>
            ))}
          </ul>
          <button onClick={closeModal}>Close Modal</button>
        </div>
      )}
    </>
  );
}
