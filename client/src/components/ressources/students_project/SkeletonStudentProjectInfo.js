import React from "react";


import {
    Skeleton,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Chip
} from "@mui/material";

const SkeletonStudentProjectInfo = (props) => {
    return (
        <>
        <div className="project-content">
            <div className="left-side-project">
              <div className="type-project-info-container">
                <Typography sx={{ marginRight: "5px" }}>
                  <Skeleton width={100} />
                </Typography>
              </div>
              <div className="type-project-info-container">
                <Typography sx={{ marginRight: "5px" }}>
                  Type du projet :
                </Typography>
                <Skeleton width={100} />
              </div>
              <div className="type-project-info-container">
                <Typography sx={{ marginRight: "5px" }}>Technos :</Typography>
                <Skeleton width={100} />
              </div>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: "15px 0px",
                }}
              >
                Code source du projet : <Skeleton width={50} />
              </Typography>
              <Chip
                sx={{
                  display: "flex",
                  width: "fit-content",
                  padding: "10px",
                  margin: "15px 0px",
                  alignItems: "center",
                }}
                label={
                  <>
                    <div style={{ display: "flex" }}>
                      <Typography>
                        <Skeleton width={50} />
                      </Typography>
                    </div>
                  </>
                }
              ></Chip>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  border: "10px grey",
                  borderRadius: "20px",
                  padding: "10px",
                  margin: "15px 0px",
                }}
              >
                <Typography>
                  <Skeleton width={150} />
                </Typography>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Skeleton width={100} />}
                    secondary={
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        <Skeleton width={50} />
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Skeleton width={100} />}
                    secondary={
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        <Skeleton width={50} />
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Skeleton width={100} />}
                    secondary={
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        <Skeleton width={50} />
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  border: "10px grey",
                  borderRadius: "20px",
                  padding: "10px",
                  margin: "15px 0px",
                }}
              >
                <Typography>
                  <Skeleton width={100} />
                </Typography>
                <ListItem
                  button
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <Skeleton variant="rectangular" width={250} height={150} />
                  <ListItemText primary={<Skeleton width={200} />} />
                </ListItem>
              </List>
              <div className="btn-link-blog-container">
                <div></div>
              </div>
              <div className="list-counter-ref">
                <div className="counter-container">
                  <Skeleton width={100} />
                </div>
                <Divider />
                <div className="voters-container">
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    Liste des personnes qui ont mis en avant le projet
                  </Typography>
                  <div className="no-votes-student-projects-container">
                    <p className="no-votes-student-projects-p">
                      Personne n'a encore mis en avant votre projet
                    </p>
                    <Skeleton variant="rectangular" width={200} height={150} />
                  </div>
                </div>
              </div>
            </div>
            <div className="right-side-project">
              <div className="img-project-box">
                <Skeleton variant="rectangular" width={400} height={300} />
              </div>
              <div className="text-project-box">
                <Typography sx={{ textAlign: "justify" }}>
                  <Skeleton count={6} />
                </Typography>
                <Typography sx={{ paddingTop: "20px", textAlign: "right" }}>
                  Publié par : <Skeleton width={50} />
                </Typography>
              </div>
            </div>
          </div>
        </>
    );
};

export default SkeletonStudentProjectInfo;