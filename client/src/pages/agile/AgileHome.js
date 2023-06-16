import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { w3cwebsocket } from "websocket";
import { Grid, Typography } from "@mui/material";
import useFirebase from "../../hooks/useFirebase";
import "./agile.css";
import { Rings } from "react-loader-spinner";
import { setActiveTab, addTab } from "../../redux/slices/tabBoardSlice";
export default function AgileHome({ dashboardId, agile }) {
  const { user } = useFirebase();
  const [elevator, setElevator] = useState({});
  const [impact, setImpact] = useState({});
  const [three, setThree] = useState({});
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const wsComments = new w3cwebsocket(`ws://localhost:5050/agile`);
    wsComments.onopen = function (e) {
      wsComments.send(JSON.stringify(dashboardId));
    };
    wsComments.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        setElevator(data.elevator);
        setImpact(data.impactMapping);
        setOthers(data.others);
        setThree(data.functionalTree);
        setLoading(false);
      } catch (error) {
        setLoading(true);
        console.error(error);
      }
    };
  }, []);
  const moveToImpact = () => {
    const impactTab = {
      id: "Impact" + dashboardId,
      label: "Impact mapping ",
      closeable: true,
      component: "Impact",
      data: { agile: agile, dashboardId: dashboardId },
    };
    dispatch(addTab(impactTab));
    dispatch(setActiveTab(impactTab.id));
  };
  const moveToPersona = (id) => {
    const personaTab = {
      id: "Persona" + id,
      label: "Persona ",
      closeable: true,
      component: "Personas",
      data: { dashboardId: dashboardId, actorId: id },
    };
    dispatch(addTab(personaTab));
    dispatch(setActiveTab(personaTab.id));
  };
  const moveToEmpathy = (id) => {
    const empathyTab = {
      id: "Empathy" + id,
      label: "Empathy ",
      closeable: true,
      component: "Empathy",
      data: { dashboardId: dashboardId, actorId: id },
    };
    dispatch(addTab(empathyTab));
    dispatch(setActiveTab(empathyTab.id));
  };
  const moveToThree = () => {
    const threeTab = {
      id: "Arbre" + dashboardId,
      label: "Arbre ",
      closeable: true,
      component: "Arbre",
      data: { dashboardId: dashboardId },
    };
    dispatch(addTab(threeTab));
    dispatch(setActiveTab(threeTab.id));
  };
   const moveToElevator = () => {
     const elevatorTab = {
       id: "Elevator" + dashboardId,
       label: "Elevator Pitch ",
       closeable: true,
       component: "Elevator",
       data: { dashboardId: dashboardId },
     };
     dispatch(addTab(elevatorTab));
     dispatch(setActiveTab(elevatorTab.id));
   };
  return (
    <Grid container>
      <p className="title_folder__">Agile</p>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Rings
            height="200"
            width="200"
            color="#00BFFF"
            radius="6"
            wrapperStyle={{}}
            wrapperClass="loader"
            visible={true}
            ariaLabel="rings-loading"
          />
        </div>
      ) : (
        <Grid item xs={12}>
          <div
            className="folder folder_cursor"
            key={impact.id}
            onClick={() => moveToImpact()}
          >
            <div className="folder_content">
              <Typography variant="h4">ImpactMapping</Typography>
            </div>
          </div>
          {others.map((fold, index) => (
            <div key={fold.id}>
              {fold.persona && (
                <div
                  className="folder folder_cursor"
                  key={fold.id + "persona"}
                  onClick={() => moveToPersona(fold.id)}
                >
                  <div className="folder_content">
                    <Typography variant="h4">Persona </Typography>
                    <Typography variant="body1">{fold.text}</Typography>
                  </div>
                </div>
              )}
              {fold.empathy_map && (
                <div
                  className="folder folder_cursor"
                  key={fold.id + "empathy"}
                  onClick={() => moveToEmpathy(fold.id)}
                >
                  <div className="folder_content">
                    <Typography variant="h4">Empathy</Typography>
                    <Typography variant="body1">{fold.text}</Typography>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div
            className="folder folder_cursor"
            key={three.id}
            onClick={() => moveToThree()}
          >
            <div className="folder_content">
              <Typography variant="h4">Arbre Fonctionnel</Typography>
            </div>
          </div>
          <div
            className="folder folder_cursor"
            key={elevator.id}
            onClick={() => moveToElevator()}
          >
            <div className="folder_content">
              <Typography variant="h4">Elevator Pitch</Typography>
            </div>
          </div>
        </Grid>
      )}
    </Grid>
  );
}
