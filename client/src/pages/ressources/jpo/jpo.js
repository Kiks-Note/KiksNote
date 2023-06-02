import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import useFirebase from "../../../hooks/useFirebase";

import PdfViewer from "./PdfViewer";

import moment from "moment";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  CardMedia,
  Grid,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CreateIcon from "@mui/icons-material/Create";
import HistoryIcon from "@mui/icons-material/History";

import Dropzone from "../Cours/Dropzone";

import "./Jpo.scss";

const useStyles = makeStyles({
  button: {
    "&:hover": {
      backgroundColor: "#e70062",
    },
  },
});

const Jpo = () => {
  const classes = useStyles();
  let navigate = useNavigate();

  const { user } = useFirebase();
  const userStatus = user?.status;

  const [allJpo, setAllJpo] = useState([]);
  const [nameJPO, setNameJPO] = useState("");
  const [JPODateStart, setJPODateStart] = useState("");
  const [JPODateEnd, setJPODateEnd] = useState("");
  const [descriptionJPO, setDescriptionJPO] = useState("");
  const [files, setFiles] = useState([]);
  const [jpoThumbnail, setJpoThumbnail] = useState("");
  const [openProjects, setOpenProjects] = useState(false);
  const [open, setOpen] = useState(false);
  const rejectedFiles = files.filter((file) => file.errors);

  const [pdfUrl, setPdfUrl] = useState(null);

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((files) => [...files, ...acceptedFiles]);
  }, []);

  const handleRemove = (file) => () => {
    setFiles((files) => files.filter((f) => f !== file));
  };

  const handleFileChange = (fileData) => {
    setJpoThumbnail(fileData);
  };

  const handleClickProjects = () => {
    setOpenProjects(!openProjects);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const publishJpo = async () => {
    try {
      const formData = new FormData();
      formData.append("jpoTitle", nameJPO);
      formData.append("jpoDescription", descriptionJPO);
      formData.append("jpoThumbnail", jpoThumbnail);
      formData.append("jpoDayStart", JPODateStart);
      formData.append("jpoDayEnd", JPODateEnd);
      formData.append("file", pdfUrl);
      await axios
        .post("http://localhost:5050/ressources/jpo", formData)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    await publishJpo();
    event.preventDefault();
    setOpen(false);
  };

  useEffect(() => {
    getAllJpo();
  }, []);

  return (
    <div className="jpo-page">
      <div className="header-jpo">
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          Fil d'actualités - Jpo
        </Typography>
        {userStatus === "pedago" ? (
          <div>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#7a52e1",
                color: "white",
                fontWeight: "bold",
              }}
              onClick={handleClickOpen}
              disableElevation
            >
              Créer une JPO <CreateIcon />
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogContent>
                <form onSubmit={handleSubmit} className="jpo-form">
                  <TextField
                    sx={{ marginBottom: "10px", marginTop: "5px" }}
                    label="Nom de la JPO"
                    fullWidth
                    defaultValue={nameJPO}
                    onChange={(event) => setNameJPO(event.target.value)}
                  />
                  <div className="jpo-date-container">
                    <p className="p-1">Date de début</p>
                    <TextField
                      className="textfield"
                      id="date"
                      name="date"
                      variant="standard"
                      type="date"
                      defaultValue={JPODateStart}
                      onChange={(e) => setJPODateStart(e.target.value)}
                      sx={{ width: "90%" }}
                    />
                  </div>
                  <div className="jpo-date-container">
                    <p className="p-1">Date de fin</p>
                    <TextField
                      className="textfield"
                      id="date"
                      name="date"
                      variant="standard"
                      type="date"
                      defaultValue={JPODateEnd}
                      onChange={(e) => setJPODateEnd(e.target.value)}
                      sx={{ width: "90%" }}
                    />
                  </div>
                  <TextField
                    sx={{ marginBottom: "10px" }}
                    label="Description de la JPO"
                    fullWidth
                    multiline
                    rows={4}
                    defaultValue={descriptionJPO}
                    onChange={(event) => setDescriptionJPO(event.target.value)}
                  />
                  <div className="dropzone-coursimg-container">
                    <p className="info-dropdown-img">
                      Drag and drop an image file here, or click to select an
                      image file. (max. 1.00 MB each) as JPG, PNG, GIF, WebP,
                      SVG or BMP.
                    </p>
                    <Dropzone
                      onDrop={handleDrop}
                      onFileChange={handleFileChange}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>
                              Drag and drop some files here, or click to select
                              files
                            </p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                    {rejectedFiles.length > 0 && (
                      <div>
                        <h4>Rejected files:</h4>
                        <ul>
                          {rejectedFiles.map((file) => (
                            <li key={file.name}>
                              {file.name} - {file.size} bytes - {file.type}
                              <button onClick={handleRemove(file)}>
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </form>
                <PdfViewer pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  sx={{ backgroundColor: "#7a52e1", color: "white" }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmit}
                  sx={{ backgroundColor: "#7a52e1", color: "white" }}
                >
                  Soumettre
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <div className="jpo-list-container">
        <div className="btn-history-container">
          <Button
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: "#e70062",
              color: "white",
              fontWeight: "bold",
            }}
            className={classes.button}
            onClick={() => {
              navigate(`/jpo/history`);
            }}
          >
            Historique <HistoryIcon />
          </Button>
        </div>
        {allJpo.map((jpoData, index) => (
          <Card
            key={index}
            className="jpo-card"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
              width: "70%",
              margin: "30px",
            }}
          >
            <Grid container>
              <Grid item xs={12} sm={6}>
                <CardMedia
                  component="img"
                  src={jpoData.jpoThumbnail}
                  alt="img-jpo"
                  className="jpo-image"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="jpo-text">
                  <Typography sx={{ paddingBottom: "10px", fontSize: "24px" }}>
                    {jpoData.jpoTitle}
                  </Typography>
                  <Typography sx={{ paddingBottom: "10px" }}>
                    {jpoData.jpoDescription}
                  </Typography>
                  <Typography sx={{ textAlign: "center" }}>
                    {moment
                      .unix(jpoData.jpoDayStart._seconds)
                      .format("DD.MM.YYYY HH:mm")}
                    {" - "} 
                    {moment
                      .unix(jpoData.jpoDayEnd._seconds)
                      .format("DD.MM.YYYY HH:mm")}
                  </Typography>
                  {jpoData.linkedStudentProject ? (
                    <List>
                      <ListItem button onClick={handleClickProjects}>
                        <ListItemText
                          primary={"Afficher les projets"}
                          style={{ textAlign: "center" }}
                        />
                        {openProjects ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse in={openProjects} timeout="auto" unmountOnExit>
                        <List disablePadding>
                          <ListItem
                            sx={{
                              padding: "10px 0px",
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-evenly",
                              borderTop: "1px solid grey",
                            }}
                          >
                            <Typography>
                              {jpoData.linkedStudentProject.nameProject}
                              {" - "}
                              {jpoData.linkedStudentProject.typeProject}
                            </Typography>
                            <Button
                              onClick={() => {
                                navigate(
                                  `/studentprojects/${jpoData?.linkedStudentProject?.id}`
                                );
                              }}
                            >
                              Voir le projet
                            </Button>
                          </ListItem>
                        </List>
                      </Collapse>
                    </List>
                  ) : (
                    <div className="no-votes-student-projects-container">
                      <p className="no-votes-student-projects-p">
                        Il n'y a pas encore de projet mis en avant
                      </p>
                      {/* <img
                        className="no-votes-student-projects-img"
                        src={NoVotesImg}
                        alt="no-votes-projects-students"
                      /> */}
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Jpo;
