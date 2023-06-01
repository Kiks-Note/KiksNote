import React, { useState, useEffect } from "react";
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

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import "./jpo.scss";

export default function Jpo() {
  let navigate = useNavigate();

  const { user } = useFirebase();
  const userStatus = user?.status;

  const [allJpo, setAllJpo] = useState([]);
  const [openProjects, setOpenProjects] = useState(false);

  const handleClickProjects = () => {
    setOpenProjects(!openProjects);
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

  useEffect(() => {
    getAllJpo();
  }, []);

  return (
    <div>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontWeight: "bold", padding: "20px" }}
      >
        Fil d'actualités - Jpo
      </Typography>
      {userStatus === "pedago" ? (
        <Button
          variant="contained"
          disableElevation
          sx={{
            marginLeft: "80%",
          }}
        >
          Créer une JPO
        </Button>
      ) : (
        <div></div>
      )}

      <div className="jpo-list-container">
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
                        Personne n'a encore mis en avant votre projet
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
}
