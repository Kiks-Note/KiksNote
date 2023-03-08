import React from "react";
import Modal from "@mui/material/Modal";
import ModalCard from "./ModalCard";
import InfoIcon from "@mui/icons-material/Info";
import {Chip,Typography,Avatar,Box} from "@mui/material";
import Stack from '@mui/material/Stack';
import NotesIcon from '@mui/icons-material/Notes';
export default function CardBoard(props) {
  const [states, setStates] = React.useState({
    open: false,
    expanded: false,
  });

  const handleOpen = () => setStates({ open: true, expanded: false });

  const handleClose = () => setStates({ open: false, expanded: false });

    const info = props.card_info;

  const assignedTo = props.card_info.assignedTo;
  const assignedToAvatars = assignedTo.slice(0, 2).map((person) => {
    return (
      <Avatar
        key={person.id}
        alt={person.name}
        src={person.photo}
        sx={{ width: 24, height: 24 }}
      />
    );
  });

  let remainingCount = assignedTo.length - 2;
  let moreAvatar = null;
  if (remainingCount > 0) {
    moreAvatar = (
      <Avatar
        key="more"
        sx={{
          width: 24,
          height: 24,
          backgroundColor: "#E0E0E0",
          color: "#424242",
          cursor: "pointer",
        }}
      >
        {"+" + remainingCount}
      </Avatar>
    );
  }

  return (
<div
  style={{
    display: "flex",
    flexDirection: "column",
    minHeight: "6rem",
    backgroundColor: "#fff",
    borderRadius: "0.25rem",
    boxShadow: "0 1px 0 rgba(9,30,66,.25)",
    marginBottom: "0.5rem",
    padding: "0.5rem",
    position: "relative",
  }}
>
  <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {props.card_info.labels.map((label) => (
        <Chip
        key={label.id}
        label={label.name}
        style={{
            backgroundColor: label.color,
            height: "2vh",
            margin: "2px",
         }}
        />
         ))}
      </div>
      <Typography variant="body1" color="black">
        {info.name}
      </Typography>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <InfoIcon
        onClick={handleOpen}
        color="primary"
        style={{ marginLeft: "0.5rem" }}
      />
    </div>
  </Box>
     <Box style={
     { display: "flex",
    alignItems: "center",
    justifyContent:" space-between"}
     }>
         {info.desc && (
          <NotesIcon
            style={{ color: "gray"}}
          />
        )}
        <Stack
        direction="row"
        spacing={1}
        width={"100%"}
        justifyContent={"flex-end"}
      >
        {assignedToAvatars}
        {moreAvatar}
      </Stack>
    </Box>
  <Modal open={states.open} onClose={handleClose}>
    <ModalCard info={info} list_name={props.list_name}></ModalCard>
  </Modal>
</div>



  );
}
