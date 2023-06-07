import React, { useState, useEffect } from "react";
import { w3cwebsocket } from "websocket";
import { Grid, Button, Typography } from "@material-ui/core";
import useFirebase from "../../hooks/useFirebase";
import "./agile.css";

export default function AgileHome({ dashboardId }) {
  const { user } = useFirebase();
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wsComments = new w3cwebsocket(`ws://localhost:5050/agile`);
    wsComments.onopen = function (e) {
      wsComments.send(JSON.stringify(dashboardId));
    };
    wsComments.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        console.log(data);
        setFolders(data.others);
        setLoading(false);
      } catch (error) {
        setLoading(true);
        console.error(error);
      }
    };
  }, []);

  return (
    <Grid container>
      <p className="title_folder__">Agile</p>
      {folders.map((fold, index) => (
        <Grid item xs={2} key={fold.id}>
          <div className="folder">
            <div className="folder_content">
              <p>Dossier {fold.groupName}</p>
            </div>
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
