import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { w3cwebsocket } from "websocket";
import { Grid, Typography } from "@mui/material";
import useFirebase from "../../hooks/useFirebase";
import "./agile.css";
import { setActiveTab, addTab } from "../../redux/slices/tabBoardSlice";
export default function AgileHome({ dashboardId, agile }) {
  const { user } = useFirebase();
  const [folder, setFolder] = useState([]);
  const [impact, setImpact] = useState({});
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
        console.log(data);
        setFolder(data.folder);
        setImpact(data.impactMapping);
        setOthers(data.others);

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
      id: "Persona" + dashboardId,
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
      id: "Empathy" + dashboardId,
      label: "Empathy ",
      closeable: true,
      component: "Empathy",
      data: { dashboardId: dashboardId, actorId: id },
    };
    dispatch(addTab(empathyTab));
    dispatch(setActiveTab(empathyTab.id));
  };
  return (
    <Grid container>
      <p className="title_folder__">Agile</p>
      <Grid item xs={12}>
        <div className="folder" key={impact.id} onClick={() => moveToImpact()}>
          <div className="folder_content">
            <Typography>ImpactMapping</Typography>
          </div>
        </div>
        {others.map((fold, index) => (
          <div key={fold.id}>
            {fold.persona && (
              <div
                className="folder"
                key={fold.id + "persona"}
                onClick={() => moveToPersona(fold.id)}
              >
                <div className="folder_content">
                  <Typography>Persona {fold.text}</Typography>
                </div>
              </div>
            )}
            {fold.empathy_map && (
              <div
                className="folder"
                key={fold.id + "empathy"}
                onClick={() => moveToEmpathy(fold.id)}
              >
                <div className="folder_content">
                  <Typography>Empathy {fold.text}</Typography>
                </div>
              </div>
            )}
          </div>
        ))}
      </Grid>
    </Grid>
  );
}
