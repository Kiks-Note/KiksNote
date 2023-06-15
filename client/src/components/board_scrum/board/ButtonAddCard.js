import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "@mui/material/Slider";

export default function ButtonAddCard(props) {
  const [showTextField, setShowTextField] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [estimation, setEstimation] = useState(0); // Ajout de l'état pour l'estimation

  const handleClickAddButton = () => {
    setShowTextField(true);
  };

  const handleCloseTextField = () => {
    setShowTextField(false);
    setCardTitle("");
    setEstimation(0); // Réinitialisation de l'estimation
  };

  const handleChange = (event) => {
    setCardTitle(event.target.value);
  };

  const handleEstimationChange = (event, newValue) => {
    setEstimation(newValue);
  };

  const handleAddCard = () => {
    axios
      .put(
        "http://212.73.217.176:5050/dashboard/" +
          props.dashboardId +
          "/board/" +
          props.boardId +
          "/column/" +
          props.columnId +
          "/addCard",
        {
          title: cardTitle,
          estimation: estimation, // Ajout de l'estimation dans la requête
        }
      )
      .then(() => {
        handleCloseTextField();
      });
  };

  const renderAddCardForm = () => {
    if (props.columnId == 2 || props.columnId == 3 || props.columnId == 4) {
      return (
        <>
          <TextField
            variant="outlined"
            autoFocus
            value={cardTitle}
            onChange={handleChange}
            style={{ marginRight: "10px" }}
            InputProps={{
              style: { color: "#5e5e5e" },
            }}
            multiline
            rows={2}
            placeholder="Saisissez un titre pour cette carte…"
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "10px" }}>Estimation (heures):</span>
            <Slider
              value={estimation}
              onChange={handleEstimationChange}
              min={0}
              max={24}
              step={0.5}
              valueLabelDisplay="on"
              style={{ width: "200px" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleAddCard}
              disabled={!cardTitle || estimation == 0}
            >
              Ajouter
            </Button>
            <Button startIcon={<CloseIcon />} onClick={handleCloseTextField}>
              Annuler
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <TextField
            variant="outlined"
            autoFocus
            value={cardTitle}
            onChange={handleChange}
            style={{ marginRight: "10px" }}
            InputProps={{
              style: { color: "#5e5e5e" },
            }}
            multiline
            rows={2}
            placeholder="Saisissez un titre pour cette carte…"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleAddCard}
              disabled={!cardTitle}
            >
              Ajouter
            </Button>
            <Button startIcon={<CloseIcon />} onClick={handleCloseTextField}>
              Annuler
            </Button>
          </div>
        </>
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#ebecf0",
        color: "#5e5e5e",
        padding: "5px 5px 5px 15px",
      }}
    >
      {showTextField ? (
        renderAddCardForm()
      ) : (
        <Button
          onClick={handleClickAddButton}
          variant="text"
          startIcon={<AddIcon />}
        >
          Ajouter une carte
        </Button>
      )}
    </div>
  );
}
