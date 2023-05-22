import { useState, useEffect } from "react";
import axios, { all } from "axios";

import useFirebase from "../../../hooks/useFirebase";

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
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/SearchRounded";

import "./StudentsProjects.scss";

const StudentsProjects = () => {
  const { user } = useFirebase();
  const userStatus = user?.status;

  const [projects, setProjects] = useState([]);
  const [allclass, setAllclass] = useState([]);

  const getAllProjects = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/students-projects")
        .then((res) => {
          setProjects(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getAllClass = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/classes")
        .then((res) => {
          setAllclass(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllProjects();
    getAllClass();
  }, []);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setOpen(false);
  };

  console.log(allclass);

  return (
    <div className="students-project-container">
      <div className="header-students-projects">
        <div className="search-bar-container">
          <form noValidate autoComplete="off" style={{ width: "70%" }}>
            <TextField
              id="outlined-basic"
              label="Rechercher les projets"
              variant="outlined"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: "100%" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </div>
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            displayEmpty
            sx={{ display: "flex", width: "100%" }}
          >
            <MenuItem value="" disabled>
              Choississez une promo
            </MenuItem>
            {allclass.map((promo) => (
              <MenuItem value={promo.name}>{promo.name}</MenuItem>
            ))}
          </Select>{" "}
        </FormControl>
        {userStatus === "etudiant" ? (
          <Button onClick={handleClickOpen}>Publier mon projet</Button>
        ) : (
          <div></div>
        )}
      </div>
      <Card
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
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
                // onChange={handleFileChange}
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
      </Card>
      <h1>Les projets mis en avant</h1>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "300px",
          }}
          /* eslint-disable no-unused-expressions */
          onClick={() => {}}
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
      <h1>Tous les projets</h1>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "300px",
              }}
              onClick={() => {}}
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
                src={project.imgProject}
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
                  {project.nameProject}
                </h2>
                <Typography variant="body2" color="text.secondary">
                  {project.descriptionProject}
                </Typography>
                <Button> </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default StudentsProjects;
