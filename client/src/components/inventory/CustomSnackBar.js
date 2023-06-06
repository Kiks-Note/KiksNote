import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import "../../styles/customSnackbar.css";

export default function CustomSnackbar({
  open,
  onClose,
  message,
  onClickCheck,
  onClickClose,
}) {
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        onClick={onClickCheck}
        className="snackbar-button-green"
      >
        <CheckIcon fontSize="medium" />
      </IconButton>
      <IconButton
        size="small"
        aria-label="close"
        onClick={onClickClose}
        className="snackbar-button-red"
      >
        <CloseIcon fontSize="medium" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      message={message}
      action={action}
    />
  );
}
