import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import useFirebase from "../../../hooks/useFirebase";

import moment from "moment";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  CardMedia,
  Grid,
} from "@mui/material";

import CreateJpoModal from "./CreateJpoModal";

import { makeStyles } from "@mui/styles";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CreateIcon from "@mui/icons-material/Create";
import HistoryIcon from "@mui/icons-material/History";

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
              pdfUrl={pdfUrl}
              setPdfUrl={setPdfUrl}
            />
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
