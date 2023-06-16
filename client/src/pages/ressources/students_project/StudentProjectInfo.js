import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import axios from "axios";
import useFirebase from "../../../hooks/useFirebase";
import { toast, ToastContainer } from "react-toastify";

import { makeStyles } from "@mui/styles";

import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

import BackHandRoundedIcon from "@mui/icons-material/BackHandRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import MediationRoundedIcon from "@mui/icons-material/MediationRounded";
import ConstructionIcon from "@mui/icons-material/Construction";
import GitHubIcon from "@mui/icons-material/GitHub";
import AddLinkIcon from "@mui/icons-material/AddLink";
import BackHandRoundedIcon from "@mui/icons-material/BackHandRounded";
import ConstructionIcon from "@mui/icons-material/Construction";
import DeleteIcon from "@mui/icons-material/Delete";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/Delete";
import VideocamIcon from "@mui/icons-material/Videocam";
import EditIcon from "@mui/icons-material/Edit";

import NoVotesImg from "../../../assets/img/votes-students-projects.svg";

import SkeletonStudentProjectInfo from "../../../components/ressources/students_project/SkeletonStudentProjectInfo";
import BlogTutosLinkDialog from "./../../../components/ressources/students_project/BlogTutosLinkDialog";
import UploadVideoPlayerDialog from "./../../../components/ressources/students_project/UploadVideoStudentProject";
import UpdateProjectDialog from "./../../../components/ressources/students_project/UpdateStudentProject";

import SkeletonStudentProjectInfo from "../../../components/ressources/students_project/SkeletonStudentProjectInfo";

import "./StudentsProjectsInfo.scss";

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

const useStyles = makeStyles({
  btnVideoProject: {
    backgroundColor: "#76238b",
    color: "white",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#76238b",
      fontWeight: "bold",
    },
  },
  btnEditProject: {
    backgroundColor: "#df005a",
    color: "white",
    "&:hover": {
      backgroundColor: "#df005a",
      fontWeight: "bold",
    },
  },
  btnDeleteProject: {
    backgroundColor: "red",
    color: "white",
    "&:hover": {
      backgroundColor: "darkred",
      fontWeight: "bold",
    },
  },
});

