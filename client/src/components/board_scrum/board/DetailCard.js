import React, { useState } from "react";
import axios from "axios";
import {
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
import ListModal from "./ListModal";

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
  const [type, setType] = useState("");

  const closeModal = () => {
    setShowModal(false);
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

  const saveName = (title) => {
    try {
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
    } catch (error) {}
  };

  const saveDesc = () => {
    try {
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
    } catch (error) {}
  };
  const deleteCard = () => {
    console.log(info.id);
    console.log(props.columnId);
    try {
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
      props.handleClose();
    } catch (error) {}
  };
  const style = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
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
    <Button
      onClick={() => {
        setShowModal(!showModal);
        setType("addlabels");
      }}
    >
      <AddIcon></AddIcon>
    </Button>
  );

  return (
    <>
      <Card sx={[style, { maxWidth: "60%", minWidth: "fit-content" }]}>
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
                  Label(s)
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
                {isEditingDescription || !info.desc ? (
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
                      onBlur={() => setIsEditingDescription(true)}
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
                        onClick={() => {
                          setIsEditingDescription(false);
                          saveDesc();
                        }}
                        disabled={!descriptionValue}
                      >
                        Enregistrer
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          setIsEditingDescription(false);
                          handleCancelClick();
                        }}
                        disabled={!descriptionValue}
                      >
                        Annuler
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Typography
                    color="text.default"
                    onClick={() => setIsEditingDescription(true)}
                    sx={style_text}
                  >
                    {descriptionValue || "Ajouter une description…"}
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
                  <ListItemText
                    primary="Rejoindre"
                    primaryTypographyProps={{ color: "text.default" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={style_item_button}>
                <ListItemButton
                  onClick={() => {
                    setShowModal(!showModal);
                    setType("membres");
                  }}
                >
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
                  <ListItemButton
                    onClick={() => {
                      setShowModal(!showModal);
                      setType("stories");
                    }}
                  >
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
              <ListItem disablePadding sx={style_item_button}>
                <ListItemButton
                  onClick={() => {
                    setShowModal(!showModal);
                    setType("labels");
                  }}
                >
                  <ListItemIcon>
                    <LabelIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Label(s)"
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
      <ListModal
        showModal={showModal}
        closeModal={closeModal}
        stories={props.stories}
        dashboardId={props.dashboardId}
        boardId={props.boardId}
        columnId={props.columnId}
        info={info}
        type={type}
      />
    </>
  );
}
