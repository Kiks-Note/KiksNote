import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Radio,
  FormControlLabel,
} from "@mui/material";

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

const CoursLinkDialog = (props) => {
  const { id } = useParams();
  const [selectedCoursId, setSelectedCoursId] = useState("");

  const selectedCours = props.allcours?.cours?.find(
    (cours) => cours.id === selectedCoursId
  );
  const selectedCoursTitle = selectedCours ? selectedCours?.data?.title : "";

  /*
    Link a selected cours using it selectedCoursId (String)
  */

  const linkCoursinCoursInfo = async () => {
    try {
      await axios
        .post(`http://localhost:5050/ressources/linkcours/${id}`, {
          id: selectedCoursId,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data === `Le cours lié a été ajouté avec succès.`) {
            toastSuccess(
              `Le cours ${selectedCoursTitle} a bien été lié à votre cours ${props.coursData?.title}`
            );
            props.close();
            props.getCoursId();
          }
        })
        .catch((error) => {
          console.log(error);
          toastFail(
            "Il semble avoir un problème avec la liaison de votre cours"
          );
        });
    } catch (error) {
      throw error;
    }
  };

  const handleCoursSelect = (event) => {
    setSelectedCoursId(event.target.value || "");
  };

  const handleImageClick = (coursId) => {
    setSelectedCoursId(coursId);
  };

  return (
    <>
      <Dialog open={props.open} onClose={props.close}>
        <DialogTitle>Lier votre cours à un autre cours</DialogTitle>
        <DialogContent>
          <div style={{ height: "600px", overflow: "auto" }}>
            <Grid container spacing={2}>
              {props.allcours?.cours?.map(
                (cours) => (
                  console.log(cours.data?.title),
                  (
                    <Grid item key={cours.id} xs={12} sm={6} md={4}>
                      <Typography
                        variant="subtitle1"
                        sx={{ textAlign: "center", marginBottom: "15px" }}
                      >
                        {cours.data?.title}
                      </Typography>
                      <div style={{ position: "relative" }}>
                        <FormControlLabel
                          value={cours.id}
                          control={
                            <Radio
                              color="primary"
                              checked={selectedCoursId === cours.id}
                              onChange={handleCoursSelect}
                            />
                          }
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            zIndex: 1,
                          }}
                        />
                        <img
                          src={cours.data?.imageCourseUrl}
                          style={{ width: "100%", cursor: "pointer" }}
                          alt="blog-tuto-linked-img"
                          onClick={() => handleImageClick(cours.id)}
                        />
                      </div>
                    </Grid>
                  )
                )
              )}
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={linkCoursinCoursInfo}
            sx={{ backgroundColor: "#7a52e1", color: "white" }}
            disabled={!selectedCoursId}
          >
            Valider
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default CoursLinkDialog;
