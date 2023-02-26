import React from "react";
import Modal from "@mui/material/Modal";
import ModalCard from "./ModalCard";
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
          boxShadow: "none",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <div>
            <Chip
              label={props.label ? "Feature" : ""}
              style={{
                backgroundColor: "#E6BE65",
                height: "2vh",
                margin: "2px",
              }}
            />
            <Chip
              label={props.label ? "Urgent" : ""}
              style={{
                backgroundColor: "#FF0000",
                height: "2vh",
                margin: "2px",
              }}
            />
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
        <ModalCard info={info} list_name={props.list_name}></ModalCard>
      </Modal>
    </div>
  );
}
