import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
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
  Button,
} from "@mui/material";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import "./HistoryJpo.scss";

const HistoryJpo = () => {
  let navigate = useNavigate();
  const [allPastJpo, setAllPastJpo] = useState([]);

  const [openProjects, setOpenProjects] = useState(false);

  const handleClickProjects = () => {
    setOpenProjects(!openProjects);
  };

  const getAllOldJpo = async () => {
    try {
      await axios
        .get("http://localhost:5050/ressources/pastjpo")
        .then((res) => {
          setAllPastJpo(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllOldJpo();
  }, []);

  return (
    <div className="history-jpo-page">
      <div className="header-jpo">
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          Historique des JPO
        </Typography>
      </div>
      <div className="jpo-list-container">
        {allPastJpo.map((jpoData, index) => (
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
                    <div>
                      <p>Personne n'a encore mis en avant votre projet</p>
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

export default HistoryJpo;
