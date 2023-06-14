import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Player } from "video-react";
import "video-react/dist/video-react.css";

import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

const UploadVideoPlayerDialog = (props) => {
  const { projectid } = useParams();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [selectedVideoName, setSelectedVideoName] = useState("");

  const playerRef = useRef(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    setSelectedVideo(file);
    setSelectedVideoUrl(URL.createObjectURL(file));
    setSelectedVideoName(file.name);
  };

  console.log(selectedVideo);

  const uploadVideoStudentProject = async () => {
    try {
      const formData = new FormData();
      formData.append("projectId", projectid);
      formData.append("nameProject", props.nameProject);
      formData.append("media", selectedVideo);

      console.log(formData);

      await axios
        .post(`http://localhost:5050/ressources/upload-media-project`, formData)
        .then((res) => {
          console.log(res.data);
          if (
            res.status === 200 &&
            res.data.message === "Fichier vidéo uploadé avec succès."
          ) {
            toastSuccess(
              `Votre video ${selectedVideoName} a bien été uploader à votre projet étudiant avec succès`
            );
          }
          props.close();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      throw error;
    }
  };

  const handleVideoSubmit = async () => {
    uploadVideoStudentProject();
  };

  return (
    <>
      <Dialog open={props.open} onClose={props.close}>
        <DialogTitle>Uploader une vidéo</DialogTitle>
        <DialogContent>
          <input type="file" accept="video/*" onChange={handleVideoUpload} />
          {selectedVideo && (
            <Player ref={playerRef} autoPlay>
              <source src={selectedVideoUrl} />
            </Player>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVideoSubmit} disabled={!selectedVideo}>
            Soumettre
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default UploadVideoPlayerDialog;
