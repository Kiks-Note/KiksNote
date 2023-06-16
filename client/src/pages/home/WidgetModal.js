import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material";
import "./WidgetModal.scss";
import Groups from "../../assets/img/groups.svg";
import Class from "../../assets/img/class.svg";
import Blog from "../../assets/img/blog.svg";
import Boards from "../../assets/img/boards.svg";
import Retro from "../../assets/img/retro.svg";
import Calendar from "../../assets/img/calendar.svg";
import Agile from "../../assets/img/agile.svg";
import JPO from "../../assets/img/JPO.svg";
import Inventaire from "../../assets/img/inventory.svg";
import Profil from "../../assets/img/profil.svg";
import Widget from "../../components/widget/Widget";
import WidgetSelection from "./WidgetSelectionModal";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import useFirebase from "../../hooks/useFirebase";
const Modal = ({ addLayout, edition, enterEdition, leaveEdition }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [card, setcard] = useState({});

  const theme = useTheme();
  const user = useFirebase();

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

  const handleOpenSelectionModal = (img, text, path) => {
    setShowModal(false);
    setShowSelectionModal(true);

    setcard({ img: img, text: text, path: path });
  };
  return (
    <div>
      <AddIcon
        onClick={handleOpenModal}
        style={{ marginTop: "45%", fontSize: "30" }}
      ></AddIcon>
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
            backgroundColor: theme.palette.custom.modalTransparent,
            padding: "50px",
            overflowY: "hidden",
            overflowX: "scroll",
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
            }}
          >
            <Widget
              image={Agile}
              text={"Analyse Agile"}
              path={"/agile"}
              handleOpen={() =>
                handleOpenSelectionModal(Agile, "Analyse Agile", "/agile")
              }
            ></Widget>
            <Widget
              image={Boards}
              text={"Boards"}
              path={"/tableau-de-bord"}
              handleOpen={() =>
                handleOpenSelectionModal(Boards, "Boards", "/tableau-de-bord")
              }
            ></Widget>
            <Widget
              image={Groups}
              text={"Groupes"}
              path={"/groupes/creation"}
              handleOpen={() =>
                handleOpenSelectionModal(Groups, "Groupes", "/groupes/creation")
              }
            ></Widget>
            <Widget
              image={Class}
              text={"Cours"}
              path={"/cours"}
              handleOpen={() =>
                handleOpenSelectionModal(Class, "Classe", "/cours")
              }
            ></Widget>
            <Widget
              image={Blog}
              text={"Blogs"}
              path={"/blog"}
              handleOpen={() =>
                handleOpenSelectionModal(Blog, "Blogs", "/blog")
              }
            ></Widget>{" "}
            <Widget
              image={Retro}
              text={"Rétrospective"}
              path={"/board"}
              handleOpen={() =>
                handleOpenSelectionModal(Retro, "Rétrospective", "/board")
              }
            ></Widget>{" "}
            <Widget
              image={Inventaire}
              text={"Inventaire"}
              path={"/inventory"}
              handleOpen={() =>
                handleOpenSelectionModal(Inventaire, "Inventaire", "/inventory")
              }
            ></Widget>{" "}
            <Widget
              image={Calendar}
              text={"Calendrier"}
              path={"/calendrier"}
              handleOpen={() =>
                handleOpenSelectionModal(Calendar, "Calendrier", "/calendrier")
              }
            ></Widget>{" "}
            <Widget
              image={JPO}
              text={"JPO"}
              path={"/jpo"}
              handleOpen={() => handleOpenSelectionModal(JPO, "jpo", "/jpo")}
            ></Widget>{" "}
            <Widget
              image={Profil}
              text={"Profil"}
              path={`/profil/${user?.id}`}
              handleOpen={() =>
                handleOpenSelectionModal(
                  Profil,
                  "Profil",
                  `/profil/${user?.id}`
                )
              }
            ></Widget>{" "}
            <button
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: "5px",
                left: "5px",
                backgroundColor: "transparent",
                border: "none",
              }}
            >
              <CloseIcon style={{ fill: theme.palette.text.primary }} />
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
        path={card.path}
      ></WidgetSelection>
    </div>
  );
};

export default Modal;
