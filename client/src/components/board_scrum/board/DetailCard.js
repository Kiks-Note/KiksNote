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
  Person as PersonIcon,
  Label as LabelIcon,
  Delete as DeleteIcon,
  Ballot as BallotIcon,
  Circle as CircleIcon,
  Notes as NotesIcon,
  Add as AddIcon,
  FormatListBulleted as FormatListBulletedIcon,
} from "@mui/icons-material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import "./DetailCard.css";
import ListModal from "./ListModal";
import useFirebase from "../../../hooks/useFirebase";
import "./DetailCard.css";
export default function DetailCard(props) {
  const { user } = useFirebase();
  const info = props.info;
  //NAME LISTENER
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(info.name);
  //DESCRIPTION LISTENER
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(info.desc);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("");
  const [isAssigned, setIsAssigned] = useState(
    info.assignedTo.includes(user.id)
  );
  const allowedColumnIds = ["0", "1", "5", "6"];
  const closeModal = () => {
    setShowModal(false);
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
  const saveName = async (title) => {
    try {
      let cardDto;
      if (allowedColumnIds.includes(props.columnId)) {
        cardDto = {
          id: info.id,
          title: title,
          desc: info.desc,
          storyId: info.storyId,
          color: info.color,
          assignedTo: info.assignedTo,
          labels: info.labels,
        };
      } else {
        cardDto = {
          id: info.id,
          title: title,
          desc: info.desc,
          storyId: info.storyId,
          color: info.color,
          assignedTo: info.assignedTo,
          labels: info.labels,
          estimation: info.estimation,
          advancement: info.advancement,
        };
      }
      await axios.put(
        "http://212.73.217.176:5050/dashboard/" +
          props.dashboardId +
          "/board/" +
          props.boardId +
          "/column/" +
          props.columnId +
          "/editCard",
        cardDto
      );
    } catch (error) {
      // Gérer les erreurs
    }
  };

  const saveDesc = async () => {
    try {
      let cardDto;
      if (allowedColumnIds.includes(props.columnId)) {
        cardDto = {
          id: info.id,
          title: info.name,
          desc: descriptionValue,
          storyId: info.storyId,
          color: info.color,
          assignedTo: info.assignedTo,
          labels: info.labels,
        };
      } else {
        cardDto = {
          id: info.id,
          title: info.name,
          desc: descriptionValue,
          storyId: info.storyId,
          color: info.color,
          assignedTo: info.assignedTo,
          labels: info.labels,
          estimation: info.estimation,
          advancement: info.advancement,
        };
      }
      await axios.put(
        "http://212.73.217.176:5050/dashboard/" +
          props.dashboardId +
          "/board/" +
          props.boardId +
          "/column/" +
          props.columnId +
          "/editCard",
        cardDto
      );
      setIsEditingDescription(false);
    } catch (error) {
      // Gérer les erreurs
    }
  };

  const deleteCard = async () => {
    try {
      await axios.delete(
        "http://212.73.217.176:5050/dashboard/" +
          props.dashboardId +
          "/board/" +
          props.boardId +
          "/column/" +
          props.columnId +
          "/card/" +
          info.id
      );
      props.handleClose();
    } catch (error) {
      // Gérer les erreurs
    }
  };

  const assigneMe = async () => {
    if (isAssigned) {
      try {
        // Enlever l'ID de l'utilisateur connecté de la liste assignedTo
        const updatedAssignedTo = info.assignedTo.filter(
          (userId) => userId !== user.id
        );
        await axios.put(
          "http://212.73.217.176:5050/dashboard/" +
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
            storyId: info.storyId,
            color: info.color,
            assignedTo: updatedAssignedTo,
            labels: info.labels,
            estimation: info.estimation,
            advancement: info.advancement,
          }
        );
      } catch (error) {
        // Gérer les erreurs
      }
      setIsAssigned(false); // Mettez à jour l'état pour indiquer que l'utilisateur n'est plus assigné
      props.handleClose();
      return;
    }

    try {
      await axios.post(
        "http://212.73.217.176:5050/dashboard/" +
          props.dashboardId +
          "/board/" +
          props.boardId +
          "/column/" +
          props.columnId +
          "/story/" +
          info.id +
          "/add-users",
        { userIds: [user.id] }
      );
      setIsAssigned(true);
      props.handleClose();
    } catch (error) {
      // Gérer les erreurs
    }
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
        className="label-container"
        style={{
          backgroundColor: label.color + "40",
          borderColor: label.color + "30",
        }}
      >
        <div
          style={{
            display: "flex",
            " justify-content": "center",
            "align-items": "center",
          }}
        >
          <CircleIcon
            style={{
              color: label.color,
            }}
          />
          <p
            style={{
              fontSize: "small",
              minWidth: "70px",
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
        setType("labels");
      }}
    >
      <AddIcon></AddIcon>
    </Button>
  );

  return (
    <>
      <Card className="detail-card">
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
            <Typography color="text.default">Dans {props.list_name}</Typography>
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
        <CardContent className="card-content">
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
            {!allowedColumnIds.includes(props.columnId) && (
              <ListItem disablePadding sx={style_item_button}>
                <ListItemButton onClick={assigneMe}>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={isAssigned ? "Déjà Rejoint" : "Rejoindre"}
                    primaryTypographyProps={{ color: "text.default" }}
                  />
                </ListItemButton>
              </ListItem>
            )}
            {!["0", "5", "6"].includes(props.columnId) && (
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
        labelList={props.labelList}
        label={props.Label}
      />
    </>
  );
}
