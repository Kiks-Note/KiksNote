import React from "react";
import Modal from "@mui/material/Modal";
import RecipeReviewCard from "./Card";

export default function BasicModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const info = props.card_info;
  return (
    <div>
      <p onClick={handleOpen}>{info.name}</p>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <RecipeReviewCard info={info}></RecipeReviewCard>
      </Modal>
    </div>
  );
}
