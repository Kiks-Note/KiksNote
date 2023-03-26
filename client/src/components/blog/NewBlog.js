import CloseIcon from "@mui/icons-material/Close";
import {
  CardMedia,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";


export default function SideBarModify({ open, toggleDrawerModify, deviceId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [image, setImage] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [inputEditorState, setInputEditorState] = useState("");
  const [event, setEvent] = useState("");

  const handleEditorChange = (e) => {
    setEditorState(e);
    setInputEditorState(draftToHtml(convertToRaw(e.getCurrentContent())));

  }

  console.log(inputEditorState);

  const newBlog = async (e) => {
    e.preventDefault();

    if (!title || !description || !photo || !editorState || !inputEditorState || !event) {
      console.log(title, description, photo, editorState);
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const blog = {
      title,
      description,
      photo,
      editorState,
      inputEditorState,
      event


    };
    try {
      const response = await axios.post(
        `http://localhost:5050/blog/newblog`,
        blog
      );

      toast.success("Tuto ajouté avec succès");
      console.log(response.data);
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.log(error);
    }
  };

  const list = () => (
    <>

      <Box
        sx={{
          width: 1450,
          p: 2,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
      >


        <Typography
          variant="h6"
          sx={{
            marginBottom: 4,
          }}
        >
          Ajout d'un nouveau blog

          <div>
            <Editor

              placeholder='Write your blog here...'

              editorState={editorState}

              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={handleEditorChange}
              editorStyle={{ border: "1px solid black", minHeight: "180px", padding: "10px", borderRadius: "5px", boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)" }}

            />

            {/* <textarea  disabled value={
              draftToHtml(convertToRaw(editorState.getCurrentContent()))

            }>

            </textarea> */}
          </div>
        </Typography>

        <IconButton
          sx={{
            position: "absolute",
            top: 12,
            right: 5,
          }}
          onClick={(e) => {
            toggleDrawerModify(e, false);
          }}
        >
          <CloseIcon />
        </IconButton>

        <>


          <TextField
            sx={{ marginBottom: 2 }}
            id="outlined-search"
            type={"text"}
            name="Titre"
            label="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            InputLabelProps={{ className: "inputLabel" }}
            InputProps={{ className: "input" }}
          />


          <TextField

            sx={{ marginBottom: 2 }}
            id="outlined-search"
            type={"text"}
            name="Description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            InputLabelProps={{ className: "inputLabel" }}
            InputProps={{ className: "input" }}
          >

          </TextField >

          <TextField

            sx={{ marginBottom: 2 }}
            id="outlined-search"
            type={"text"}
            name="Event"
            label="Event"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            fullWidth
            InputLabelProps={{ className: "inputLabel" }}
            InputProps={{ className: "input" }}
          >

          </TextField >

          <TextField
            sx={{ marginBottom: 2 }}
            id="outlined-search"
            label="Image"
            type={"text"}
            name="image"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            fullWidth
            InputLabelProps={{ className: "inputLabel" }}
            InputProps={{ className: "input" }}
          />
          {photo && (
            <>
              <Typography
                variant="subtitle2"
                color={"text.secondary"}
                sx={{
                  alignSelf: "flex-start",
                  marginBottom: 2,
                }}
              >
                Aperçu de l'image :
              </Typography>
              <CardMedia
                sx={{ marginBottom: 2, borderRadius: 2 }}
                component="img"
                height="140"
                image={photo ? photo : ""}
                alt=""
              />





            </>
          )}

          <Button
            variant="contained"
            sx={{ marginBottom: 2 }}
            fullWidth
            onClick={(e) => {
              newBlog(e);
              toggleDrawerModify(e, false);
            }}
          >
            Confirmer
          </Button>
        </>
      </Box>
    </>
  );

  return (
    <div>
      <React.Fragment>
        <SwipeableDrawer
          anchor={"right"}
          open={open}
          onClose={(e) => toggleDrawerModify(e, false)}
          onOpen={(e) => toggleDrawerModify(e, true)}
        >
          {list("right")}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}


