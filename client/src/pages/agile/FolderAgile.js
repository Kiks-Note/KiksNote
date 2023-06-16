import React, {useState, useEffect} from "react";
import axios from "axios";
import {Grid, Button, Typography} from "@material-ui/core";
import useFirebase from "../../hooks/useFirebase";
import "./agile.css";

const FolderAgile = () => {
  const {user} = useFirebase();
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_API}/agile/${user.id}/agile_folder`
        );
        setFolders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFolder();
  }, []);

  const handleOpenContextMenu = (event, folder) => {
    event.preventDefault();
    setSelectedFolder(folder);
    setIsContextMenuOpen(true);
  };

  const handleCloseContextMenu = () => {
    setSelectedFolder(null);
    setIsContextMenuOpen(false);
  };
  const handleDownloadContent = (event) => {
    event.stopPropagation();
    // Récupérer les liens des fichiers du dossier sélectionné
    const {elevator_pitch, impact_mapping, empathy_map, three, personas} =
      selectedFolder;

    // Créer une liste des liens de fichiers à télécharger
    const fileLinks = [];
    if (three) {
      fileLinks.push(three);
    }
    if (elevator_pitch) {
      fileLinks.push(elevator_pitch);
    }
    if (impact_mapping) {
      fileLinks.push(impact_mapping);
    }
    if (empathy_map) {
      fileLinks.push(empathy_map);
    }

    if (fileLinks.length != 0) {
      // Générer un lien de téléchargement regroupant tous les fichiers
      const zipLink = `${
        process.env.REACT_APP_SERVER_API
      }/agile/folder?files=${encodeURIComponent(fileLinks.join(","))}`;

      // Ouvrir le lien de téléchargement dans une nouvelle fenêtre/onglet
      window.open(zipLink, "_blank");
    }

    handleCloseContextMenu();
  };

  const handleContainerBlur = (event) => {
    // Vérifier si le clic a été effectué sur les boutons "Ouvrir" ou "Télécharger"
    const target = event.relatedTarget;
    if (
      target &&
      (target.classList.contains("open-button") ||
        target.classList.contains("download-button"))
    ) {
      return;
    }
    setIsContextMenuOpen(false);
  };

  return (
    <Grid container>
      <p className="title_folder__">Dossier agile</p>
      {folders.map((fold, index) => (
        <Grid item xs={2} key={fold.id + index}>
          <div
            className={`container${selectedFolder === fold ? " active" : ""}`}
            onClick={(event) => handleOpenContextMenu(event, fold)}
            onBlur={handleContainerBlur}
            tabIndex={0}
          >
            <div className="folder">
              <div className="folder_content">
                <p>Dossier {fold.groupName}</p>
              </div>
            </div>
            {selectedFolder === fold && isContextMenuOpen && (
              <div>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDownloadContent}
                  className="download-button"
                >
                  Télécharger ce dossier
                </Button>
              </div>
            )}
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default FolderAgile;
