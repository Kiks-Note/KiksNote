import React from "react";
import Modal from "@mui/material/Modal";
import BoardModal from "./Card";
import InfoIcon from "@mui/icons-material/Info";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@mui/material/Chip";

export default function BoardCard(props) {
  const [states, setStates] = React.useState({
    open: false,
    expanded: false,
  });

  const handleOpen = () => setStates({ open: true, expanded: false });

  const handleAccordion = () => setStates({ expanded: !states.expanded });

  const handleClose = () => setStates({ open: false, expanded: false });

  const info = props.card_info;

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
        padding: 5,
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
            {Labels}
            <p
              style={{
                fontSize: "90%",
              }}
            >
              {info.name}
            </p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{info.desc}</Typography>
        </AccordionDetails>
      </Accordion>

      <InfoIcon
        onClick={handleOpen}
        color="primary"
        style={{
          position: "absolute",
          left: "82%",
        }}
      ></InfoIcon>

      <Modal open={states.open} onClose={handleClose}>
        <BoardModal info={info} list_name={props.list_name} Label={Label}></BoardModal>
      </Modal>
    </div>
  );
}
