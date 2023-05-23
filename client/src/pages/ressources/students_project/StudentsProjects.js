import { useState, useEffect } from "react";
import axios, { all } from "axios";

import useFirebase from "../../../hooks/useFirebase";

import CreateProjectDialog from "./CreateProjectDialog";

import { useForm } from "react-hook-form";

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

import CarouselProjects from "./CarouselProjects";
import "./StudentsProjects.scss";

const StudentsProjects = () => {
  const { user } = useFirebase();
  const userStatus = user?.status;

  const [open, setOpen] = useState(false);

  const [projects, setProjects] = useState([]);
  const [allclass, setAllclass] = useState([]);
  const [allstudents, setAllStudents] = useState([]);

  const [nameProject, setNameProject] = useState("");
  const [repoProjectLink, setRepoProjectLink] = useState("");
  const [membersProject, setMembersProject] = useState([]);
  const [typeProject, setTypeProject] = useState("");
  const [descriptionProject, setDescriptionProject] = useState("");
  const [imgProjectLink, setImgProjectLink] = useState("");

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

  const getAllStudents = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/students")
        .then((res) => {
          setAllStudents(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const publishStudentProject = async () => {
    try {
      await axios
        .post("http://localhost:5050/ressources/students-projects", {
          StudentId: user?.id,
          nameProject: nameProject,
          RepoProjectLink: repoProjectLink,
          membersProject: membersProject,
          typeProject: typeProject,
          descriptionProject: descriptionProject,
          imgProject: imgProjectLink,
          counterRef: 0,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getAllProjects();
    getAllClass();
    getAllStudents();
  }, []);

  const { control } = useForm({
    mode: "onTouched",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    await publishStudentProject();
    event.preventDefault();
    setOpen(false);
  };

  const sortedProjects = projects.sort((a, b) => b.counterRef - a.counterRef);
  const topProjects = sortedProjects.slice(0, 10);
  const filteredProjects = sortedProjects.slice(10);

  return (
    <div className="students-project-container">
      <div className="header-students-projects">
        <div className="search-bar-container">
          <form noValidate autoComplete="off" style={{ width: "100%" }}>
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
        <CreateProjectDialog
          open={open}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          nameProject={nameProject}
          setNameProject={setNameProject}
          repoProjectLink={repoProjectLink}
          setRepoProjectLink={setRepoProjectLink}
          membersProject={membersProject}
          setMembersProject={setMembersProject}
          typeProject={typeProject}
          setTypeProject={setTypeProject}
          descriptionProject={descriptionProject}
          setDescriptionProject={setDescriptionProject}
          imgProjectLink={imgProjectLink}
          setImgProjectLink={setImgProjectLink}
          control={control}
          allstudents={allstudents}
        />
      </Card>
      <h1>Les projets mis en avant</h1>
      <CarouselProjects projects={topProjects} />
      <h1>Tous les projets</h1>
      <Grid container spacing={2}>
        {filteredProjects.map((project) => (
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
