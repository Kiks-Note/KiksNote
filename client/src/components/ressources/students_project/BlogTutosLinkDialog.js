import React, {useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";

import {toast, ToastContainer} from "react-toastify";

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

const BlogTutosLinkDialog = (props) => {
  const {projectid} = useParams();
  const [selectedBlogTutoId, setSelectedBlogTutoId] = useState("");

  const selectedBlogTuto = props.allblogtutos.find(
    (blogtuto) => blogtuto.id === selectedBlogTutoId
  );
  const selectedBlogTutoName = selectedBlogTuto
    ? selectedBlogTuto.data.title
    : "";

  /* 
      Link a blog tuto with the current project using 
      projectId (String),
      selectedBlogTutoId (String) 
      and selectedBlogTutoName (String)
    */

  const publishStudentProject = async () => {
    try {
      await axios
        .post(
          `${process.env.REACT_APP_SERVER_API}/ressources/linkblogtuto/${projectid}`,
          {
            blogTutoId: selectedBlogTutoId,
          }
        )
        .then((res) => {
          console.log(res.data);
          if (
            res.status === 200 &&
            res.data === "Le blog tutoriel a été lié au projet avec succès."
          ) {
            toastSuccess(
              `Le blog tutoriel ${selectedBlogTutoName} a bien été lié à votre projet étudiant`
            );
          }
          props.close();
          props.getStudentProjectById();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      throw error;
    }
  };

  const handleBlogTutoSelect = (event) => {
    setSelectedBlogTutoId(event.target.value || "");
  };

  const handleImageClick = (blogTutoId) => {
    setSelectedBlogTutoId(blogTutoId);
  };

  return (
    <>
      <Dialog open={props.open} onClose={props.close}>
        <DialogTitle>Lier à un article blog tuto</DialogTitle>
        <DialogContent>
          <div style={{height: "600px", overflow: "auto"}}>
            <Grid container spacing={2}>
              {props.allblogtutos.map((blogTuto) => (
                <Grid item key={blogTuto.id} xs={12} sm={6} md={4}>
                  <div style={{position: "relative"}}>
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
                      src={blogTuto?.data?.thumbnail}
                      style={{width: "100%", cursor: "pointer"}}
                      alt="blog-tuto-linked-img"
                      onClick={() => handleImageClick(blogTuto.id)}
                    />
                  </div>
                  <Typography
                    variant="subtitle1"
                    sx={{textAlign: "center", marginBottom: "15px"}}
                  >
                    {blogTuto?.data?.title}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={publishStudentProject}
            sx={{backgroundColor: "#7a52e1", color: "white"}}
            disabled={!selectedBlogTutoId}
          >
            Soumettre
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default BlogTutosLinkDialog;
