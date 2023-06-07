import { w3cwebsocket } from "websocket";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";
import { Avatar, Box, Typography, MenuItem, Menu, Dialog, DialogContent } from "@mui/material";
import JpoCard from "../ressources/jpo/JpoCard";

import ProfilFormUpdate from "../../components/profil/ProfilFormUpdate.js";
import ProfilSkeleton from "../../components/profil/ProfilSkeleton";
import useFirebase from "../../hooks/useFirebase";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import "./Profil.scss";

export default function Profil() {
  const queryParameters = new URLSearchParams(window.location.pathname);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentBlogs, SetRecentBlogs] = useState([]);
  const [recentJpo, setRecentJpo] = useState([]);
  const radioGroupRef = React.useRef(null);
  const { user } = useFirebase();
  const { id } = useParams();
  const [userProfil, setUserProfil] = useState({});
  const fileInputRef = useRef(null);

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
      const response = await axios.put(`http://localhost:5050/profil/background/${userProfil.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

  useEffect(() => {
    (async () => {
      const wsComments = new w3cwebsocket(`ws://localhost:5050/profil`);

      wsComments.onopen = function (e) {
        wsComments.send(JSON.stringify(id));
      };

      wsComments.onmessage = (message) => {
        console.log(message.data);
        const data = JSON.parse(message.data);
        var userInfo = data;
        const date = new Date(userInfo.dateofbirth._seconds * 1000 + userInfo.dateofbirth._nanoseconds / 1000000);
        const formattedDate = format(date, "yyyy-MM-dd");

        setUserProfil({
          id: id,
          firstname: data.firstname,
          lastname: data.lastname,
          description: data.description,
          email: data.email,
          image: data.image,
          imagebackground: !data.imagebackground ? "https://picsum.photos/600" : data.imagebackground,
          dateBirthday: formattedDate,
          job: data.job,
          linkedin: data.linkedin,
          git: data.git,
          company: data.company,
          class: data.class,
          programmationLanguage: data.programmationLanguage ? data.programmationLanguage : [],
          discord: data.discord,
          phoneNumber: data.phone,
          status: data.status,
        });
        setIsLoading(true);
      };
    })();
  }, [id]);

  useEffect(() => {
    const getJpo = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/ressources/jpo/user/${user.id}`);
        if (response.data != undefined) {
          setRecentJpo(response.data);
          console.log(response.data.length);
          // setRecentJpo(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getJpo();
  }, []);

  const filterTwoMostRecentBlogs = (blogs) => {
    const sortedBlogs = blogs.sort((a, b) => {
      const timestampA = new Date(a.created_at.seconds * 1000 + a.created_at.nanoseconds / 1000000);
      const timestampB = new Date(b.created_at.seconds * 1000 + b.created_at.nanoseconds / 1000000);
      return timestampB - timestampA;
    });

    const twoMostRecentBlogs = sortedBlogs.slice(0, 2);

    return twoMostRecentBlogs;
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5050/blog/user/ilan.petiot@edu.esiee-it.fr");
        var filtredBlogs = filterTwoMostRecentBlogs(response.data, 2);
        SetRecentBlogs(filtredBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div style={{ margin: "2%" }}>
          <Box
            className="profilBox"
            style={{
              backgroundImage: `linear-gradient(
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.5)
      ),
      url(${userProfil.imagebackground})`,
            }}
          >
            {user.id == userProfil.id && (
              <IconButton aria-label="settings" onClick={handleClick} sx={{ position: "absolute", top: 25, right: 25 }}>
                <SettingsIcon />
              </IconButton>
            )}
            {user.id == userProfil.id && (
              <Menu id="profile-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem className="menuItem" onClick={handleOpenDialog}>
                  <EditIcon style={{ color: "orange" }} />
                  Modifier mon profil
                </MenuItem>
                <MenuItem className="menuItem" onClick={handleEditBanner}>
                  <EditIcon style={{ color: "orange" }} />
                  Modifier ma bannière
                  <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleOnChange} />
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
                <ProfilFormUpdate onClose={handleCloseDialog} user={userProfil} />
              </DialogContent>
            </Dialog>
            <Avatar src={userProfil.image} sx={{ width: "150px", height: "150px", border: "3px solid #fff" }} />
            <Typography variant="h4">
              {userProfil.firstname} {userProfil.lastname}
            </Typography>
            {userProfil && userProfil.status === "etudiant" && <Typography>Classe : {userProfil.class}</Typography>}
            <Typography>{userProfil.job && `${userProfil.job} chez ${userProfil.company}`}</Typography>
          </Box>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2%",
            }}
          >
            <div>
              <div>
                {recentJpo.length >= 1 &&
                  recentJpo.map((jpo) => {
                    console.log(jpo);
                    return <JpoCard key={jpo.id} jpoData={jpo} />;
                  })}
              </div>
            </div>
            <div
              style={{
                width: "30%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "inherit",
                fontSize: "x-large",
              }}
            >
              <div style={{ height: "40%", marginBottom: "10%" }}>
                {userProfil.description && (
                  <div>
                    <Box>
                      <Typography variant="h4">About Me</Typography>
                    </Box>
                    <Box className="itemBox">
                      <Typography>{userProfil.description}</Typography>
                    </Box>
                  </div>
                )}
                <Box>
                  <Typography variant="h4">Informations</Typography>
                </Box>
                <Box className="itemBox">
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="0.99em"
                      style={{ height: "auto", marginRight: "5%" }}
                      viewBox="0 0 256 261"
                    >
                      <path
                        fill="#F06B66"
                        d="M126.143.048C197.685.048 256 58.363 256 130.025a42.083 42.083 0 0 1-63.967 35.71l-.6-.36l-.241.601c-18.108 32.825-57.803 47.059-92.643 33.22c-34.84-13.837-53.951-51.428-44.602-87.731c9.349-36.304 44.24-59.988 81.43-55.276c37.19 4.711 65.073 36.348 65.073 73.836a13.707 13.707 0 0 0 27.294 0c0-56.132-45.469-101.655-101.601-101.721c-47.083-.085-88.07 32.152-99.083 77.93c-11.012 45.776 10.83 93.128 52.8 114.466c41.97 21.338 93.098 11.085 123.596-24.784l21.643 18.276a129.496 129.496 0 0 1-98.956 45.93C55.864 257.986 0 200.397 0 130.086S55.864 2.185 126.143.048Zm0 83.926a46.171 46.171 0 1 0 .12 92.223c24.551-1.286 43.789-21.584 43.757-46.169c-.032-24.584-19.323-44.832-43.877-46.054Zm0 27.414c10.293 0 18.637 8.344 18.637 18.637c0 10.293-8.344 18.637-18.637 18.637c-10.293 0-18.637-8.344-18.637-18.637c0-10.293 8.344-18.637 18.637-18.637Z"
                      ></path>
                    </svg>
                    <Typography>{userProfil.email}</Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      viewBox="0 0 48 48"
                      style={{ height: "auto", marginRight: "5%" }}
                    >
                      <path
                        fill="#2F88FF"
                        stroke="#000"
                        strokeLinejoin="round"
                        strokeWidth="4"
                        d="M16.9964 7.68584C17.7229 7.68584 18.3923 8.07986 18.745 8.7151L21.1914 13.1219C21.5117 13.6989 21.5268 14.3968 21.2316 14.9871L18.8748 19.7008C18.8748 19.7008 19.5578 23.2122 22.4162 26.0706C25.2747 28.929 28.7743 29.6002 28.7743 29.6002L33.4872 27.2438C34.0779 26.9484 34.7763 26.9637 35.3535 27.2846L39.7728 29.7416C40.4075 30.0945 40.801 30.7635 40.801 31.4896V36.5631C40.801 39.1468 38.4011 41.0129 35.9531 40.1868C30.9251 38.4903 23.1204 35.2601 18.1736 30.3132C13.2268 25.3664 9.99649 17.5617 8.29995 12.5338C7.47393 10.0857 9.34002 7.68584 11.9237 7.68584H16.9964Z"
                      ></path>
                    </svg>
                    <Typography>{userProfil.phoneNumber ? userProfil.phoneNumber : "Non renseigné"}</Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.29em"
                      style={{ height: "auto", marginRight: "5%" }}
                      viewBox="0 0 256 199"
                    >
                      <path
                        fill="#5865F2"
                        d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046c-19.692-2.961-39.203-2.961-58.533 0c-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632a108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237a136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848c21.142-6.58 42.646-16.637 64.815-33.213c5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2c.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2c0 14.375-10.148 26.18-23.015 26.18Z"
                      ></path>
                    </svg>{" "}
                    <Typography>{userProfil.discord ? userProfil.discord : "Non renseigné"}</Typography>
                  </div>
                  <div>
                    <Typography>Langages de programmation : </Typography>
                    <div
                      style={{
                        lineHeight: "0",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {userProfil.programmationLanguage.map((language) => (
                        <div
                          key={language}
                          style={{
                            marginRight: "5%",
                            display: "flex",
                          }}
                        >
                          <img
                            src={`https://api.iconify.design/logos:${language.toLowerCase()}.svg`}
                            style={{ marginRight: "10%" }}
                            alt=""
                          />
                          <Typography>{language}</Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                </Box>
              </div>
              <div>
                <Typography variant="h4">Liens Utiles</Typography>
                <Box className="itemBox">
                  <div style={{ display: "flex" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="4em"
                      viewBox="0 0 512 128"
                      style={{ height: "auto" }}
                    >
                      <path
                        fill="#0A66C2"
                        d="m202.057 74.971l28.252 34.743H208l-25.143-31.908v31.908h-18.286V18.286h18.286v53.76l23.223-26.332h23.314l-27.337 29.257Zm-73.143-31.085a24.777 24.777 0 0 0-20.205 10.971v-9.143h-17.28v64h18.285V79.817a15.909 15.909 0 0 1 15.177-17.646c10.606 0 12.252 10.423 12.252 17.646v29.897h18.286v-33.92c0-20.114-6.675-31.908-26.149-31.908h-.366Zm163.657 35.291c.07 1.34.07 2.683 0 4.023h-48v.64a16.366 16.366 0 0 0 16.732 13.074a22.949 22.949 0 0 0 16.823-6.308l12.16 9.143a39.406 39.406 0 0 1-29.715 11.794a31.909 31.909 0 0 1-33.828-34.286a32.731 32.731 0 0 1 34.377-33.371c17.189 0 31.451 12.16 31.451 35.291Zm-17.005-7.863a13.349 13.349 0 0 0-14.537-12.8c-8.04-.869-15.321 4.794-16.458 12.8h30.995ZM18.286 18.286H0v91.428h54.857V91.43H18.286V18.286Zm329.143 0h18.285v91.428h-17.28v-6.4a22.309 22.309 0 0 1-18.285 8.229a31.177 31.177 0 0 1-30.263-33.829a30.72 30.72 0 0 1 30.171-33.828a23.954 23.954 0 0 1 17.372 6.4v-32Zm1.371 59.428A14.903 14.903 0 0 0 333.989 60.8c-8.747.635-15.375 8.157-14.903 16.914c-.472 8.757 6.156 16.28 14.903 16.915A14.903 14.903 0 0 0 348.8 77.714ZM73.143 16.457A11.611 11.611 0 0 0 61.714 27.43c0 6.311 5.117 11.428 11.429 11.428S84.57 33.74 84.57 27.43a11.611 11.611 0 0 0-11.428-10.972ZM64 109.714h18.286v-64H64v64ZM512 9.143v109.714a9.143 9.143 0 0 1-9.143 9.143H393.143a9.143 9.143 0 0 1-9.143-9.143V9.143A9.143 9.143 0 0 1 393.143 0h109.714A9.143 9.143 0 0 1 512 9.143Zm-91.429 36.571h-18.285v64h18.285v-64Zm2.286-18.285c0-6.312-5.117-11.429-11.428-11.429C405.117 16 400 21.117 400 27.429c0 6.311 5.117 11.428 11.429 11.428c6.311 0 11.428-5.117 11.428-11.428Zm70.857 48.365c0-20.114-6.674-31.908-26.148-31.908a24.777 24.777 0 0 0-20.572 10.971v-9.143h-17.28v64H448V79.817a15.909 15.909 0 0 1 15.177-17.646c10.606 0 12.252 10.423 12.252 17.646v29.897h18.285v-33.92Z"
                      ></path>
                    </svg>
                    {userProfil.linkedin ? (
                      <a href={userProfil.linkedin} target="_blank" style={{ marginLeft: "5%" }} rel="noreferrer">
                        {userProfil.linkedin.split("/in/").pop().split("-")[0].replace("/", "")}
                      </a>
                    ) : (
                      <Typography style={{ marginLeft: "5%" }}>Non renseigné</Typography>
                    )}
                  </div>
                  <div style={{ display: "flex" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="3.69em"
                      viewBox="0 0 512 139"
                      style={{ height: "auto" }}
                    >
                      <path
                        fill="#11110F"
                        d="M98.696 59.312h-43.06a2.015 2.015 0 0 0-2.013 2.014v21.053c0 1.111.902 2.015 2.012 2.015h16.799v26.157s-3.772 1.286-14.2 1.286c-12.303 0-29.49-4.496-29.49-42.288c0-37.8 17.897-42.773 34.698-42.773c14.543 0 20.809 2.56 24.795 3.794c1.253.384 2.412-.863 2.412-1.975l4.803-20.342c0-.52-.176-1.146-.769-1.571C93.064 5.527 83.187 0 58.233 0C29.488 0 0 12.23 0 71.023c0 58.795 33.76 67.556 62.21 67.556c23.555 0 37.844-10.066 37.844-10.066c.59-.325.653-1.148.653-1.526V61.326c0-1.11-.9-2.014-2.01-2.014Zm221.8-51.953c0-1.12-.888-2.024-1.999-2.024h-24.246a2.016 2.016 0 0 0-2.008 2.024l.006 46.856h-37.792V7.36c0-1.12-.892-2.024-2.001-2.024H228.21a2.014 2.014 0 0 0-2.003 2.024v126.872c0 1.12.9 2.03 2.003 2.03h24.245c1.109 0 2-.91 2-2.03V79.964h37.793l-.066 54.267c0 1.12.9 2.03 2.008 2.03h24.304c1.11 0 1.998-.91 2-2.03V7.36ZM144.37 24.322c0-8.73-7-15.786-15.635-15.786c-8.627 0-15.632 7.055-15.632 15.786c0 8.72 7.005 15.795 15.632 15.795c8.635 0 15.635-7.075 15.635-15.795Zm-1.924 83.212V48.97a2.015 2.015 0 0 0-2.006-2.021h-24.169c-1.109 0-2.1 1.144-2.1 2.256v83.905c0 2.466 1.536 3.199 3.525 3.199h21.775c2.39 0 2.975-1.173 2.975-3.239v-25.536ZM413.162 46.95h-24.06c-1.104 0-2.002.909-2.002 2.028v62.21s-6.112 4.472-14.788 4.472c-8.675 0-10.977-3.937-10.977-12.431v-54.25c0-1.12-.897-2.03-2.001-2.03h-24.419c-1.102 0-2.005.91-2.005 2.03v58.358c0 25.23 14.063 31.403 33.408 31.403c15.87 0 28.665-8.767 28.665-8.767s.61 4.62.885 5.168c.276.547.994 1.098 1.77 1.098l15.535-.068c1.102 0 2.005-.911 2.005-2.025l-.008-85.168a2.02 2.02 0 0 0-2.008-2.028Zm55.435 68.758c-8.345-.254-14.006-4.041-14.006-4.041V71.488s5.585-3.423 12.436-4.035c8.664-.776 17.013 1.841 17.013 22.51c0 21.795-3.768 26.096-15.443 25.744Zm9.49-71.483c-13.665 0-22.96 6.097-22.96 6.097V7.359a2.01 2.01 0 0 0-2-2.024h-24.315a2.013 2.013 0 0 0-2.004 2.024v126.872c0 1.12.898 2.03 2.007 2.03h16.87c.76 0 1.335-.39 1.76-1.077c.419-.682 1.024-5.85 1.024-5.85s9.942 9.422 28.763 9.422c22.096 0 34.768-11.208 34.768-50.315s-20.238-44.217-33.913-44.217ZM212.229 46.73h-18.187l-.028-24.027c0-.909-.468-1.364-1.52-1.364H167.71c-.964 0-1.481.424-1.481 1.35v24.83s-12.42 2.998-13.26 3.24a2.013 2.013 0 0 0-1.452 1.934v15.603c0 1.122.896 2.027 2.005 2.027h12.707v37.536c0 27.88 19.556 30.619 32.753 30.619c6.03 0 13.243-1.937 14.434-2.376c.72-.265 1.138-1.01 1.138-1.82l.02-17.164c0-1.119-.945-2.025-2.01-2.025c-1.06 0-3.77.431-6.562.431c-8.933 0-11.96-4.154-11.96-9.53l-.001-35.67h18.188a2.014 2.014 0 0 0 2.006-2.028V48.753c0-1.12-.897-2.022-2.006-2.022Z"
                      ></path>
                    </svg>
                    {userProfil.git ? (
                      <a href={userProfil.git} target="_blank" style={{ marginLeft: "5%" }} rel="noreferrer">
                        {userProfil.git.split("/").pop()}
                      </a>
                    ) : (
                      <Typography style={{ marginLeft: "5%" }}>Non renseigné</Typography>
                    )}
                  </div>
                </Box>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ProfilSkeleton />
      )}
    </div>
  );
}
