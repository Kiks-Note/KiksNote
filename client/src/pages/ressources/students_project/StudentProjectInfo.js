import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import useFirebase from "../../../hooks/useFirebase";

import {
  Typography,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  List,
  ListItem,
  Collapse,
  Chip,
  Skeleton,
} from "@mui/material";

import BackHandRoundedIcon from "@mui/icons-material/BackHandRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import MediationRoundedIcon from "@mui/icons-material/MediationRounded";
import ConstructionIcon from "@mui/icons-material/Construction";
import AddLinkIcon from "@mui/icons-material/AddLink";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SchoolIcon from "@mui/icons-material/School";

import GitHubLogo from "../../../assets/logo/GitHub-Logo.png";
import NoVotesImg from "../../../assets/img/votes-students-projects.svg";

import BlogTutosLinkDialog from "./BlogTutosLinkDialog";
import "./StudentsProjectsInfo.scss";

const StudentProjectInfo = () => {
  const { user } = useFirebase();

  const { projectid } = useParams();

  const [allblogtutos, setAllBlogTutos] = useState([]);
  const [blogTutoData, setBlogTutoData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedProjectData, setSelectedProjectData] = useState("");
  const [openVoters, setOpenVoters] = useState(false);
  const [openBlogTutos, setOpenBlogTutos] = useState(false);

  const [hasAddedBlog, setHasAddedBlog] = useState(false);

  const handleClickVoters = () => {
    setOpenVoters(!openVoters);
  };

  const getBlogTutorials = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/blogstutos")
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
  const getBlogTutoById = async (blogTutoId) => {
    try {
      const response = await axios.get(
        `http://localhost:5050/ressources/blogstutos/${blogTutoId}`
      );
      setBlogTutoData(response.data);
      setHasAddedBlog(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getStudentProjectById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/ressources/studentsprojects/${projectid}`
      );
      setSelectedProjectData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStudentProjectById()
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

  return (
    <>
      {loading ? (
        <>
          <div className="project-content">
            <div className="left-side-project">
              <div className="type-project-info-container">
                <Typography sx={{ marginRight: "5px" }}>
                  Type du projet :
                </Typography>
                <Skeleton width={100} />
              </div>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: "15px 0px",
                }}
              >
                Github : <Skeleton width={50} />
              </Typography>
              <Chip
                sx={{
                  display: "flex",
                  width: "fit-content",
                  padding: "10px",
                  margin: "15px 0px",
                  alignItems: "center",
                }}
                label={
                  <>
                    <div style={{ display: "flex" }}>
                      <Typography>
                        <Skeleton width={50} />
                      </Typography>
                    </div>
                  </>
                }
              ></Chip>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  border: "10px grey",
                  borderRadius: "20px",
                  padding: "10px",
                  margin: "15px 0px",
                }}
              >
                <Typography>
                  <Skeleton width={150} />
                </Typography>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Skeleton width={100} />}
                    secondary={
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        <Skeleton width={50} />
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Skeleton width={100} />}
                    secondary={
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        <Skeleton width={50} />
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Skeleton width={100} />}
                    secondary={
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        <Skeleton width={50} />
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  border: "10px grey",
                  borderRadius: "20px",
                  padding: "10px",
                  margin: "15px 0px",
                }}
              >
                <Typography>
                  <Skeleton width={100} />
                </Typography>
                <ListItem
                  button
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <Skeleton variant="rectangular" width={250} height={150} />
                  <ListItemText primary={<Skeleton width={200} />} />
                </ListItem>
              </List>
              <div className="btn-link-blog-container">
                <div></div>
              </div>
              <div className="list-counter-ref">
                <div className="counter-container">
                  <Skeleton width={100} />
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
                  <div className="no-votes-student-projects-container">
                    <p className="no-votes-student-projects-p">
                      Personne n'a encore mis en avant votre projet
                    </p>
                    <Skeleton variant="rectangular" width={200} height={150} />
                  </div>
                </div>
              </div>
            </div>
            <div className="right-side-project">
              <div className="img-project-box">
                <Skeleton variant="rectangular" width={400} height={300} />
              </div>
              <div className="text-project-box">
                <Typography sx={{ textAlign: "justify" }}>
                  <Skeleton count={6} />
                </Typography>
                <Typography sx={{ paddingTop: "20px", textAlign: "right" }}>
                  Publié par : <Skeleton width={50} />
                </Typography>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="project-content">
            <div className="left-side-project">
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
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: "15px 0px",
                }}
              >
                Github :{" "}
                <a
                  href={selectedProjectData.RepoProjectLink}
                  style={{ color: "#7a52e1", textDecoration: "underline" }}
                >
                  <img
                    className="github-logo"
                    src={GitHubLogo}
                    alt="repo-github-link-logo"
                  />
                </a>
              </Typography>
              <Chip
                sx={{
                  display: "flex",
                  width: "fit-content",
                  padding: "10px",
                  margin: "15px 0px",
                  alignItems: "center",
                }}
                label={
                  <>
                    <div style={{ display: "flex" }}>
                      <Typography>
                        {selectedProjectData &&
                          selectedProjectData.promoProject &&
                          selectedProjectData.promoProject.name}
                      </Typography>
                      <SchoolIcon />
                    </div>
                  </>
                }
              ></Chip>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
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
                {selectedProjectData &&
                  selectedProjectData.membersProject &&
                  selectedProjectData.membersProject.map((member, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar alt={member.firstname} src={member.image} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            member.lastname.toUpperCase() +
                            " " +
                            member.firstname
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
                      </ListItem>
                      {index !==
                        selectedProjectData.membersProject.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
              </List>
              {blogTutoData &&
                blogTutoData.data &&
                blogTutoData.data.thumbnail && (
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                      border: "10px grey",
                      borderRadius: "20px",
                      padding: "10px",
                      margin: "15px 0px",
                    }}
                  >
                    <Typography>Blog Tuto relié</Typography>
                    <ListItem
                      key={blogTutoData.id}
                      button
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      {blogTutoData.data.thumbnail && (
                        <img
                          className="blog-tuto-linked-img"
                          src={blogTutoData.data.thumbnail}
                          alt="blog-tuto-img-linked"
                        />
                      )}
                      <ListItemText primary={blogTutoData.data.title} />
                    </ListItem>
                  </List>
                )}

              <div className="btn-link-blog-container">
                {selectedProjectData &&
                selectedProjectData.creatorProject &&
                selectedProjectData.creatorProject.id === user?.id ? (
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
                  {selectedProjectData &&
                  selectedProjectData.voters &&
                  selectedProjectData.voters.length > 0 ? (
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
                <Typography sx={{ textAlign: "justify" }}>
                  {selectedProjectData.descriptionProject}
                </Typography>
                <Typography sx={{ paddingTop: "20px", textAlign: "right" }}>
                  Publié par :{" "}
                  {selectedProjectData &&
                    selectedProjectData.creatorProject &&
                    selectedProjectData.creatorProject.lastname.toUpperCase()}{" "}
                  {selectedProjectData &&
                    selectedProjectData.creatorProject &&
                    selectedProjectData.creatorProject.firstname}
                </Typography>
              </div>
            </div>
            <BlogTutosLinkDialog
              open={openBlogTutos}
              close={handleCloseBlogTutos}
              allblogtutos={allblogtutos}
              getStudentProjectById={getStudentProjectById}
            />
          </div>
        </>
      )}
    </>
  );
};
export default StudentProjectInfo;
