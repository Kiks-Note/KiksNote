import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import useFirebase from "../../../hooks/useFirebase";

import {
  Button,
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
import BackHandRoundedIcon from "@mui/icons-material/BackHandRounded";

import CreateProjectDialog from "./CreateProjectDialog";
import CarouselProjects from "./CarouselProjects";
import StudentProjectInfo from "./StudentProjectInfo";
import "./StudentsProjects.scss";

const StudentsProjects = () => {
  const { user } = useFirebase();
  const userStatus = user?.status;

  const [open, setOpen] = useState(false);
  const [openProject, setOpenProject] = useState(false);

  const [projects, setProjects] = useState([]);
  const [allclass, setAllclass] = useState([]);
  const [allstudents, setAllStudents] = useState([]);

  const [nameProject, setNameProject] = useState("");
  const [repoProjectLink, setRepoProjectLink] = useState("");
  const [membersProject, setMembersProject] = useState([]);
  const [typeProject, setTypeProject] = useState("");
  const [descriptionProject, setDescriptionProject] = useState("");
  const [imgProjectLink, setImgProjectLink] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [idSelectedClass, setIdSelectedClass] = useState("");

  const [selectedProjectData, setSelectedProjectData] = useState("");

  const [selectedFilterTypeProject, setSelectedFilterTypeProject] =
    useState("");
  const [selectedFilterClass, setSelectedFilterClass] = useState("");
  const [selectedIdFilterClass, setSelectedIdFilterClass] = useState("");

  let votePo = 5;
  let votePedago = 3;
  let voteStudent = 1;

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

  const getStudentProjectById = async (projectId) => {
    try {
      const response = await axios.get(
        `http://localhost:5050/ressources/studentsprojects/${projectId}`
      );
      setSelectedProjectData(response.data);
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
          promoProject: idSelectedClass,
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

  const referStudentProject = async (projectId, countRefAdd) => {
    try {
      await axios
        .post("http://localhost:5050/ressources/refprojects", {
          projectId: projectId,
          counterRefToAdd: countRefAdd,
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

  const handleOpenProject = (projectId) => {
    setOpenProject(true);
    getStudentProjectById(projectId);
  };

  const handleCloseProject = () => {
    setOpenProject(false);
  };

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

  const allTypesProject = [
    ...new Set(Object.values(projects).map((project) => project.typeProject)),
  ];

  return (
    <div className="students-project-container">
      <div className="header-students-projects">
        <div className="search-bar-container">
          <form noValidate autoComplete="off" style={{ width: "80%" }}>
            <TextField
              id="outlined-basic"
              label="Rechercher les projets"
              variant="outlined"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: "80%" }}
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
        <FormControl sx={{ width: "30%" }}>
          <Select
            value={selectedFilterTypeProject}
            sx={{ width: "50%" }}
            onChange={(event) => {
              setSelectedFilterTypeProject(event.target.value);
            }}
            displayEmpty
            renderValue={(value) => value || "Type"}
          >
            <MenuItem value="">Filtrer sur le type de projet</MenuItem>
            {allTypesProject.map((type) => (
              <MenuItem value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: "30%" }}>
          <Select
            value={selectedFilterClass}
            sx={{ width: "50%" }}
            onChange={(event) => {
              setSelectedFilterClass(event.target.value);
              const selectedClass = allclass.find(
                (coursClass) => coursClass.name === event.target.value
              );
              setSelectedIdFilterClass(selectedClass ? selectedClass.id : "");
            }}
            displayEmpty
            renderValue={(value) => value || "Promo"}
          >
            <MenuItem value="">Filtrer sur la promo</MenuItem>
            {allclass.map((promo) => (
              <MenuItem value={promo.name}>{promo.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {userStatus === "etudiant" ? (
          <Button
            onClick={handleClickOpen}
            sx={{ backgroundColor: "#7a52e1", color: "white", width: "20%" }}
          >
            Publier mon projet
          </Button>
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
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          membersProject={membersProject}
          setMembersProject={setMembersProject}
          typeProject={typeProject}
          setTypeProject={setTypeProject}
          descriptionProject={descriptionProject}
          setDescriptionProject={setDescriptionProject}
          imgProjectLink={imgProjectLink}
          setImgProjectLink={setImgProjectLink}
          setIdSelectedClass={setIdSelectedClass}
          control={control}
          allstudents={allstudents}
          allclass={allclass}
        />
      </Card>
      <h1>Les projets mis en avant</h1>
      <CarouselProjects
        projects={topProjects}
        selectedFilterType={selectedFilterTypeProject}
        selectedIdFilterClass={selectedIdFilterClass}
        // handleOpenProject={() => handleOpenProject()}
      />
      <h1>Tous les projets</h1>
      <Grid container spacing={2}>
        {filteredProjects
          .filter((project) =>
            selectedIdFilterClass !== ""
              ? project.promoProject === selectedIdFilterClass
              : true
          )
          .map((project) => (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "300px",
                  }}
                  onClick={() => {
                    handleOpenProject(project.id);
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
                    {userStatus === "po" ? (
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          referStudentProject(project.id, votePo);
                        }}
                        sx={{ color: "#7a52e1" }}
                      >
                        {project.counterRef}{" "}
                        <BackHandRoundedIcon sx={{ marginLeft: "3px" }} />
                      </Button>
                    ) : userStatus === "pedago" ? (
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          referStudentProject(project.id, votePedago);
                        }}
                        sx={{ color: "#7a52e1" }}
                      >
                        {project.counterRef}{" "}
                        <BackHandRoundedIcon sx={{ marginLeft: "3px" }} />
                      </Button>
                    ) : (
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          referStudentProject(project.id, voteStudent);
                        }}
                        sx={{ color: "#7a52e1" }}
                      >
                        {project.counterRef}{" "}
                        <BackHandRoundedIcon sx={{ marginLeft: "3px" }} />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </>
          ))}
        <StudentProjectInfo
          handleCloseProject={handleCloseProject}
          openProject={openProject}
          projectData={selectedProjectData}
          creator={user?.email}
        />
      </Grid>
    </div>
  );
};

export default StudentsProjects;
