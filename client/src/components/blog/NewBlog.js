import CloseIcon from "@mui/icons-material/Close";
import { CardMedia, IconButton, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useFirebase from "../../hooks/useFirebase";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

export default function SideBarModify({ open, toggleDrawerModify, deviceId }) {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [inputEditorState, setInputEditorState] = useState("");
  const { user } = useFirebase();
  const handleEditorChange = (e) => {
    setEditorState(e);
    setInputEditorState(draftToHtml(convertToRaw(e.getCurrentContent())));
  };


  const newBlog = async (e) => {
    e.preventDefault();

    if (!title || !thumbnail || !editorState || !inputEditorState) {
      console.log(title, thumbnail, editorState);
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const blog = {
      title,
      thumbnail,
      editorState,
      inputEditorState,
      created_by:user.id,
    };
    try {
      const response = await axios.post(`http://localhost:5050/blog`, blog);

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

          <div>
            <Editor
              placeholder="Faites chauffer le clavier "
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={handleEditorChange}
              editorStyle={{
                border: "1px solid black",
                minHeight: "180px",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
              }}
            />
          </div>
          <TextField
            sx={{ marginBottom: 2 }}
            id="outlined-search"
            label="Image"
            type={"text"}
            name="image"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            fullWidth
            InputLabelProps={{ className: "inputLabel" }}
            InputProps={{ className: "input" }}
          />
          {thumbnail && (
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
                image={thumbnail ? thumbnail : ""}
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
