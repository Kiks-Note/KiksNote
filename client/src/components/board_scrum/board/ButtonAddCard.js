import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";

export default function ButtonAddCart(props) {
  const [showTextField, setShowTextField] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const handleClickAddButton = () => {
    setShowTextField(true);
  };

  const handleCloseTextField = () => {
    setShowTextField(false);
    setCardTitle("");
  };

  const handleChange = (event) => {
    setCardTitle(event.target.value);
  };

  const handleAddCard = () => {
    console.log(cardTitle);
    console.log(props.columnId);
    if (cardTitle != "") {
      axios
        .put(
          "http://localhost:5050/dashboard/" +
            props.dashboardId +
            "/board/" +
            props.boardId +
            "/column/" +
            props.columnId +
            "/addCard",
          {
            title: cardTitle,
          }
        )
        .then(() => {
          handleCloseTextField();
        });
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
            <Button variant="contained" onClick={() => handleAddCard()} disabled={!cardTitle}>
              Ajouter
            </Button>
            <Button startIcon={<CloseIcon />} onClick={handleCloseTextField}>
              Annuler
            </Button>
          </div>
        </>
      ) : (
        <Button onClick={handleClickAddButton} variant="text" startIcon={<AddIcon />}>
          Ajouter une carte
        </Button>
      )}
    </div>
  );
}
