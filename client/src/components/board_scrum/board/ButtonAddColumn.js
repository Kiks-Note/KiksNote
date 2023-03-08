import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";


export default function ButtonAddColumn() {
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

const handleAddColumn = () => {
  const newColumn = {
    name: cardTitle,
    items: [],
  };
  axios
    .post("/api/columns", newColumn)
    .then((response) => {
      // update state with new column

      handleCloseTextField();
    })
    .catch((error) => {
      console.error(error);
    });
};

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "5px 5px 5px 15px",
      }}
    >
      {showTextField ? (
        <>
          <TextField
            variant="outlined"
            onBlur={handleCloseTextField}
            autoFocus
            value={cardTitle}
            onChange={handleChange}
            style={{ marginRight: "10px" }}
            multiline
            rows={2}
            placeholder="Saisissez un titre pour cette colonne…"
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
              onClick={handleAddColumn}
              disabled={!cardTitle}
            >
              Ajouter
            </Button>
            <Button startIcon={<CloseIcon />} onClick={handleCloseTextField}>
              Annuler
            </Button>
          </div>
        </>
      ) : (
        <Button
          onClick={handleClickAddButton}
          variant="text"
          startIcon={<AddIcon />}
        >
          Ajouter une colonne
        </Button>
      )}
    </div>
  );
}
