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
    return new w3cwebsocket(
      `${process.env.REACT_APP_SERVER_API_WS}/groupes/creation`
    );
  }, []);

  useEffect(() => {
    const getCourse = async () => {
      await axios
        .get(
          `${process.env.REACT_APP_SERVER_API}/ressources/getCoursesByPo/${user.id}`
        )
        .then((res) => {
          setCourses(res.data);
        });
    };

    getCourse();
  }, [dataPopUp, user.id, ws]);

  const createRoom = (roomData) => {
    const message = {
      type: "createRoom",
      data: roomData,
    };
    ws.send(JSON.stringify(message));
  };

  function validate() {
    console.log(courseChoosed);
    if (courseChoosed.name === "Tous les cours") {
      alert("Veuillez remplir le champs");
    } else {
      onPopupData({
        courseChoose: courseChoosed,
      });
      createRoom({
        po_id: user.id,
        class: classChoose,
        name: user?.firstname,
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
          <InputLabel id="demo-simple-select-helper-label">Cours</InputLabel>
          <Select
            variant="filled"
            id="input-class"
            sx={{ color: "text.primary" }}
            defaultValue={""}
            renderValue={(selected) => `${selected.name}`}
            onChange={(e) => {
              setClassChoose(e.target.value.id);
              setCourseChoosed(e.target.value);
            }}
            value={courseChoosed}
          >
            {courses &&
              courses.cours &&
              courses.cours.length > 0 &&
              courses.cours.map((course) =>
                course.data.courseClass.map((courseClass) => (
                  <MenuItem value={courseClass} key={courseClass.id}>
                    {course.data.title + " | " + courseClass.name}
                  </MenuItem>
                ))
              )}
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
