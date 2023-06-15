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
import "../groups/Popup.scss";
import axios from "axios";

export const PopUp = ({ onPopupData, dataPopUp, showPopUp }) => {
  const [classChoose, setClassChoose] = useState(" ");
  const [courseChoosed, setCourseChoosed] = useState({
    data: { title: "Tous les cours" },
  });

  const popUpRef = useRef();
  const [courses, setCourses] = useState([]);

  const { user } = useFirebase();
  const theme = useTheme();

  const ws = useMemo(() => {
    return new w3cwebsocket("ws://localhost:5050/retro");
  }, []);

  useEffect(() => {
    const getCourse = async () => {
      await axios
        .get(`http://localhost:5050/ressources/getCoursesByPo/${user.id}`)
        .then((res) => {
          setCourses(res.data);
        });
    };

    getCourse();
    ws.onopen = () => {
      console.log("WebSocket Client Connected");
    };
  }, [dataPopUp, user.id, ws]);

  const createRoom = (roomData) => {
    const message = {
      type: "createRoom",
      data: roomData,
    };
    ws.send(JSON.stringify(message));
  };

  function validate() {
    if (courseChoosed.data.title === "Tous les cours") {
      alert("Veuillez remplir le champs");
    } else {
      onPopupData({
        courseChoose: courseChoosed,
      });
      createRoom({
        po_id: user.id,
        class: classChoose,
        name: user?.firstname,
        course: courseChoosed,
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
        <p>Création de Retrospective</p>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Cours</InputLabel>
          <Select
            variant="filled"
            id="input-class"
            sx={{ color: "text.primary" }}
            renderValue={(selected) => selected.data.title}
            onChange={(e) => {
              setClassChoose(e.target.value.data.courseClass.id);
              setCourseChoosed(e.target.value);
            }}
            value={courseChoosed}
          >
            {courses &&
              courses.cours &&
              courses.cours.length > 0 &&
              courses.cours.map((course) => (
                <MenuItem value={course} key={course.id}>
                  {course.data.title + " | " + course.data.courseClass.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

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
