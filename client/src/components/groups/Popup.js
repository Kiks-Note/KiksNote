import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  useTheme,
} from "@mui/material";
import { w3cwebsocket } from "websocket";
import useFirebase from "../../hooks/useFirebase";
import "./Popup.scss";

export const PopUp = ({ onPopupData, dataPopUp, showPopUp }) => {
  const [classChoose, setClassChoose] = useState("");
  const start_date = useRef();
  const end_date = useRef();
  const nb_release = useRef();
  const popUpRef = useRef();

  const { user } = useFirebase();
  const theme = useTheme();

  const ws = useMemo(() => {
    return new w3cwebsocket("ws://localhost:5050/groupes");
  }, []);

  useEffect(() => {
    if (dataPopUp) {
      setClassChoose(dataPopUp.classChoose);
      if (start_date.current) {
        start_date.current.value = dataPopUp.start_date;
      }

      if (end_date.current) {
        end_date.current.value = dataPopUp.end_date;
      }

      if (nb_release.current) {
        nb_release.current.value = dataPopUp.nb_release;
      }
    }

    ws.onopen = () => {
      console.log("WebSocket Client Connected");
    };
  }, [dataPopUp, user?.id, ws]);

  const createRoom = (roomData) => {
    const message = {
      type: "createRoom",
      data: roomData,
    };
    ws.send(JSON.stringify(message));
  };

  function validate() {
    if (!classChoose || !start_date.current.value || !end_date.current.value) {
      alert("Veuillez remplir tous les champs");
    } else {
      onPopupData({
        start_date: start_date.current.value,
        end_date: end_date.current.value,
        classChoose: classChoose,
      });
      createRoom({
        po_id: user.id,
        class: classChoose,
        name: user?.firstname,
        settings: {
          start_date: start_date.current.value,
          end_date: end_date.current.value,
          classChoose: classChoose,
        },
      });
    }
  }

  function closePopUp() {
    showPopUp(false);
  }

  return (
    <div className="pop-up">
      <div
        className="pop-up-content"
        ref={popUpRef}
        style={{
          backgroundColor: theme.palette.background.container,
        }}
      >
        <p>Paramétrage de la création de groupes</p>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Classe</InputLabel>
          <Select
            variant="filled"
            id="input-class"
            sx={{ color: "text.primary" }}
            value={classChoose}
            onChange={(e) => setClassChoose(e.target.value)}
          >
            <MenuItem value="L1-paris">L1-Paris</MenuItem>
            <MenuItem value="L1-cergy">L1-Cergy</MenuItem>
            <MenuItem value="L2-paris">L2-Paris</MenuItem>
            <MenuItem value="L2-cergy">L2-Cergy</MenuItem>
            <MenuItem value="L3-paris">L3-Paris</MenuItem>
            <MenuItem value="L3-cergy">L3-Cergy</MenuItem>
            <MenuItem value="M1-lead">M1-LeadDev</MenuItem>
            <MenuItem value="M1-gaming">M1-Gaming</MenuItem>
            <MenuItem value="M2-lead">M2-LeadDev</MenuItem>
            <MenuItem value="M2-gaming">M2-Gaming</MenuItem>
          </Select>
        </FormControl>

        <div className="date-sprint">
          <div className="date-input">
            <label>Date de début de Sprint</label>
            <input
              type="date"
              defaultValue={dataPopUp ? dataPopUp.start_date : ""}
              ref={start_date}
            />
          </div>
          <div className="date-input">
            <label>Date de fin de Sprint</label>
            <input
              type="date"
              defaultValue={dataPopUp ? dataPopUp.end_date : ""}
              ref={end_date}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {dataPopUp ? <Button onClick={closePopUp}>Annuler</Button> : null}
          <Button
            variant="contained"
            style={{
              backgroundColor: theme.palette.custom.button,
              marginLeft: "10px",
              color: "white",
              "&:hover": {
                backgroundColor: "red",
              },
            }}
            onClick={validate}
          >
            Ok !
          </Button>
        </div>
      </div>
    </div>
  );
};
