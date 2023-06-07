import React from "react";
import "./button_test.css";
import ChatIcon from "@mui/icons-material/Chat";

const Button = ({ handleClick }) => {
  return (
    <button className="floating-action-button" onClick={handleClick}>
      <ChatIcon></ChatIcon>
    </button>
  );
};

export default Button;
