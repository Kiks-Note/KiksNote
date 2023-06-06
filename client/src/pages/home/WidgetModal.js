import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material";
import "./WidgetModal.scss";
import Call from "../../assets/img/call.svg";
import Groups from "../../assets/img/groups.svg";
import Class from "../../assets/img/class.svg";
import Blog from "../../assets/img/blog.svg";
import Boards from "../../assets/img/boards.svg";
import Retro from "../../assets/img/retro.svg";
import Calendar from "../../assets/img/calendar.svg";
import Agile from "../../assets/img/agile.svg";
import Widget from "../../components/widget/Widget";
import WidgetSelection from "./WidgetSelectionModal";

const Modal = ({ addLayout, enterEdition, leaveEdition }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [card, setcard] = useState({});

  const theme = useTheme();

  const widgetList = {};

  const handleOpenModal = () => {
    enterEdition();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    leaveEdition();
    setShowModal(false);
  };
  const handleCloseSelectionModal = () => {
    leaveEdition();
    setShowSelectionModal(false);
  };

  const handleOpenSelectionModal = (img, text) => {
    setShowModal(false);
    setShowSelectionModal(true);

    setcard({ img: img, text: text });
  };
  return (
    <div>
      <svg onClick={handleOpenModal} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z"
        ></path>
      </svg>
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            backgroundColor: theme.palette.background.paper,
            padding: "50px",
            overflowY: "scroll",
          }}
        >
          <div
            className="modal-container"
            style={{
              width: "100%",
              height: "100%",
              padding: "10px",
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Widget
              image={Agile}
              text={"Analyse Agile"}
              handleOpen={() => handleOpenSelectionModal(Agile, "Analyse Agile")}
            ></Widget>
            <Widget
              image={Call}
              text={"Appel"}
              path={"/"}
              handleOpen={() => handleOpenSelectionModal(Call, "Appel")}
            ></Widget>
            <Widget
              image={Boards}
              text={"Boards"}
              path={"/"}
              handleOpen={() => handleOpenSelectionModal(Boards, "Boards")}
            ></Widget>
            <Widget
              image={Boards}
              text={"Boards"}
              path={"/"}
              handleOpen={() => handleOpenSelectionModal(Boards, "Boards")}
            ></Widget>
            <Widget
              image={Boards}
              text={"Boards"}
              path={"/"}
              handleOpen={() => handleOpenSelectionModal(Boards, "Boards")}
            ></Widget>
            <button onClick={handleCloseModal} style={{ position: "absolute", top: "5px", left: "5px" }}>
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
      <WidgetSelection
        open={showSelectionModal}
        handleClose={() => {
          handleCloseSelectionModal();
        }}
        addLayout={addLayout}
        img={card.img}
        text={card.text}
      ></WidgetSelection>
    </div>
  );
};

export default Modal;
