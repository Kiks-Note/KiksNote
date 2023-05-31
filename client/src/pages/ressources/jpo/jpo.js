import React, { useState, useEffect } from "react";
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
  Divider,
} from "@mui/material";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import "./jpo.scss";

export default function Jpo() {
  let navigate = useNavigate();

  const { user } = useFirebase();
  const userStatus = user?.status;

  const [events, setEvent] = useState([]);
  const [openProjects, setOpenProjects] = useState(false);

  const handleClickProjects = () => {
    setOpenProjects(!openProjects);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await axios
        .get("http://localhost:5050/ressources/jpo")
        .then((response) => {
          setEvent(response.data);
        });
    };
    fetchEvent();
  }, []);

  const jpoData = {
    jpoTitle: "JPO Name",
    jpoDescription: "Je suis une JPO",
    jpoThumbnail: "thumbnail.img",
    jpoDayStart: "TimeStamp",
    jpoDayEnd: "TimeStamp",
    linkedStudentProject: [
      {
        nameProject: "Projet",
        idStudentProject: "fbvofijdzeoiebvf",
        typeProject: "Web",
      },
    ],
    linkPlaquette: "imageplaquette.img",
  };

  return (
    <div>
      <h1>JPO</h1>
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
        <Card
          className="jpo-card"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
            width: "60%",
          }}
        >
          <img
            src={jpoData.jpoThumbnail}
            alt="Je suis un JPO, c'est la description vous avez compris?"
            className="jpo-image"
          />
          <div className="jpo-text">
            <Typography sx={{ paddingBottom: "10px", fontSize: "24px" }}>
              {jpoData.jpoTitle}
            </Typography>
            <Typography sx={{ paddingBottom: "10px" }}>
              {jpoData.jpoDescription}
            </Typography>
            <Typography sx={{ textAlign: "center" }}>
              {jpoData.jpoDayStart} {jpoData.jpoDayEnd}
            </Typography>
            {jpoData?.linkedStudentProject?.length > 0 ? (
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
                    {jpoData.linkedStudentProject.map((project, index) => (
                      <React.Fragment key={index}>
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
                            {project.nameProject}
                            {" - "}
                            {project.typeProject}
                          </Typography>
                          <Button
                            onClick={() => {
                              navigate(`/${project.idStudentProject}`);
                            }}
                          >
                            Voir le projet
                          </Button>
                        </ListItem>
                      </React.Fragment>
                    ))}
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
        </Card>
      </div>
    </div>
  );
}
