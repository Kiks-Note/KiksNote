import { useState } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@material-ui/core";

import "./StudentsProjects.scss";

const StudentsProjects = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setOpen(false);
  };

  return (
    <div style={{ marginLeft: "1%", marginTop: "1%" }}>
      <h1>StudentsProjects</h1>

      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Projet
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Mon formulaire</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField label="Nom complet" fullWidth />
              <TextField label="Adresse e-mail" fullWidth />
              <TextField label="Message" fullWidth multiline rows={4} />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Annuler
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Soumettre
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default StudentsProjects;
