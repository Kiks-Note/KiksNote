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
    props.getStudentProjectById();
  };

  const handleBlogTutoSelect = (event) => {
    setSelectedBlogTutoId(event.target.value || "");
  };

  const handleImageClick = (blogTutoId) => {
    setSelectedBlogTutoId(blogTutoId);
  };

  return (
    <Dialog open={props.open} onClose={props.close}>
      <DialogTitle>Lier à un article blog tuto</DialogTitle>
      <DialogContent>
        <div style={{ height: "600px", overflow: "auto" }}>
          <Grid container spacing={2}>
            {props.allblogtutos.map((blogTuto) => (
              <Grid item key={blogTuto.id} xs={12} sm={6} md={4}>
                <div style={{ position: "relative" }}>
                  <FormControlLabel
                    value={blogTuto.id}
                    control={
                      <Radio
                        color="primary"
                        checked={selectedBlogTutoId === blogTuto.id}
                        onChange={handleBlogTutoSelect}
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
                    src={blogTuto.data.thumbnail}
                    style={{ width: "100%", cursor: "pointer" }}
                    alt="blog-tuto-linked-img"
                    onClick={() => handleImageClick(blogTuto.id)}
                  />
                </div>
                <Typography
                  variant="subtitle1"
                  sx={{ textAlign: "center", marginBottom: "15px" }}
                >
                  {blogTuto.data.title}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={publishStudentProject}
          sx={{ backgroundColor: "#7a52e1", color: "white" }}
          disabled={!selectedBlogTutoId}
        >
          Soumettre
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlogTutosLinkDialog;