const StudentProjectInfo = () => {
  const classes = useStyles();
  const { user } = useFirebase();
  const navigate = useNavigate();

  const { projectid } = useParams();

  const [allblogtutos, setAllBlogTutos] = useState([]);
  const [blogTutoData, setBlogTutoData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedProjectData, setSelectedProjectData] = useState("");
  const [openVoters, setOpenVoters] = useState(false);
  const [openBlogTutos, setOpenBlogTutos] = useState(false);
  const [openUploadVideo, setOpenUploadVideo] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [nameProject, setNameProject] = useState("");
  const [repoProjectLink, setRepoProjectLink] = useState("");
  const [promoProject, setPromoProject] = useState([]);
  const [membersProject, setMembersProject] = useState([]);
  const [technosProject, setTechnosProject] = useState([]);
  const [typeProject, setTypeProject] = useState("");
  const [descriptionProject, setDescriptionProject] = useState("");
  const [imgProject, setImgProject] = useState("");

  const [files, setFiles] = useState([]);
  const rejectedFiles = files.filter((file) => file.errors);

  const [allclass, setAllclass] = useState([]);
  const [allstudents, setAllStudents] = useState([]);
  const [technos, setTechnos] = useState([]);

  const [hasAddedBlog, setHasAddedBlog] = useState(false);

  const handleClickVoters = () => {
    setOpenVoters(!openVoters);
  };

  const handleFileChange = (fileData) => {
    setImgProject(fileData);
  };

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((files) => [...files, ...acceptedFiles]);
  }, []);

  /*
    Get an Array of classes then set it in allClass
  */

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

  /*
      Get an Array of students then set it in allStudents
    */

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

  /*
    Get an Array that contains every blog tuto and set it into allBlogTuto 
  */

  const getBlogTutorials = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_SERVER_API}/ressources/blogstutos`)
        .then((res) => {
          setAllBlogTutos(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  /*
    Get an Array that contains every blog tuto data 
    and set it into blogTutoData using the blogTutoId (String) 
  */

  const getBlogTutoById = async (blogTutoId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_API}/ressources/blogstutos/${blogTutoId}`
      );
      setBlogTutoData(response.data);
      setHasAddedBlog(true);
    } catch (error) {
      console.error(error);
    }
  };

  /*
    Get an Array that contains every blog tuto and set it into allBlogTuto 
  */

  const getStudentProjectById = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_API}/ressources/studentsprojects/${projectid}`
      );
      setSelectedProjectData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const editProject = async (
    nameProject,
    RepoProjectLink,
    promoProject,
    membersProject,
    technosProject,
    typeProject,
    descriptionProject,
    imgProject
  ) => {
    try {
      await axios
        .put(`http://localhost:5050/ressources/student-project/${projectid}`, {
          nameProject: nameProject,
          RepoProjectLink: RepoProjectLink,
          promoProject: promoProject,
          membersProject: membersProject,
          technosProject: technosProject,
          typeProject: typeProject,
          descriptionProject: descriptionProject,
          imgProject: imgProject,
        })
        .then((res) => {
          if (
            res.status === 200 &&
            res.data.message === "Projet étudiant modifié avec succès."
          ) {
            toastSuccess(
              `Votre projet ${nameProject} a bien été modifié avec succès`
            );
            getStudentProjectById(projectid);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLinkedBlogTuto = async (
    project_id,
    linkedBlogTuto,
    studentProjectName
  ) => {
    try {
      await axios
        .delete(
          `${process.env.REACT_APP_SERVER_API}/ressources/linkblogtuto/${project_id}`
        )
        .then((res) => {
          if (
            res.status === 200 &&
            res.data ===
              "Le lien avec le blog tutoriel a été supprimé avec succès."
          ) {
            toastSuccess(
              `Le blog tuto lié ${linkedBlogTuto} n'est plus lié avec projet étudiant ${studentProjectName}`
            );
          }
          getStudentProjectById(projectid);
          setBlogTutoData([]);
          setHasAddedBlog(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStudentProject = async (nameProject, projectId) => {
    const data = { nameProject, projectId };

    try {
      await axios
        .delete(`http://localhost:5050/ressources/student-project`, { data })
        .then((res) => {
          if (
            res.data.message === "Projet étudiant supprimé avec succès." &&
            res.status === 200
          ) {
            toastSuccess(
              `Votre projet étudiant ${selectedProjectData?.nameProject} a bien été supprimé !`
            );
            setTimeout(() => {
              navigate("/studentprojects");
            }, 4000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStudentProjectById(projectid)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedProjectData?.linkedBlogTuto) {
      getBlogTutoById(selectedProjectData.linkedBlogTuto);
    }
  }, [selectedProjectData?.linkedBlogTuto]);

  const handleOpenBlogTutos = () => {
    setOpenBlogTutos(true);
    getBlogTutorials();
  };

  const handleCloseBlogTutos = () => {
    setOpenBlogTutos(false);
  };

  const handleOpenUploadVideoProject = () => {
    setOpenUploadVideo(true);
  };

  const handleCloseUploadVideoProject = () => {
    setOpenUploadVideo(false);
  };

  const handleClickOpenUpdateDialog = () => {
    getAllClass();
    getAllStudents();
    getAllTechnos();
    setOpenUpdate(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdate(false);
  };

  const deleteProject = async () => {
    deleteStudentProject(selectedProjectData?.nameProject, projectid);
  };

  const onSubmitEditProject = async () => {
    try {
      await editProject(
        nameProject,
        repoProjectLink,
        promoProject,
        membersProject,
        technosProject,
        typeProject,
        descriptionProject,
        imgProject
      );
      handleCloseUpdateDialog();
    } catch (error) {
      console.error(error);
      toastFail("Erreur lors de la modification de votre projet.");
    }
  };

  return (
    <>
      {loading ? (
        <>
          <SkeletonStudentProjectInfo />
        </>
      ) : (
        <>
          <div className="project-content">
            <div className="left-side-project">
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {selectedProjectData.nameProject}
              </Typography>
              {selectedProjectData.typeProject === "Web" ? (
                <div className="type-project-info-container">
                  <Typography sx={{ marginRight: "5px" }}>
                    Type du projet :{" "}
                  </Typography>
                  <Typography> {selectedProjectData.typeProject}</Typography>
                  <DesktopWindowsRoundedIcon sx={{ marginLeft: "5px" }} />
                </div>
              ) : selectedProjectData.typeProject === "Mobile" ? (
                <div className="type-project-info-container">
                  <Typography sx={{ marginRight: "5px" }}>
                    Type du projet :{" "}
                  </Typography>
                  <Typography> {selectedProjectData.typeProject}</Typography>
                  <SmartphoneRoundedIcon sx={{ marginLeft: "5px" }} />
                </div>
              ) : selectedProjectData.typeProject === "Gaming" ? (
                <div className="type-project-info-container">
                  <Typography sx={{ marginRight: "5px" }}>
                    Type du projet :{" "}
                  </Typography>
                  <Typography> {selectedProjectData.typeProject}</Typography>
                  <SportsEsportsRoundedIcon sx={{ marginLeft: "5px" }} />
                </div>
              ) : selectedProjectData.typeProject === "IA" ? (
                <div className="type-project-info-container">
                  <Typography sx={{ marginRight: "5px" }}>
                    Type du projet :{" "}
                  </Typography>
                  <Typography> {selectedProjectData.typeProject}</Typography>
                  <SmartToyRoundedIcon sx={{ marginLeft: "5px" }} />
                </div>
              ) : selectedProjectData.typeProject === "DevOps" ? (
                <div className="type-project-info-container">
                  <Typography sx={{ marginRight: "5px" }}>
                    Type du projet :{" "}
                  </Typography>
                  <Typography> {selectedProjectData.typeProject}</Typography>
                  <MediationRoundedIcon />
                </div>
              ) : (
                <div></div>
              )}
              <div className="type-promo-project-container">
                <Typography sx={{ marginRight: "5px" }}>Technos :</Typography>{" "}
                {selectedProjectData.technosProject.map((techno) => (
                  <Chip
                    avatar={<Avatar alt={techno.name} src={techno.image} />}
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
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: "15px 0px",
                }}
              >
                Code source du projet :{" "}
                <Link
                  to={selectedProjectData.RepoProjectLink}
                  target="_blank"
                  style={{ textDecoration: "underline" }}
                >
                  <GitHubIcon />
                </Link>
              </Typography>
              <div className="type-promo-project-container">
                {selectedProjectData.promoProject.map((promo) => (
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
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  border: "10px grey",
                  borderRadius: "20px",
                  padding: "10px",
                  margin: "15px 0px",
                }}
              >
                <Typography>
                  <ConstructionIcon /> Membres du projet :{" "}
                </Typography>
                {selectedProjectData?.membersProject?.map((member, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ display: "flex", alignItems: "center" }}>
                      <ListItemAvatar>
                        <Avatar alt={member.firstname} src={member.image} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          member.lastname.toUpperCase() + " " + member.firstname
                        }
                        secondary={
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {member.status}
                          </Typography>
                        }
                      />
                      <Button
                        component={Link}
                        to={`/profil/${member.id}`}
                        sx={{
                          backgroundColor: "#7a52e1",
                          color: "white",
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor: "#d40074",
                          },
                        }}
                      >
                        Profil <VisibilityIcon />
                      </Button>
                    </ListItem>
                    {index !==
                      selectedProjectData.membersProject.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
              {blogTutoData?.data?.thumbnail && (
                <>
                  <div style={{ display: "flex", margin: "20px" }}>
                    <Card
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <CardMedia
                        component="img"
                        src={blogTutoData.data.thumbnail}
                        alt="course image"
                        style={{
                          objectFit: "contain",
                          objectPosition: "center",
                          width: "30%",
                          minHeight: "10%",
                          padding: "20px",
                        }}
                      />
                      <CardContent
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <h4
                          style={{
                            width: "60%",
                            wordBreak: "break-all",
                            whiteSpace: "normal",
                          }}
                        >
                          {blogTutoData.data.title}
                        </h4>
                        <Button
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/tuto/${blogTutoData.id}`);
                          }}
                          sx={{
                            bgcolor: "#94258c",
                            fontWeight: "bold",
                            color: "white",
                            mr: 1,
                          }}
                        >
                          Blog Tuto
                          <OpenInNewIcon />
                        </Button>
                        {selectedProjectData?.creatorProject?.id ===
                        user?.id ? (
                          <>
                            <Button
                              onClick={(event) => {
                                event.stopPropagation();
                                deleteLinkedBlogTuto(
                                  projectid,
                                  blogTutoData?.data?.title,
                                  selectedProjectData?.nameProject
                                );
                              }}
                              variant="contained"
                              color="primary"
                              size="small"
                              sx={{
                                color: "white",
                                fontWeight: "bold",
                                backgroundColor: "#ff0000",
                                "&:hover": {
                                  backgroundColor: "#a60000",
                                },
                              }}
                            >
                              <DeleteIcon />
                            </Button>
                          </>
                        ) : (
                          <></>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              <div className="btn-link-blog-container">
                {selectedProjectData?.creatorProject?.id === user?.id ? (
                  !hasAddedBlog && (
                    <Button
                      sx={{
                        backgroundColor: "#de7700",
                        color: "white",
                        fontWeight: "bold",
                      }}
                      onClick={handleOpenBlogTutos}
                    >
                      <AddLinkIcon />
                      Lier à un article blog tuto
                    </Button>
                  )
                ) : (
                  <div></div>
                )}
              </div>
              <div className="list-counter-ref">
                <div className="counter-container">
                  <BackHandRoundedIcon sx={{ height: "16px" }} />{" "}
                  <Typography>
                    {selectedProjectData.counterRef} Mis en avant
                  </Typography>
                </div>
                <Divider />
                <div className="voters-container">
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    Liste des personnes qui ont mis en avant le projet
                  </Typography>
                  {selectedProjectData?.voters?.length > 0 ? (
                    <List>
                      <ListItem button onClick={handleClickVoters}>
                        <ListItemText
                          primary={"Afficher"}
                          style={{ textAlign: "center" }}
                        />
                        {openVoters ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse in={openVoters} timeout="auto" unmountOnExit>
                        <List disablePadding>
                          {selectedProjectData.voters.map((voter, index) => (
                            <React.Fragment key={index}>
                              <ListItem>
                                {voter.status === "etudiant" && (
                                  <Typography variant="body2" component="span">
                                    1
                                  </Typography>
                                )}
                                {voter.status === "po" && (
                                  <Typography variant="body2" component="span">
                                    5
                                  </Typography>
                                )}
                                {voter.status === "pedago" && (
                                  <Typography variant="body2" component="span">
                                    3
                                  </Typography>
                                )}
                                <BackHandRoundedIcon sx={{ height: "16px" }} />{" "}
                                <ListItemText
                                  primary={
                                    voter.lastname.toUpperCase() +
                                    " " +
                                    voter.firstname
                                  }
                                />
                              </ListItem>
                              {index !==
                                selectedProjectData.voters.length - 1 && (
                                <Divider variant="inset" component="li" />
                              )}
                            </React.Fragment>
                          ))}
                        </List>
                      </Collapse>
                    </List>
                  ) : (
                    <div className="no-votes-student-projects-container">
                      <p className="no-votes-student-projects-p">
                        Personne n'a encore mis en avant votre projet
                      </p>
                      <img
                        className="no-votes-student-projects-img"
                        src={NoVotesImg}
                        alt="no-votes-projects-students"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="right-side-project">
              <div className="img-project-box">
                <img
                  src={selectedProjectData.imgProject}
                  alt=""
                  className="img-project"
                />
              </div>
              <div className="text-project-box">
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedProjectData.descriptionProject,
                  }}
                />
                <Typography sx={{ paddingTop: "20px", textAlign: "right" }}>
                  Publié par :{" "}
                  {selectedProjectData?.creatorProject?.lastname.toUpperCase()}{" "}
                  {selectedProjectData?.creatorProject?.firstname}
                </Typography>
              </div>
              {selectedProjectData?.creatorProject?.id === user?.id ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {/* <Button
                      sx={{ margin: "20px" }}
                      onClick={handleOpenUploadVideoProject}
                      className={classes.btnVideoProject}
                    >
                      Video <VideocamIcon />
                    </Button> */}
                    <Button
                      sx={{ margin: "20px" }}
                      onClick={() => handleClickOpenUpdateDialog()}
                      className={classes.btnEditProject}
                    >
                      Modifier <EditIcon />
                    </Button>
                    <Button
                      sx={{ margin: "20px" }}
                      onClick={deleteProject}
                      className={classes.btnDeleteProject}
                    >
                      Supprimer
                      <DeleteIcon />
                    </Button>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
            <BlogTutosLinkDialog
              open={openBlogTutos}
              close={handleCloseBlogTutos}
              allblogtutos={allblogtutos}
              getStudentProjectById={getStudentProjectById}
            />
            <UploadVideoPlayerDialog
              open={openUploadVideo}
              close={handleCloseUploadVideoProject}
              nameProject={selectedProjectData.nameProject}
            />
            <UpdateProjectDialog
              open={openUpdate}
              handleClose={handleCloseUpdateDialog}
              nameProject={selectedProjectData.nameProject}
              setNameProject={setNameProject}
              repoProjectLink={selectedProjectData.RepoProjectLink}
              setRepoProjectLink={setRepoProjectLink}
              promoProject={selectedProjectData.promoProject}
              setPromoProject={setPromoProject}
              membersProject={selectedProjectData.membersProject}
              setMembersProject={setMembersProject}
              technosProject={selectedProjectData.technosProject}
              setTechnosProject={setTechnosProject}
              typeProject={selectedProjectData.typeProject}
              setTypeProject={setTypeProject}
              descriptionProject={selectedProjectData.descriptionProject}
              setDescriptionProject={setDescriptionProject}
              imgProject={selectedProjectData.imgProject}
              setImgProject={setImgProject}
              handleSubmit={onSubmitEditProject}
              handleFileChange={handleFileChange}
              handleDrop={handleDrop}
              allstudents={allstudents}
              allclass={allclass}
              alltechnos={technos}
            />
          </div>
        </>
      )}
      <ToastContainer></ToastContainer>
    </>
  );
};
export default StudentProjectInfo;
