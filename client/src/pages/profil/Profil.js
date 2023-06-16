import { w3cwebsocket } from "websocket";

import { Icon } from "@iconify/react";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import JpoCard from "../../components/ressources/jpo/JpoCard";

import { useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import ProfilFormUpdate from "../../components/profil/ProfilFormUpdate.js";
import ProfilSkeleton from "../../components/profil/ProfilSkeleton";
import useFirebase from "../../hooks/useFirebase";
import "./Profil.scss";
import CardBlog from "../../components/blog/CardBlog";

export default function Profil() {
  const textRef = useRef(null);
  const [tabValue, setTabValue] = React.useState("1");
  const [tags, setTags] = useState([]);
  const queryParameters = new URLSearchParams(window.location.pathname);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentJpo, setRecentJpo] = useState([]);
  const radioGroupRef = React.useRef(null);
  const { user } = useFirebase();
  const { id } = useParams();
  const [userProfil, setUserProfil] = useState({});
  const [userIdeas, setUserIdeas] = useState([]);
  const fileInputRef = useRef(null);
  const notify = () =>
    toast.success("Utilisateur Discord copié.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        notify();
      })
      .catch((error) => {
        console.error("Failed to copy text:", error);
      });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpenDialog = () => {
    setAnchorEl(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };
  const handleEditBanner = () => {
    fileInputRef.current.click();
  };

  const sendData = async (pictureToUpload) => {
    const formData = new FormData();
    formData.append("image", pictureToUpload);

    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_API}/profil/background/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  const handleOnChange = async (event) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      sendData(newImage);
      setUserProfil((prevState) => ({
        ...prevState,
        imagebackground: URL.createObjectURL(newImage),
      }));
    }
  };
  const getJpo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/ressources/jpo/user/${id}`
      );
      if (response.data != undefined) {
        setRecentJpo(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:5050/blog/tag");
      const tags = response.data;
      setTags(tags);
    } catch (error) {
      console.error("Erreur lors de la récupération des tags :", error);
    }
  };
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/blog/user/${id}`);
      var filtredBlogs = filterTwoMostRecentBlogs(response.data, 2);
      var allBlogs = [];
      const dateOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      filtredBlogs.forEach((blog) => {
        const dateCreation = new Date(
          blog.created_at._seconds * 1000 +
            blog.created_at._nanoseconds / 100000
        ).toLocaleString("fr", dateOptions);
        const userLiked = blog.like.includes(user.id);
        const userDisliked = blog.dislike.includes(user.id);
        const userIsParticipant = blog.participant.includes(user.id);
        const blogFront = {
          id: blog.id,
          created_at: dateCreation,
          created_by: blog.created_by,
          editorState: blog.editorState,
          inputEditorState: blog.inputEditorState,
          participant: blog.participant,
          comment: blog.comment,
          statut: blog.statut,
          thumbnail: blog.thumbnail,
          title: blog.title,
          description: blog.description,
          updated_at: blog.updated_at,
          like: blog.like,
          dislike: blog.dislike,
          userLiked: userLiked,
          userDisliked: userDisliked,
          userIsParticipant: userIsParticipant,
          type: blog.type,
          tag: blog.tag,
          info_creator: blog.info_creator,
          visibility: blog.visibility,
        };
        allBlogs.push(blogFront);
      });
      console.log(allBlogs);
      setRecentBlogs(allBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };
  useEffect(() => {
    (async () => {
      const wsComments = new w3cwebsocket(`${process.env.REACT_APP_SERVER_API_WS}/profil`);

      wsComments.onopen = function (e) {
        wsComments.send(JSON.stringify(id));
      };

      wsComments.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setUserProfil({
          id: id,
          firstname: data.firstname,
          lastname: data.lastname,
          description: data.description,
          email: data.email,
          image: data.image,
          imagebackground: !data.imagebackground
            ? "https://picsum.photos/1920/900"
            : data.imagebackground,
          job: data.job,
          linkedin: data.linkedin,
          git: data.git,
          company: data.company,
          class: data.class,
          programmationLanguage: data.programmationLanguage
            ? data.programmationLanguage
            : [],
          discord: data.discord,
          phoneNumber: data.phone,
          status: data.status,
        });
        getJpo();
        fetchBlogs();
        fetchTags();
        setIsLoading(false);
      };
    })();
  }, [id]);

  useEffect(() => {
    const getJpo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_API}/ressources/jpo/user/${user.id}`
        );
        if (response.data != undefined) {
          setRecentJpo(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getJpo();
  }, []);

  const filterTwoMostRecentBlogs = (blogs) => {
    const sortedBlogs = blogs.sort((a, b) => {
      const timestampA = new Date(
        a.created_at.seconds * 1000 + a.created_at.nanoseconds / 1000000
      );
      const timestampB = new Date(
        b.created_at.seconds * 1000 + b.created_at.nanoseconds / 1000000
      );
      return timestampB - timestampA;
    });

    const twoMostRecentBlogs = sortedBlogs.slice(0, 2);

    return twoMostRecentBlogs;
  };

  return (
    <div>
      {isLoading ? (
        <ProfilSkeleton />
      ) : (
        <div>
          <ToastContainer />
          <Box
            className="background"
            style={{
              backgroundImage: `url(${userProfil.imagebackground})`,
            }}
          ></Box>
          <Box
            sx={{
              display: "flex",
              height: "75vh",
              marginLeft: "5%",
              marginRight: "5%",
              boxShadow: "3",
            }}
          >
            <Box
              sx={{
                width: "30%",
                backgroundColor: "#de16ca78",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ marginTop: "-30%" }}>
                  <Avatar
                    src={userProfil.image}
                    sx={{
                      width: "200px",
                      height: "200px",
                      border: "1px solid #0001",
                      boxShadow: "2",
                    }}
                  />
                  <Typography variant="h6" sx={{ textAlign: "center" }}>
                    {userProfil.firstname} {userProfil.lastname}
                  </Typography>
                  {userProfil && userProfil.status === "etudiant" && (
                    <Typography
                      sx={{ textAlign: "center", fontSize: "medium" }}
                    >
                      {userProfil.class.name}
                    </Typography>
                  )}
                  <Typography sx={{ textAlign: "center", fontSize: "medium" }}>
                    {userProfil.job && `${userProfil.job}`}
                    {userProfil.company && userProfil.job ? " Chez " : ""}
                    {userProfil.company && userProfil.company}
                  </Typography>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        marginTop: "15%",
                        textAlign: "start",
                        color: "#0007",
                        marginLeft: "-15%",
                        marginBottom: "5%",
                      }}
                    >
                      Mes langages
                    </Typography>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      {userProfil.programmationLanguage &&
                        userProfil.programmationLanguage.map((language) => (
                          <Tooltip title={language}>
                            <Icon
                              key={language}
                              icon={`logos:${language.toLowerCase()}`}
                              width={24}
                              height={24}
                              alt={language}
                            >
                              <Tooltip title={language}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <img
                                    width={24}
                                    height={24}
                                    src={
                                      "https://api.iconify.design/flat-color-icons:cancel.svg"
                                    }
                                  ></img>
                                  <span
                                    style={{
                                      fontSize: "60%",
                                      marginTop: "-35%",
                                      textAlign: "center",
                                    }}
                                  >
                                    {language}
                                  </span>
                                </div>
                              </Tooltip>
                            </Icon>
                          </Tooltip>
                        ))}
                    </div>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  marginBottom: "5%",
                }}
              >
                <img
                  style={{ width: 25, height: 25 }}
                  src="https://api.iconify.design/logos:discord-icon.svg"
                  onClick={() => handleCopy(userProfil.discord)}
                />
                <a href={userProfil.git} target="_blank">
                  <img
                    style={{ width: 25, height: 25 }}
                    src={"https://api.iconify.design/logos:github-icon.svg"}
                  />
                </a>
                <a href={userProfil.linkedin} target="_blank">
                  <img
                    style={{ width: 25, height: 25 }}
                    src={"https://api.iconify.design/logos:linkedin-icon.svg"}
                  />
                </a>
              </Box>
            </Box>

            <Box sx={{ width: "70%" }}>
              <Box
                sx={{ typography: "body1", marginTop: "2%", marginLeft: "2%" }}
              >
                <TabContext value={tabValue}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleTabChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="A propos de moi" value="1" />
                      <Tab label="Derniers Blogs" value="2" />
                      <Tab label="Dernières JPO" value="3" />
                    </TabList>
                  </Box>
                  <TabPanel value="1" sx={{ lineHeight: "2" }}>
                    {userProfil.description
                      ? userProfil.description
                      : "Aucune description"}
                  </TabPanel>
                  <TabPanel value="2">
                    {recentBlogs ? (
                      recentBlogs.map((blog, index) => (
                        <CardBlog blog={blog} key={index} tags={tags} />
                      ))
                    ) : (
                      <p>Aucune journée porte ouverte prévue</p>
                    )}
                  </TabPanel>
                  <TabPanel value="3">
                    {recentJpo ? (
                      recentJpo.map((jpo, index) => (
                        <JpoCard key={index} jpoData={jpo}></JpoCard>
                      ))
                    ) : (
                      <p>Aucune journée porte ouverte prévue</p>
                    )}
                  </TabPanel>
                </TabContext>
              </Box>
            </Box>
          </Box>

          <Box>
            {user.id == userProfil.id && (
              <IconButton
                aria-label="settings"
                onClick={handleClick}
                sx={{ position: "absolute", top: 25, right: 65 }}
              >
                <SettingsIcon />
              </IconButton>
            )}
            {user.id == userProfil.id && (
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem className="menuItem" onClick={handleOpenDialog}>
                  <EditIcon style={{ color: "orange" }} />
                  Modifier mon profil
                </MenuItem>
                <MenuItem className="menuItem" onClick={handleEditBanner}>
                  <EditIcon style={{ color: "orange" }} />
                  Modifier ma bannière
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleOnChange}
                  />
                </MenuItem>
              </Menu>
            )}
            <Dialog
              fullWidth
              maxWidth="xl"
              open={openDialog}
              sx={{
                "& .MuiDialog-paper": { width: "100%", maxHeight: "none" },
              }}
              TransitionProps={{ onEntering: handleEntering }}
            >
              <DialogContent>
                <ProfilFormUpdate
                  onClose={handleCloseDialog}
                  user={userProfil}
                />
              </DialogContent>
            </Dialog>
          </Box>
        </div>
      )}
    </div>
  );
}
