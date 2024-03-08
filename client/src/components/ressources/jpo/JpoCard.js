import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

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

import { makeStyles } from "@mui/styles";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";

import "../../../pages/ressources/jpo/Jpo.scss";

const useStyles = makeStyles({
  btnDetailJpo: {
    backgroundColor: "#D1229D",
    color: "white",
    "&:hover": {
      backgroundColor: "#D1229D",
      fontWeight: "bold",
    },
    margin: "20px",
  },
  btnProject: {
    backgroundColor: "#7a52e1",
    color: "white",
    "&:hover": {
      backgroundColor: "#7a52e1",
      fontWeight: "bold",
    },
    width: "180px",
  },
});

const JpoCard = ({ jpoData, key }) => {
  const classes = useStyles();
  let navigate = useNavigate();

  const [openProjects, setOpenProjects] = useState(false);

  const handleClickProjects = () => {
    setOpenProjects(!openProjects);
  };

  return (
    <>
      <Card
        className="jpo-card"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          marginBottom: "30px",
        }}
      >
        <Grid container>
          <Grid item xs={12} sm={6}>
            <CardMedia
              component="img"
              src={jpoData.jpoThumbnail}
              alt="img-jpo"
              className="jpo-image-list"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className="jpo-text">
              <Typography sx={{ paddingBottom: "10px", fontSize: "24px" }}>
                {jpoData.jpoTitle}
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
            </div>
            <div>
              {Array.isArray(jpoData.linkedStudentProjects) &&
              jpoData.linkedStudentProjects.length > 0 ? (
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
                      {jpoData.linkedStudentProjects.map((project) => (
                        <Card
                          key={project.id}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            marginBottom: "10px",
                            padding: "10px 0px",
                          }}
                        >
                          <div className="img-name-project-link-jpo-page">
                            <img
                              src={project.imgProject}
                              className="project-img"
                              alt="projet truc"
                            />
                            <Typography
                              fontWeight={"bold"}
                              paddingLeft={"10px"}
                            >
                              {project.nameProject}
                            </Typography>
                          </div>
                          <div className="button-project">
                            <Button
                              onClick={() => {
                                navigate(`/studentprojects/${project.id}`);
                              }}
                              className={classes.btnProject}
                            >
                              <Typography>projet</Typography>
                              <VisibilityIcon />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </List>
                  </Collapse>
                </List>
              ) : (
                <p className="no-votes-student-projects-p">
                  Aucun projet étudiant lié à cette JPO.
                </p>
              )}
              <div className="btn-details-jpo-container">
                <Button
                  className={classes.btnDetailJpo}
                  onClick={() => {
                    navigate(`/jpo/${jpoData.id}`);
                  }}
                >
                  Détails
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default JpoCard;
