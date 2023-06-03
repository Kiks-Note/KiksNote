import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import useFirebase from "../../../hooks/useFirebase";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Grid,
  Skeleton,
} from "@mui/material";

import CreateJpoModal from "./CreateJpoModal";

import { makeStyles } from "@mui/styles";

import ExpandMore from "@mui/icons-material/ExpandMore";
import CreateIcon from "@mui/icons-material/Create";
import HistoryIcon from "@mui/icons-material/History";

import JpoCard from "./JpoCard";
import "./Jpo.scss";

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

  const [allJpo, setAllJpo] = useState([]);
  const [nameJPO, setNameJPO] = useState("");
  const [JPODateStart, setJPODateStart] = useState("");
  const [JPODateEnd, setJPODateEnd] = useState("");
  const [descriptionJPO, setDescriptionJPO] = useState("");
  const [files, setFiles] = useState([]);
  const [jpoThumbnail, setJpoThumbnail] = useState("");
  const [open, setOpen] = useState(false);
  const rejectedFiles = files.filter((file) => file.errors);

  const [loading, setLoading] = useState(true);

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
          <div className="jpo-page">
            <div className="header-jpo">
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                Fil d'actualités - Jpo
              </Typography>
              <div>
                <Button
                  variant="contained"
                  className={classes.btnCreateJpo}
                  disableElevation
                >
                  Créer une JPO <CreateIcon />
                </Button>
              </div>
            </div>

            <div className="jpo-list-container">
              <div className="btn-history-container">
                <Button
                  variant="contained"
                  disableElevation
                  className={classes.btnHistory}
                >
                  Historique <HistoryIcon />
                </Button>
              </div>
              {Array.from({ length: 4 }).map((_, index) => (
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
                      <Skeleton width={400} height={400} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div className="jpo-text">
                        <Typography
                          sx={{ paddingBottom: "10px", fontSize: "24px" }}
                        >
                          <Skeleton width={200} />
                        </Typography>
                        <Typography sx={{ paddingBottom: "10px" }}>
                          <Skeleton count={4} />
                        </Typography>
                        <Typography sx={{ textAlign: "center" }}>
                          <Skeleton width={150} />
                        </Typography>
                        <List>
                          <ListItem button>
                            <ListItemText
                              primary={<Skeleton width={150} />}
                              style={{ textAlign: "center" }}
                            />
                            <ExpandMore />
                          </ListItem>
                          <Collapse timeout="auto" unmountOnExit>
                            <List disablePadding>
                              {Array.from({ length: 5 }).map((_, index) => (
                                <ListItem
                                  key={index}
                                  sx={{
                                    padding: "10px 0px",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    borderTop: "1px solid grey",
                                  }}
                                >
                                  <Typography>
                                    <Skeleton width={100} />
                                  </Typography>
                                  <Button>
                                    <Skeleton width={100} />
                                  </Button>
                                </ListItem>
                              ))}
                            </List>
                          </Collapse>
                        </List>
                        <div className="btn-details-jpo-container">
                          <Button className={classes.btnDetailJpo}>
                            <Skeleton width={100} />
                          </Button>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="jpo-page">
          <div className="header-jpo">
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              Fil d'actualités - Jpo
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
                  pdfUrl={pdfUrl}
                  setPdfUrl={setPdfUrl}
                  btnCreateJpo={classes.btnCreateJpo}
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
                className={classes.btnHistory}
                onClick={() => {
                  navigate(`/jpo/history`);
                }}
              >
                Historique <HistoryIcon />
              </Button>
            </div>
            {allJpo.map((jpoData, index) => (
              <JpoCard key={index} jpoData={jpoData} />
            ))}{" "}
          </div>
        </div>
      )}
    </>
  );
};

export default Jpo;
