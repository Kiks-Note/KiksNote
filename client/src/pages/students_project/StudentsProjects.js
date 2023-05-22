import { useState } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
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
      <Box className="grid-view-top-projects ">
        <h1>Les projets mis en avant</h1>
        <Grid container spacing={2}>
          {/* {(searchTerm.length > 0
            ? [...filteredCoursesCurrentYear].filter(
                (course) =>
                  course.data.title &&
                  course.data.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
            : [...filteredCoursesCurrentYear]
          ).map((course) => ( */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "300px",
                }}
                /* eslint-disable no-unused-expressions */
                onClick={() => {

                }}
              > 
                <CardMedia
                  sx={{
                    width: "100%",
                    minHeight: "150px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  component="img"
                  src=""
                  alt="course image"
                  style={{
                    objectFit: "contain",
                    objectPosition: "center",
                    width: "100%",
                    minHeight: "150px",
                  }}
                />

                <CardContent sx={{ padding: "10px", height: "120px" }}>
                  <h2 variant="h3" component="div">
                    Titre du projet
                  </h2>
                  <Typography variant="body2" color="text.secondary">
                    Description du projet
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* ))} */}
          </Grid>
        </Box>
        <Box sx={{
          marginTop: "50px"
        }} className="grid-view-projects">
        <h1>Tous les projets</h1>
        <Grid container spacing={2}>
          {/* {(searchTerm.length > 0
            ? [...filteredCoursesCurrentYear].filter(
                (course) =>
                  course.data.title &&
                  course.data.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
            : [...filteredCoursesCurrentYear]
          ).map((course) => ( */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "300px",
                }}
                /* eslint-disable no-unused-expressions */
                onClick={() => {

                }}
              >
                <CardMedia
                  sx={{
                    width: "100%",
                    minHeight: "150px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  component="img"
                  src=""
                  alt="course image"
                  style={{
                    objectFit: "contain",
                    objectPosition: "center",
                    width: "100%",
                    minHeight: "150px",
                  }}
                />

                <CardContent sx={{ padding: "10px", height: "120px" }}>
                  <h2 variant="h3" component="div">
                    Titre du projet
                  </h2>
                  <Typography variant="body2" color="text.secondary">
                    Description du projet
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* ))} */}
          </Grid>
        </Box>
    </div>
  );
};

export default StudentsProjects;
