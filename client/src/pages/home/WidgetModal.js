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
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
const Modal = ({ addLayout, edition, enterEdition, leaveEdition }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [card, setcard] = useState({});

  const theme = useTheme();

  const widgetList = {};

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleEdit = () => {
    if (edition) {
      leaveEdition();
    } else {
      enterEdition();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleCloseSelectionModal = () => {
    setShowSelectionModal(false);
  };

  const handleOpenSelectionModal = (img, text) => {
    setShowModal(false);
    setShowSelectionModal(true);

    setcard({ img: img, text: text });
  };
  return (
    <div>
      <AddIcon onClick={handleOpenModal} style={{ marginTop: "45%", fontSize: "30" }}></AddIcon>
      <SettingsIcon
        onClick={() => {
          handleEdit();
        }}
        style={{ marginTop: "45%", fontSize: "30" }}
      ></SettingsIcon>
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
              alignItems: "center",
              overflow: "scroll",
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
              image={Groups}
              text={"Groupes"}
              path={"/"}
              handleOpen={() => handleOpenSelectionModal(Groups, "Groupes")}
            ></Widget>
            <Widget
              image={Class}
              text={"Classe"}
              path={"/"}
              handleOpen={() => handleOpenSelectionModal(Class, "Classe")}
            ></Widget>
            <Widget
              image={Blog}
              text={"blogs"}
              path={"/"}
              handleOpen={() => handleOpenSelectionModal(Blog, "Blogs")}
            ></Widget>{" "}
            <Widget
              image={Retro}
              text={"Rétrospective"}
              path={"/"}
              handleOpen={() => handleOpenSelectionModal(Retro, "Rétrospective")}
            ></Widget>{" "}
            <Widget
              image={Calendar}
              text={"Calendrier"}
              path={"/"}
              handleOpen={() => handleOpenSelectionModal(Calendar, "Calendrier")}
            ></Widget>{" "}
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
