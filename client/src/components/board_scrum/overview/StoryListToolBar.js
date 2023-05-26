import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import NestedListRelease from "./NestedListRelease";

export default function StoryListToolBar({
  dashboardId,
  allReleases,
  storiesSelected,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [releases, setReleases] = useState([]);
  const [idDashboard, setDashbaordId] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setSelected(storiesSelected);
    setReleases(Object.entries(allReleases));
    setDashbaordId(dashboardId);
  }, []);

  const handleClickOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const addToBoard = () => {
    handleClickOpen();
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      {selected && selected.length > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selected.length} sélectionnée(s)
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          Aucune Storie sélectionnée
        </Typography>
      )}

      {selected && selected.length > 0 && (
        <div>
          <Tooltip title="Add to board">
            <IconButton onClick={addToBoard}>
              <FileUploadIcon />
            </IconButton>
          </Tooltip>
          <Dialog
            fullScreen={fullScreen}
            open={openModal}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {selected.length > 1
                ? "A quel board voulez-vous ajouter ces stories ?"
                : "A quel board voulez-vous ajouter cette story ?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <NestedListRelease
                  releases={releases}
                  selectedStories={selected}
                  dashboardId={idDashboard}
                />
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Toolbar>
  );
}

StoryListToolBar.propTypes = {
  dashboardId: PropTypes.string.isRequired,
  allReleases: PropTypes.object.isRequired,
  storiesSelected: PropTypes.array.isRequired,
};
