import React, {useEffect, useState, useRef} from "react";
import {w3cwebsocket} from "websocket";
import axios from "axios";
import "./Profil.scss";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import {format} from "date-fns";
import {
  Avatar,
  Box,
  Typography,
  MenuItem,
  Menu,
  Dialog,
  DialogContent,
} from "@mui/material";

import ProfilFormUpdate from "../../components/profil/ProfilFormUpdate.js";
import ProfilSkeleton from "../../components/profil/ProfilSkeleton";
import useFirebase from "../../hooks/useFirebase";
export default function Profil() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const radioGroupRef = React.useRef(null);
  const {user} = useFirebase();
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
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_API}/profil/background/${userProfil.id}`,
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

  useEffect(() => {
    (async () => {
      const wsComments = new w3cwebsocket(
        `${process.env.REACT_APP_SERVER_API_WS}/profil`
      );

      wsComments.onopen = function (e) {
        wsComments.send(JSON.stringify(user?.id));
      };

      wsComments.onmessage = (message) => {
        console.log(message.data);
        const data = JSON.parse(message.data);
        var userInfo = data;
        const date = new Date(
          userInfo.dateofbirth._seconds * 1000 +
            userInfo.dateofbirth._nanoseconds / 1000000
        );
        const formattedDate = format(date, "yyyy-MM-dd");

        console.log("dddd");

        setUserProfil({
          id: user?.id,
          firstname: data.firstname,
          lastname: data.lastname,
          description: data.description,
          email: data.email,
          image: data.image,
          imagebackground: !data.imagebackground
            ? "https://picsum.photos/600"
            : data.imagebackground,
          dateBirthday: formattedDate,
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

        setIsLoading(true);
        console.log("Loading");
      };
    })();
  }, [user?.id]);
  return (
    <>
      {isLoading ? (
        <div style={{margin: "2%"}}>
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
            <IconButton
              aria-label="settings"
              onClick={handleClick}
              sx={{position: "absolute", top: 25, right: 25}}
            >
              <SettingsIcon />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem className="menuItem" onClick={handleOpenDialog}>
                <EditIcon style={{color: "orange"}} />
                Modifier mon profil
              </MenuItem>
              <MenuItem className="menuItem" onClick={handleEditBanner}>
                <EditIcon style={{color: "orange"}} />
                Modifier ma bannière
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{display: "none"}}
                  onChange={handleOnChange}
                />
              </MenuItem>
            </Menu>
            <Dialog
              fullWidth
              maxWidth="xl"
              open={openDialog}
              sx={{
                "& .MuiDialog-paper": {width: "100%", maxHeight: "none"},
              }}
              TransitionProps={{onEntering: handleEntering}}
            >
              <DialogContent>
                <ProfilFormUpdate
                  onClose={handleCloseDialog}
                  user={userProfil}
                />
              </DialogContent>
            </Dialog>

            <Avatar
              src={userProfil.image}
              sx={{width: "150px", height: "150px", border: "3px solid #fff"}}
            />
            <Typography variant="h4">
              {userProfil.firstname} {userProfil.lastname}
            </Typography>
            <Typography variant="h6">
              {userProfil.job} chez {userProfil.company}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "start",
              margin: "1%",
            }}
          >
            <Typography variant="h4">Informations</Typography>
          </Box>
          <Box className="itemBox">
            {userProfil && userProfil.status === "etudiant" && (
              <Typography variant="h6">Classe :{userProfil.class}</Typography>
            )}
            <Typography variant="h6">Email : {userProfil.email}</Typography>
            <Typography variant="h6">
              Téléphone : {userProfil.phoneNumber}
            </Typography>
            <Typography variant="h6">
              Langages de programmation :{" "}
              {userProfil.programmationLanguage.map(
                (language) => `${language}, `
              )}
            </Typography>
            <Typography variant="h6">Discord : {userProfil.discord}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "start",
              margin: "1%",
            }}
          >
            <Typography variant="h4">Description</Typography>
          </Box>
          <Box className="itemBox">
            <Typography variant="h6">{userProfil.description}</Typography>
          </Box>
          {userProfil && userProfil.linkedin && userProfil.git && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "start",
                  margin: "1%",
                }}
              >
                <Typography variant="h4">Liens Utiles</Typography>
              </Box>
              <Box className="linkBox">
                {userProfil && userProfil.git && (
                  <IconButton
                    aria-label="github"
                    href={userProfil.git}
                    target="_blank"
                    rel="noopener"
                  >
                    <GitHubIcon />
                  </IconButton>
                )}
                {userProfil && userProfil.linkedin && (
                  <IconButton
                    aria-label="linkendIn"
                    href={userProfil.linkedin}
                    target="_blank"
                    rel="noopener"
                  >
                    <LinkedInIcon />
                  </IconButton>
                )}
              </Box>
            </>
          )}
        </div>
      ) : (
        <ProfilSkeleton />
      )}
    </>
  );
}
