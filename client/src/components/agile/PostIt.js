import React, { useState } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function PostIt({
  text,
  dashboardId,
  actorId,
  columnId,
  postitId,
}) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  const handleBlur = () => {
    setIsClicked(false);
  };

  const deletePostit = () => {
    if (isClicked) {
      try {
        axios.delete(
          "http://localhost:5050/agile/" +
            dashboardId +
            "/empathy/" +
            actorId +
            "/column/" +
            columnId +
            "/postit/" +
            postitId
        );
      } catch (error) {}
    }
  };

  const getShortenedText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const shortenedText = getShortenedText(text, 20); // Limite le texte à 20 caractères

  return (
    <div
      className="empathy-post-it"
      onClick={handleClick}
      onBlur={handleBlur}
      tabIndex={0}
    >
      {shortenedText}
      {isClicked && (
        <IconButton
          style={{ position: "absolute", top: 0, right: 0, color: "red" }}
          aria-label="delete"
          onClick={deletePostit}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      )}
    </div>
  );
}
