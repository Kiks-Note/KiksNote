import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

export default function CustomSnackbar({
  open,
  onClose,
  message,
  onClickCheck,
  onClickClose,
}) {
  //   const [open, setOpen] = React.useState(false);

  //   const handleClick = () => {
  //     setOpen(true);
  //   };

  //   const handleClose = (event, reason) => {
  //     if (reason === "clickaway") {
  //       return;
  //     }

  //     setOpen(false);
  //   };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={onClickCheck}>
        <CheckIcon fontSize="small" />
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={onClickClose}
      >
        <CloseIcon fontSize="small" />
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
