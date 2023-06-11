import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import useFirebase from "../../../hooks/useFirebase";

import { toast, ToastContainer } from "react-toastify";

import {
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  List,
  ListItem,
} from "@mui/material";

import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModule from "@mui/icons-material/ViewModule";

import CreateJpoModal from "./../../../components/ressources/jpo/CreateJpoModal";

import { makeStyles } from "@mui/styles";

import CreateIcon from "@mui/icons-material/Create";
import HistoryIcon from "@mui/icons-material/History";

import JpoCard from "./../../../components/ressources/jpo/JpoCard";
import "./Jpo.scss";
import SkeletonJpo from "../../../components/ressources/jpo/SkeletonJpo";

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
  btnCreateJpo: {
    backgroundColor: "#7a52e1",
    color: "white",
    "&:hover": {
      backgroundColor: "#7a52e1",
      fontWeight: "bold",
    },
  },
  btnHistory: {
    backgroundColor: "#e70062",
    color: "white",
    "&:hover": {
      backgroundColor: "#e70062",
      fontWeight: "bold",
    },
  },
});

const Jpo = () => {
  const classes = useStyles();
  let navigate = useNavigate();

  const { user } = useFirebase();
  const userStatus = user?.status;

  const [view, setView] = useState("module");

  const [allJpoParticipants, setAllJpoParticipants] = useState([]);
  const [allJpo, setAllJpo] = useState([]);
  const [nameJPO, setNameJPO] = useState("");
  const [JPODateStart, setJPODateStart] = useState("");
  const [JPODateEnd, setJPODateEnd] = useState("");
  const [descriptionJPO, setDescriptionJPO] = useState("");
  const [files, setFiles] = useState([]);
  const [jpoThumbnail, setJpoThumbnail] = useState("");
  const [open, setOpen] = useState(false);
  const rejectedFiles = files.filter((file) => file.errors);
  const [jpoParticipants, setJpoParticipants] = useState([]);

  const [loading, setLoading] = useState(true);

  const viewChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((files) => [...files, ...acceptedFiles]);
  }, []);

  const handleRemove = (file) => () => {
    setFiles((files) => files.filter((f) => f !== file));
  };

  const handleFileChange = (fileData) => {
    setJpoThumbnail(fileData);
  };

  const handleClickOpen = () => {
    setOpen(true);
    getAllJpoParticipants();
  };

  const handleClose = () => {
    setOpen(false);
  };

  /*
    get an Array of all jpo then put it in allJpo
  */

  const getAllJpo = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/jpo")
        .then((res) => {
          setAllJpo(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  /*
    get an Array of all jpo participants then put it in allJpoParticipants
  */

  const getAllJpoParticipants = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/jpoparticipants")
        .then((res) => {
          setAllJpoParticipants(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  /*
    Create a JPO if values in the form aren't null
    nameJPO (String)
    descriptionJPO (String)
    jpoThumbnail (String)
    JPODateStart (String)
    JPODateEnd (String)
    jpoParticipants (Object)
  */

  const publishJpo = async () => {
    if (
      nameJPO === "" ||
      descriptionJPO === "" ||
      jpoThumbnail === "" ||
      JPODateStart === "" ||
      JPODateEnd === "" ||
      !jpoParticipants
    ) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    } else {
      try {
        await axios
          .post("http://localhost:5050/ressources/jpo", {
            jpoTitle: nameJPO,
            jpoDescription: descriptionJPO,
            jpoThumbnail: jpoThumbnail,
            jpoDayStart: JPODateStart,
            jpoDayEnd: JPODateEnd,
            jpoParticipants: jpoParticipants,
          })
          .then((res) => {
            if (
              res.status === 200 &&
              res.data.message === "JPO créée avec succès."
            ) {
              toastSuccess(
                `La JPO ${nameJPO} que vous avez créer a été publié avec succès !`
              );
            }
          })
          .catch((err) => {
            toastFail("Erreur lors de la création de la JPO");
            console.log(err);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (event) => {
    await publishJpo();
    event.preventDefault();
    if (
      nameJPO === "" ||
      descriptionJPO === "" ||
      jpoThumbnail === "" ||
      JPODateStart === "" ||
      JPODateEnd === "" ||
      !jpoParticipants
    ) {
    } else {
      setOpen(false);
      getAllJpo();
    }
  };

  useEffect(() => {
    getAllJpo()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
        <>
          <SkeletonJpo classes={classes} />
        </>
      ) : (
        <div className="jpo-page">
          <div className="header-jpo">
            <Box
              sx={{
                width: "20%",
                display: "flex",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={viewChange}
                  sx={{ margin: 1 }}
                >
                  <ToggleButton value="module" aria-label="module">
                    <ViewModule />
                  </ToggleButton>
                  <ToggleButton value="list" aria-label="list">
                    <ViewListIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              Jpo
            </Typography>
            {userStatus === "pedago" ? (
              <div>
                <Button
                  variant="contained"
                  className={classes.btnCreateJpo}
                  onClick={handleClickOpen}
                  disableElevation
                >
                  Créer une JPO <CreateIcon />
                </Button>
                <CreateJpoModal
                  open={open}
                  handleClose={handleClose}
                  handleSubmit={handleSubmit}
                  nameJPO={nameJPO}
                  setNameJPO={setNameJPO}
                  JPODateStart={JPODateStart}
                  setJPODateStart={setJPODateStart}
                  JPODateEnd={JPODateEnd}
                  setJPODateEnd={setJPODateEnd}
                  descriptionJPO={descriptionJPO}
                  setDescriptionJPO={setDescriptionJPO}
                  handleDrop={handleDrop}
                  handleFileChange={handleFileChange}
                  rejectedFiles={rejectedFiles}
                  handleRemove={handleRemove}
                  btnCreateJpo={classes.btnCreateJpo}
                  allJpoParticipants={allJpoParticipants}
                  jpoParticipants={jpoParticipants}
                  setJpoParticipants={setJpoParticipants}
                />
              </div>
            ) : (
              <div></div>
            )}
          </div>

          <div className="jpo-list-container">
            {userStatus === "pedago" ? (
              <div className="btn-history-container">
                <Button
                  variant="contained"
                  disableElevation
                  className={classes.btnHistory}
                  onClick={() => {
                    navigate(`/jpo/history`);
                  }}
                >
                  Historique <HistoryIcon />
                </Button>
              </div>
            ) : (
              <div></div>
            )}
            {view === "module" ? (
              <Grid container spacing={2}>
                {allJpo.map((jpoData, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <JpoCard jpoData={jpoData} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <List>
                {allJpo.map((jpoData, index) => (
                  <ListItem key={index}>
                    <JpoCard jpoData={jpoData} />
                  </ListItem>
                ))}
              </List>
            )}
          </div>
        </div>
      )}
      <ToastContainer></ToastContainer>
    </>
  );
};

export default Jpo;
