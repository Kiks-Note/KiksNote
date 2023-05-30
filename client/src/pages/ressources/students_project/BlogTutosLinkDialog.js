import React, { useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import {
  Autocomplete,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";

const BlogTutosLinkDialog = (props) => {
  const { projectid } = useParams();

  const [selectedBlogTutoId, setSelectedBlogTutoId] = useState("");

  const publishStudentProject = async () => {
    try {
      await axios
        .post(`http://localhost:5050/ressources/linkblogtuto/${projectid}`, {
          blogTutoId: selectedBlogTutoId,
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

  const handleBlogTutoSelect = (event, value) => {
    setSelectedBlogTutoId(value?.id || "");
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Lier à un article blog tuto</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {props.allblogtutos.map((blogTuto) => (
            <Grid item key={blogTuto.id} xs={12} sm={6} md={4}>
              <img
                src={blogTuto.data.thumbnail}
                style={{ width: "100%" }}
                alt="oez"
              />
              <Typography variant="subtitle1" align="center">
                {blogTuto.data.title}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Autocomplete
          options={props.allblogtutos}
          getOptionLabel={(blogTuto) => blogTuto.data.title}
          onChange={handleBlogTutoSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Sélectionner un blog tuto"
              variant="outlined"
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={publishStudentProject}
          sx={{ backgroundColor: "#7a52e1", color: "white" }}
        >
          Soumettre
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlogTutosLinkDialog;
