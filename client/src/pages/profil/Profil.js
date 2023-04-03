import "./Profil.scss";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Typography,
  MenuItem,
  Menu,
  Dialog,
  DialogContent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { w3cwebsocket } from "websocket";
import ProfilFormStudent from "../../components/profil/ProfilFormStudent";
export default function Profil() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const radioGroupRef = React.useRef(null);
  const userUid = localStorage.getItem("userUid");
  const [user, setUser] = useState({
    id: userUid,
    firstname: "Elim",
    lastname: "Florvil",
    email: "elim.florvil@gmail.com",
    description:
      "Etudiant à la Coding Factory by ESIEE-IT en deuxième année.  Je suis à la recherche de projet ambitieux et novateur.  Je suis ouvert à toutes propositions professionnelles.",
    imagebackground: "https://picsum.photos/600",
    imageprofil:
      "https://i1.sndcdn.com/avatars-uAS5qjJd6nY3YemT-9a48ew-t500x500.jpg",
    dateBirthday: "1990-01-01",
    job: "Développeur fullstack",
    linkedin: "https://www.linkedin.com/in/johndoe/",
    git: "https://github.com/elimf",
    company: "coopere",
    class: "L2-cergy",
    programmationLanguage: "JavaScript, Python",
    discord: "HunchoTeach 🥷🏾#3340",
    phoneNumber: "0987656789",
  });
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

  // useEffect(() => {
  //   (async () => {
  //     const wsComments = new w3cwebsocket(`ws://localhost:5050/profil`);

  //     wsComments.onopen = function (e) {
  //       console.log("[open] Connection established");
  //       console.log("Sending to server");
  //       console.log("uid", userUid);
  //       wsComments.send(JSON.stringify(userUid));
  //     };

  //     wsComments.onmessage = (message) => {
  //       const data = JSON.parse(message.data);
  //       var userInfo = data;
  //       console.log(data);
  //       const birth = new Date(
  //         userInfo.dateofbirth._seconds * 1000 +
  //           userInfo.dateofbirth._nanoseconds / 1000000
  //       ).toLocaleDateString("fr");
  //       // setUser({
  //       //   id: userUid,
  //       //   firstname: data.firstname,
  //       //   lastname: data.lastname,
  //       //   email: data.email,
  //       //   description: data.description,
  //       //   imageprofil: "https://via.placeholder.com/150",
  //       //   dateBirthday: "1990-01-01",
  //       //   job: data.job,
  //       //   linkedin: "https://www.linkedin.com/in/johndoe/",
  //       //   git: data.git,
  //       //   company: data.company,
  //       //   class: data.class,
  //       //   programmationLanguage: "JavaScript, Python",
  //       //   discord: data.discord,
  //       //   phoneNumber: data.phone,
  //       // });

  //       setIsLoading(false);
  //     };
  //   })();
  // }, []);

  return (
    <>
      <Box
        className="profilBox"
        style={{ backgroundImage: `url(${user.imagebackground})` }}
      >
        <IconButton
          aria-label="settings"
          onClick={handleClick}
          sx={{ position: "absolute", top: 25, right: 25 }}
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
            <EditIcon style={{ color: "orange" }} />
            Modifier mon profil
          </MenuItem>
        </Menu>
        <Dialog
          sx={{ "& .MuiDialog-paper": { width: "100vh", maxWidth: "900px" } }}
          open={openDialog}
          TransitionProps={{ onEntering: handleEntering }}
        >
          <DialogContent>
            <ProfilFormStudent onClose={handleCloseDialog} user={user} />
          </DialogContent>
        </Dialog>
        <Avatar src={user.imageprofil} sx={{ width: "20vh", height: "20vh" }} />
        <Typography variant="h5">
          {user.firstname} {user.lastname}
        </Typography>
        <Typography variant="h5">
          {user.job} chez {user.company}
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
        <Typography variant="h6">Classe :{user.class}</Typography>
        <Typography variant="h6">Email : {user.email}</Typography>
        <Typography variant="h6">Téléphone : {user.phoneNumber}</Typography>
        <Typography variant="h6">
          Language de programmation : {user.programmationLanguage}
        </Typography>
        <Typography variant="h6">Discord : {user.discord}</Typography>
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
        <Typography variant="h6">{user.description}</Typography>
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
        <Typography variant="h4">Liens Utiles</Typography>
      </Box>
      <Box className="linkBox">
        <IconButton
          aria-label="github"
          href={user.git}
          target="_blank"
          rel="noopener"
        >
          <GitHubIcon />
        </IconButton>
        <IconButton
          aria-label="linkendIn"
          href={user.linkedin}
          target="_blank"
          rel="noopener"
        >
          <LinkedInIcon />
        </IconButton>
      </Box>
    </>
  );
}
