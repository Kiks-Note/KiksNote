import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

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
  Skeleton,
  Avatar,
} from "@mui/material";

import CodeIcon from "@mui/icons-material/Code";
import BackHandRoundedIcon from "@mui/icons-material/BackHandRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import MediationRoundedIcon from "@mui/icons-material/MediationRounded";
import SchoolIcon from "@mui/icons-material/School";

import CreateProjectDialog from "./CreateProjectDialog";
import CreateTechnoModal from "./CreateTechnoModal";
import CarouselProjects from "./CarouselProjects";
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
  let navigate = useNavigate();

  const { user } = useFirebase();
  const userStatus = user?.status;

  const [open, setOpen] = useState(false);

  const [projects, setProjects] = useState([]);
  const [allclass, setAllclass] = useState([]);
  const [allstudents, setAllStudents] = useState([]);
  const [technos, setTechnos] = useState([]);

  const [nameProject, setNameProject] = useState("");
  const [repoProjectLink, setRepoProjectLink] = useState("");
  const [promoProject, setPromoProject] = useState([]);
  const [membersProject, setMembersProject] = useState([]);
  const [technosProject, setTechnosProject] = useState([]);
  const [typeProject, setTypeProject] = useState("");
  const [descriptionProject, setDescriptionProject] = useState("");

  const [loading, setLoading] = useState(true);

  const [selectedFilterTypeProject, setSelectedFilterTypeProject] =
    useState("");
  const [selectedFilterClass, setSelectedFilterClass] = useState("");
  const [selectedIdFilterClass, setSelectedIdFilterClass] = useState("");
  const [selectedIdFilterTechno, setSelectedIdFilterTechno] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  const [files, setFiles] = useState([]);
  const rejectedFiles = files.filter((file) => file.errors);
  const [projectImageBase64, setProjectImageBase64] = useState("");

  const [openTechno, setOpenTechno] = useState(false);
  const [technoName, setTechnoName] = useState("");
  const [technoImageBase64, setTechnoImageBase64] = useState("");

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

  const handleOpenTechno = () => {
    setOpenTechno(true);
  };

  const handleCloseTechno = () => {
    setOpenTechno(false);
  };

  const handleTechnoFileChange = (fileData) => {
    setTechnoImageBase64(fileData);
  };

  const createTechno = async () => {
    try {
      await axios
        .post("http://localhost:5050/ressources/technos", {
          name: technoName,
          image: technoImageBase64,
        })
        .then((res) => {
          if (res.status === 200) {
            toastSuccess(
              `La nouvelle technologie ${technoName} a bien été ajouté`
            );
            handleCloseTechno();
            getAllTechnos();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      if (error.response.status === 400) {
        toastWarning("Veuillez remplir tous les champs.");
      }
      console.error(error);
      toastFail("Erreur lors de la création de votre cours.");
      throw error;
    }
  };

  const getAllTechnos = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/technos")
        .then((res) => {
          setTechnos(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
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
    if (
      nameProject === "" ||
      repoProjectLink === "" ||
      !promoProject ||
      !membersProject ||
      !technosProject ||
      typeProject === "" ||
      descriptionProject === "" ||
      projectImageBase64 === ""
    ) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    } else {
      try {
        await axios
          .post("http://localhost:5050/ressources/students-projects", {
            StudentId: user?.id,
            nameProject: nameProject,
            RepoProjectLink: repoProjectLink,
            promoProject: promoProject,
            membersProject: membersProject,
            technosProject: technosProject,
            typeProject: typeProject,
            descriptionProject: descriptionProject,
            imgProject: projectImageBase64,
            counterRef: 0,
          })
          .then((res) => {
            console.log(res);
            if (
              res.status === 200 &&
              res.data?.message === "Projet étudiant créé avec succès."
            ) {
              toastSuccess(`Votre project ${nameProject} a bien été uploadé !`);
            }
          })
          .catch((error) => {
            toastFail("Erreur lors de la création d'un projet étudiant");
            console.log(error);
          });
      } catch (error) {
        throw error;
      }
    }
  };

  const referStudentProject = async (
    projectId,
    projectName,
    countRefAdd,
    userId
  ) => {
    try {
      await axios
        .post("http://localhost:5050/ressources/refprojects", {
          projectId: projectId,
          counterRefToAdd: countRefAdd,
          userId: userId,
        })
        .then((res) => {
          if (
            res.data.message === "Projet étudiant mis à jour avec succès." &&
            res.status === 200
          ) {
            toastSuccess(
              `Vous avez bien mis en avant le projet ${projectName}`
            );
          } else {
            toastWarning(
              `Vous avez déjà mis en avant le projet ${projectName}!`
            );
          }
        })
        .catch((err) => {
          toastFail(`Vous avez déjà mis en avant le projet ${projectName}`);
          console.log(err);
        });
    } catch (error) {
      console.log(error.response.status);
      console.log(error.response.data.message);
      toastWarning(`Erreur lors de la mise en avant du projet ${projectName}`);
    }
  };

  const onSubmitTechno = async () => {
    await createTechno();
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
      if (selectedIdFilterTechno !== "") {
        return project.technosProject.some(
          (techno) => techno.id === selectedIdFilterTechno
        );
      }
      return true;
    });
    filtered.sort((a, b) => b.counterRef - a.counterRef);

    setFilteredProjects(filtered);
  };

  useEffect(() => {
    filterProjects();
  }, [
    selectedFilterTypeProject,
    selectedIdFilterClass,
    selectedIdFilterTechno,
    projects,
  ]);

  useEffect(() => {
    getAllProjects()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    getAllClass()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    getAllStudents()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    getAllTechnos()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
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
    if (
      nameProject === "" ||
      repoProjectLink === "" ||
      !promoProject ||
      !membersProject ||
      !technosProject ||
      typeProject === "" ||
      descriptionProject === "" ||
      projectImageBase64 === ""
    ) {
    } else {
      setOpen(false);
      getAllProjects();
    }
  };

  const allTypesProject = [
    ...new Set(Object.values(projects).map((project) => project.typeProject)),
  ];

  return (
    <>
      {loading ? (
        <>
          <div className="students-project-container">
            <div className="header-students-projects">
              <FormControl sx={{ width: "20%" }}>
                <Select
                  value=""
                  displayEmpty
                  renderValue={() => "Type"}
                  disabled
                >
                  <MenuItem value="">Filtrer sur le type de projet</MenuItem>
                  <MenuItem value={1}>Type 1</MenuItem>
                  <MenuItem value={2}>Type 2</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ width: "20%" }}>
                <Select
                  value=""
                  displayEmpty
                  renderValue={() => "Promo"}
                  disabled
                >
                  <MenuItem value="">Filtrer sur la promo</MenuItem>
                  <MenuItem value={1}>Promo 1</MenuItem>
                  <MenuItem value={2}>Promo 2</MenuItem>
                </Select>
              </FormControl>
              <div></div>
            </div>
            <h1 className="h1-project">Top10 Projets Étudiants</h1>
            <CarouselProjects
              topProjects={filteredProjects.slice(0, 10)}
              loading={loading}
            />
            <h1 className="h1-project">Projets Étudiants</h1>
            <Grid container spacing={2}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "300px",
                    }}
                  >
                    <Skeleton width={300} height={300} variant="rectangular" />
                    <CardContent sx={{ padding: "10px", height: "120px" }}>
                      <div>
                        <h2 variant="h3" component="div">
                          <Skeleton width={200} />
                        </h2>
                      </div>
                      <Chip
                        sx={{ marginRight: "10px" }}
                        label={
                          <Typography>
                            <Skeleton width={100} />
                          </Typography>
                        }
                      />
                      <Button sx={{ color: "#7a52e1" }}>
                        <Skeleton width={30} height={20} />
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </>
      ) : (
        <>
          <video
            src="https://firebasestorage.googleapis.com/v0/b/codenote2-adad2.appspot.com/o/7%20Projects%20to%20Improve%20Your%20Web%20Dev%20Skills.mp4?alt=media&token=9fe5bb7e-64cc-423d-a306-99238e384d53&_gl=1*ijznk2*_ga*MTYyMTQ5ODM0OS4xNjY5NTc2Mjgz*_ga_CW55HF8NVT*MTY4NjIwODAzOC45Ni4xLjE2ODYyMDgwNTMuMC4wLjA."
            controls
          ></video>
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
                    setSelectedIdFilterClass(
                      selectedClass ? selectedClass.id : ""
                    );
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
              <FormControl sx={{ width: "20%" }}>
                <Select
                  labelId="techno-select-label"
                  id="techno-select"
                  value={selectedIdFilterTechno}
                  onChange={(event) => {
                    setSelectedIdFilterTechno(event.target.value);
                  }}
                  displayEmpty
                  renderValue={(value) => {
                    const selectedTechno = technos.find(
                      (techno) => techno.id === value
                    );
                    return selectedTechno ? selectedTechno.name : "Techno";
                  }}
                >
                  <MenuItem value="">Choisir une techno</MenuItem>
                  {technos.map((techno) => (
                    <MenuItem key={techno.id} value={techno.id}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={techno.image}
                          alt={techno.name}
                          style={{ width: "40px", marginRight: "10px" }}
                        />
                        {techno.name}
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {userStatus === "etudiant" ? (
                <Button
                  onClick={handleClickOpen}
                  sx={{
                    backgroundColor: "#7a52e1",
                    color: "white",
                    width: "15%",
                  }}
                >
                  Publier mon projet
                </Button>
              ) : (
                <div></div>
              )}
              {userStatus === "po" ? (
                <>
                  <Button
                    sx={{
                      padding: "10px",
                      margin: "10px",
                      backgroundColor: "#D1229D",
                      color: "white",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#e10da2",
                      },
                    }}
                    startIcon={<CodeIcon />}
                    onClick={handleOpenTechno}
                  >
                    Ajouter un techno
                  </Button>
                  <CreateTechnoModal
                    open={openTechno}
                    handleClose={handleCloseTechno}
                    handleDrop={handleDrop}
                    handleFileChange={handleTechnoFileChange}
                    handleRemove={handleRemove}
                    rejectedFiles={rejectedFiles}
                    technoName={technoName}
                    setTechnoName={setTechnoName}
                    onSubmit={onSubmitTechno}
                  />
                </>
              ) : (
                <div></div>
              )}
            </div>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
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
                promoProject={promoProject}
                setPromoProject={setPromoProject}
                membersProject={membersProject}
                setMembersProject={setMembersProject}
                technosProject={technosProject}
                setTechnosProject={setTechnosProject}
                typeProject={typeProject}
                setTypeProject={setTypeProject}
                descriptionProject={descriptionProject}
                setDescriptionProject={setDescriptionProject}
                control={control}
                allstudents={allstudents}
                allclass={allclass}
                alltechnos={technos}
              />
            </Card>
            <h1 className="h1-project">Top10 Projets Étudiants</h1>
            <CarouselProjects
              topProjects={filteredProjects.slice(0, 10)}
              loading={loading}
            />
            <h1 className="h1-project">Projets Étudiants</h1>
            <div
              style={{
                width: "90%",
                margin: "auto",
              }}
            >
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
                  filteredProjects.slice(10).map((project) => (
                    <>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "370px",
                          }}
                          onClick={() => {
                            navigate(`${project.id}`);
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

                          <CardContent
                            sx={{ padding: "10px", height: "350px" }}
                          >
                            {project.typeProject === "Web" ? (
                              <div>
                                <h2
                                  variant="h3"
                                  component="div"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {project.nameProject} - {project.typeProject}
                                  <DesktopWindowsRoundedIcon
                                    sx={{ marginLeft: "5px" }}
                                  />
                                </h2>
                              </div>
                            ) : project.typeProject === "Mobile" ? (
                              <div>
                                <h2
                                  variant="h3"
                                  component="div"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {project.nameProject} - {project.typeProject}
                                  <SmartphoneRoundedIcon
                                    sx={{ marginLeft: "5px" }}
                                  />
                                </h2>
                              </div>
                            ) : project.typeProject === "Gaming" ? (
                              <div>
                                <h2
                                  variant="h3"
                                  component="div"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {project.nameProject} - {project.typeProject}
                                  <SportsEsportsRoundedIcon
                                    sx={{ marginLeft: "5px" }}
                                  />
                                </h2>
                              </div>
                            ) : project.typeProject === "IA" ? (
                              <div>
                                <h2
                                  variant="h3"
                                  component="div"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {project.nameProject} - {project.typeProject}
                                  <SmartToyRoundedIcon
                                    sx={{ marginLeft: "5px" }}
                                  />
                                </h2>
                              </div>
                            ) : project.typeProject === "DevOps" ? (
                              <div>
                                <h2
                                  variant="h3"
                                  component="div"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
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
                                  <Typography>
                                    {project.promoProject.name}
                                  </Typography>
                                </>
                              }
                            ></Chip>
                            <div className="type-promo-project-container">
                              {project.promoProject.map((promo) => (
                                <Chip
                                  sx={{
                                    display: "flex",
                                    padding: "10px",
                                  }}
                                  label={
                                    <>
                                      <div style={{ display: "flex" }}>
                                        <Typography>{promo.name}</Typography>
                                        <SchoolIcon />
                                      </div>
                                    </>
                                  }
                                ></Chip>
                              ))}
                            </div>
                            <div className="type-promo-project-container">
                              {project.technosProject.map((techno) => (
                                <Chip
                                  avatar={
                                    <Avatar
                                      alt={techno.name}
                                      src={techno.image}
                                    />
                                  }
                                  sx={{
                                    display: "flex",
                                    padding: "10px",
                                  }}
                                  label={
                                    <>
                                      <div style={{ display: "flex" }}>
                                        <Typography>{techno.name}</Typography>
                                      </div>
                                    </>
                                  }
                                ></Chip>
                              ))}
                            </div>
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
                                <BackHandRoundedIcon
                                  sx={{ marginLeft: "3px" }}
                                />
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
                                <BackHandRoundedIcon
                                  sx={{ marginLeft: "3px" }}
                                />
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
                                <BackHandRoundedIcon
                                  sx={{ marginLeft: "3px" }}
                                />
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    </>
                  ))
                )}
              </Grid>
            </div>

            <ToastContainer></ToastContainer>
          </div>
        </>
      )}
    </>
  );
};

export default StudentsProjects;
