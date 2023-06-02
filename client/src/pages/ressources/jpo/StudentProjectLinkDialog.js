import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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

const StudentProjectLinkDialog = (props) => {
  const { id } = useParams();
  const [selectedStudentProjectId, setSelectedStudentProjectId] = useState("");

  const linkStudentProjectToJpo = async () => {
    try {
      await axios
        .post(`http://localhost:5050/ressources/jpo/${id}`, {
          studentProjectId: selectedStudentProjectId,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      throw error;
    }
  };

  const handleStudentProjectSelect = (event) => {
    setSelectedStudentProjectId(event.target.value || "");
  };

  const handleImageClick = (studentProjectId) => {
    setSelectedStudentProjectId(studentProjectId);
  };

  console.log(selectedStudentProjectId);

  console.log(props.allprojects);

  return (
    <Dialog open={props.open} onClose={props.close}>
      <DialogTitle>Lier à un projet étudiant</DialogTitle>
      <DialogContent>
        <div style={{ height: "600px", overflow: "auto" }}>
          <Grid container spacing={2}>
            {props.allprojects.map((project) => (
              <Grid item key={project.id} xs={12} sm={6} md={4}>
                <Typography
                  variant="subtitle1"
                  sx={{ textAlign: "center", marginBottom: "15px" }}
                >
                  {project.nameProject}
                </Typography>
                <div style={{ position: "relative" }}>
                  <FormControlLabel
                    value={project.id}
                    control={
                      <Radio
                        color="primary"
                        checked={selectedStudentProjectId === project.id}
                        onChange={handleStudentProjectSelect}
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
                    src={project.imgProject}
                    style={{ width: "100%", cursor: "pointer" }}
                    alt="blog-tuto-linked-img"
                    onClick={() => handleImageClick(project.id)}
                  />
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={linkStudentProjectToJpo}
          sx={{ backgroundColor: "#7a52e1", color: "white" }}
          disabled={!selectedStudentProjectId}
        >
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentProjectLinkDialog;
