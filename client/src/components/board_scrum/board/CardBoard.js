import React from "react";
import Modal from "@mui/material/Modal";
import ModalCard from "./ModalCard";
import InfoIcon from "@mui/icons-material/Info";
import { Chip, Typography, Avatar, Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import NotesIcon from "@mui/icons-material/Notes";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function CardBoard(props) {
  const [states, setStates] = React.useState({
    open: false,
    expanded: false,
  });

  const handleOpen = () => setStates({ open: true, expanded: false });

  const handleClose = () => setStates({ open: false, expanded: false });

  const handleAccordion = () => setStates({ expanded: !states.expanded });

  const info = props.card_info;

  const assignedTo = props.card_info.assignedTo;
  const assignedToAvatars = assignedTo.slice(0, 2).map((person) => {
    return <Avatar key={person.id} alt={person.name} src={person.photo} sx={{ width: 24, height: 24 }} />;
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

  var Labels = null;

  var Label = null;

  if (info.labels != null) {
    Label = info.labels.map((label) => {
      for (const labelProps of props.labelList) {
        if (labelProps.name.toLowerCase() == label.toLowerCase()) {
          return labelProps;
        }
      }
    });

    Labels = Label.map((label) => (
      <Chip
        label={props.label ? label.name : ""}
        style={{
          backgroundColor: label.color,
          height: "2vh",
          margin: "2px",
        }}
      />
    ));
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
      <div
        style={{
          display: "flex",
          padding: "5",
          position: "relative",
        }}
      >
        <Accordion
          expanded={states.expanded}
          onClick={handleAccordion}
          style={{
            backgroundColor: props.snapshot.isDragging ? "#FFFFFF" : "#FFFFFF",
            boxShadow: "none",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>{Labels}</div>
              <Typography variant="body1" color="black">
                {info.name}
              </Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              style={{
                color: "black",
              }}
            >
              {info.desc}
            </Typography>
          </AccordionDetails>
        </Accordion>
        <InfoIcon onClick={handleOpen} color="primary" style={{ marginLeft: "0.5rem" }} />
      </div>
      <Box style={{ display: "flex", alignItems: "center", justifyContent: " space-between" }}>
        <Stack direction="row" spacing={1} width={"100%"} justifyContent={"flex-end"}>
          {assignedToAvatars}
          {moreAvatar}
        </Stack>
      </Box>
      <Modal open={states.open} onClose={handleClose}>
        <ModalCard info={info} list_name={props.list_name} Label={Label}></ModalCard>
      </Modal>
    </div>
  );
}
