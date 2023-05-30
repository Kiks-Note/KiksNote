import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

import useFirebase from "../../../hooks/useFirebase";

import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  FormControl,
  Select,
  Chip,
  MenuItem,
} from "@mui/material";

import BackHandRoundedIcon from "@mui/icons-material/BackHandRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import MediationRoundedIcon from "@mui/icons-material/MediationRounded";

import CreateProjectDialog from "./CreateProjectDialog";
import CarouselProjects from "./CarouselProjects";
import StudentProjectInfo from "./StudentProjectInfo";
import studentProjectsImg from "../../../assets/img/students-projects.jpg";

import "./StudentsProjects.scss";
import "react-toastify/dist/ReactToastify.css";

const options = {
  autoClose: 2000,
  className: "",
  position: toast.POSITION.TOP_RIGHT,
  theme: "colored",
};

export const toastSuccess = (message) => {
  toast.success(message, options);
};

export const toastWarning = (message) => {
  toast.warning(message, options);
};

export const toastFail = (message) => {
  toast.error(message, options);
};

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
  const [selectedClass, setSelectedClass] = useState("");
  const [idSelectedClass, setIdSelectedClass] = useState("");

  const [selectedProjectData, setSelectedProjectData] = useState("");

  const [selectedFilterTypeProject, setSelectedFilterTypeProject] =
    useState("");
  const [selectedFilterClass, setSelectedFilterClass] = useState("");
  const [selectedIdFilterClass, setSelectedIdFilterClass] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  const [files, setFiles] = useState([]);
  const rejectedFiles = files.filter((file) => file.errors);
  const [projectImageBase64, setProjectImageBase64] = useState("");

  var votePo = 5;
  var votePedago = 3;
  var voteStudent = 1;

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((files) => [...files, ...acceptedFiles]);
  }, []);

  const handleRemove = (file) => () => {
    setFiles((files) => files.filter((f) => f !== file));
  };

  const handleFileChange = (fileData) => {
    setProjectImageBase64(fileData);
  };

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
          imgProject: projectImageBase64,
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

  const referStudentProject = async (
    projectId,
    projectName,
    countRefAdd,
    userId
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5050/ressources/refprojects",
        {
          projectId: projectId,
          counterRefToAdd: countRefAdd,
          userId: userId,
        }
      );

      if (response.data.message === "Projet étudiant mis à jour avec succès.") {
        toastSuccess(`Vous avez bien mis en avant le projet ${projectName}`);
      } else {
        toastWarning(`Vous avez déjà mis en avant le projet ${projectName}!`);
      }
    } catch (error) {
      console.log(error.response.status);
      console.log(error.response.data.message);
      toastWarning(`Erreur lors de la mise en avant du projet ${projectName}`);
    }
  };

  const filterProjects = () => {
    const filtered = projects.filter((project) => {
      if (selectedIdFilterClass !== "") {
        return (
          project.promoProject &&
          project.promoProject.id === selectedIdFilterClass
        );
      }
      if (selectedFilterTypeProject !== "") {
        return project.typeProject === selectedFilterTypeProject;
      }
      return true;
    });
    filtered.sort((a, b) => b.counterRef - a.counterRef);

    setFilteredProjects(filtered);
  };

  useEffect(() => {
    filterProjects();
  }, [selectedFilterTypeProject, selectedIdFilterClass, projects]);

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

  const allTypesProject = [
    ...new Set(Object.values(projects).map((project) => project.typeProject)),
  ];

  console.log(filteredProjects);

  console.log(selectedIdFilterClass);

  return (
    <div className="students-project-container">
      <div className="header-students-projects">
        <FormControl sx={{ width: "20%" }}>
          <Select
            value={selectedFilterTypeProject}
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
        <FormControl sx={{ width: "20%" }}>
          <Select
            value={selectedFilterClass}
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
            sx={{ backgroundColor: "#7a52e1", color: "white", width: "15%" }}
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
          handleDrop={handleDrop}
          handleFileChange={handleFileChange}
          handleRemove={handleRemove}
          rejectedFiles={rejectedFiles}
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
          setIdSelectedClass={setIdSelectedClass}
          control={control}
          allstudents={allstudents}
          allclass={allclass}
        />
      </Card>
      <h1 className="h1-project">Top10 Projets Étudiants</h1>
      <CarouselProjects
        topProjects={filteredProjects.slice(0, 10)}
        selectedFilterType={selectedFilterTypeProject}
        selectedIdFilterClass={selectedIdFilterClass}
        handleOpenProject={handleOpenProject}
      />
      <h1 className="h1-project">Projets Étudiants</h1>
      <Grid container spacing={2}>
        {filteredProjects.slice(10).length === 0 ? (
          <>
            <div className="no-projects-container">
              <p>Aucun projet étudiant publié pour le moment</p>
              <img
                className="no-class-img"
                src={studentProjectsImg}
                alt="no-projects-students-uploaded"
              />
            </div>
          </>
        ) : (
          filteredProjects
            .slice(10)
            .filter((project) =>
              selectedIdFilterClass !== ""
                ? project.promoProject &&
                  project.promoProject.id === selectedIdFilterClass
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
                      {project.typeProject === "Web" ? (
                        <div>
                          <h2 variant="h3" component="div">
                            {project.nameProject} - {project.typeProject}
                            <DesktopWindowsRoundedIcon
                              sx={{ marginLeft: "5px" }}
                            />
                          </h2>
                        </div>
                      ) : project.typeProject === "Mobile" ? (
                        <div>
                          <h2 variant="h3" component="div">
                            {project.nameProject} - {project.typeProject}
                            <SmartphoneRoundedIcon sx={{ marginLeft: "5px" }} />
                          </h2>
                        </div>
                      ) : project.typeProject === "Gaming" ? (
                        <div>
                          <h2 variant="h3" component="div">
                            {project.nameProject} - {project.typeProject}
                            <SportsEsportsRoundedIcon
                              sx={{ marginLeft: "5px" }}
                            />
                          </h2>
                        </div>
                      ) : project.typeProject === "IA" ? (
                        <div>
                          <h2 variant="h3" component="div">
                            {project.nameProject} - {project.typeProject}
                            <SmartToyRoundedIcon sx={{ marginLeft: "5px" }} />
                          </h2>
                        </div>
                      ) : project.typeProject === "DevOps" ? (
                        <div>
                          <h2 variant="h3" component="div">
                            {project.nameProject} - {project.typeProject}
                            <MediationRoundedIcon />
                          </h2>
                        </div>
                      ) : (
                        <div></div>
                      )}

                      <Chip
                        sx={{ marginRight: "10px" }}
                        label={
                          <>
                            <Typography>{project.promoProject.name}</Typography>
                          </>
                        }
                      ></Chip>
                      {userStatus === "po" ? (
                        <Button
                          onClick={(event) => {
                            event.stopPropagation();
                            referStudentProject(
                              project.id,
                              project.nameProject,
                              votePo,
                              user?.id
                            );
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
                            referStudentProject(
                              project.id,
                              project.nameProject,
                              votePedago,
                              user?.id
                            );
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
                            referStudentProject(
                              project.id,
                              project.nameProject,
                              voteStudent,
                              user?.id
                            );
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
            ))
        )}

        <StudentProjectInfo
          handleCloseProject={handleCloseProject}
          openProject={openProject}
          projectData={selectedProjectData}
          creator={user?.email}
        />
      </Grid>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default StudentsProjects;
