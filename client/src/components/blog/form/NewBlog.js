import CloseIcon from "@mui/icons-material/Close";
import { IconButton, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";
import toast from "react-hot-toast";
import useFirebase from "../../../hooks/useFirebase";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import Autocomplete from "@mui/material/Autocomplete";

export default function NewBlog({ open, toggleDrawerModify }) {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [inputEditorState, setInputEditorState] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const { user } = useFirebase();
  const handleEditorChange = (e) => {
    setEditorState(e);
    setInputEditorState(draftToHtml(convertToRaw(e.getCurrentContent())));
  };

  useEffect(() => {
    fetchTags();
    setLoading(false);
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:5050/blog/tag");
      const tags = response.data;
      setTags(tags);
    } catch (error) {
      console.error("Erreur lors de la récupération des tags :", error);
    }
  };

  const reset = () => {
    setTitle("");
    setThumbnail(null);
    setPreviewImage("");
    setEditorState(EditorState.createEmpty());
    setInputEditorState("");
    setSelectedTags([]);
    setErrors({});
  };

  const validateForm = () => {
    let formIsValid = true;
    const errors = {};

    if (!title) {
      errors.title = "Veuillez entrer un titre";
      formIsValid = false;
    }

    if (!thumbnail) {
      errors.thumbnail = "Veuillez sélectionner une image";
      formIsValid = false;
    }

    if (!inputEditorState) {
      errors.editorState = "Veuillez écrire un contenu";
      formIsValid = false;
    }

    setErrors(errors);
    return formIsValid;
  };

  const newBlog = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    var statut = "online";
    var visibility = true;
    if (user.status === "etudiant") {
      statut = "pending";
      visibility = false;
    }

    const formData = new FormData();
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("editorState", JSON.stringify(editorState));
    formData.append("inputEditorState", JSON.stringify(inputEditorState));
    formData.append("created_by", user.id);
    formData.append("type", "blog");
    formData.append("tag", selectedTags);
    formData.append("statut", statut);
    formData.append("visibility", visibility);

    try {
      const response = await axios.post(
        "http://localhost:5050/blog",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Blog ajouté avec succès");
      reset();
      toggleDrawerModify(e, false);
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
          Nouveau blog
        </Typography>

        <IconButton
          sx={{
            position: "absolute",
            top: 12,
            right: 5,
          }}
          onClick={(e) => {
            toggleDrawerModify(e, false);
            reset();
          }}
        >
          <CloseIcon />
        </IconButton>

        <>
          <TextField
            sx={{ marginBottom: 2 }}
            id="outlined-search"
            type="text"
            name="Titre"
            label="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            InputLabelProps={{ className: "inputLabel" }}
            InputProps={{ className: "input" }}
            error={errors.title ? true : false}
            helperText={errors.title}
          />
          <div>
            <Autocomplete
              multiple
              id="tags"
              options={tags}
              getOptionLabel={(tag) => tag.name}
              value={selectedTags.map((tagId) =>
                tags.find((tag) => tag.id === tagId)
              )}
              onChange={(event, newValue) => {
                setSelectedTags(newValue.map((tag) => tag.id));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </div>
          <div>
            <Editor
              placeholder="Faites chauffer le clavier"
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={handleEditorChange}
              editorStyle={{
                border: "1px solid black",
                minHeight: "180px",
                height: "300px",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
                marginBottom: "16px",
              }}
              error={errors.editorState ? true : false}
            />
            {errors.editorState && (
              <Typography variant="caption" color="error">
                {errors.editorState}
              </Typography>
            )}
          </div>
          <TextField
            sx={{ marginBottom: 2 }}
            id="outlined-search"
            label="Miniature"
            type="file"
            onChange={(e) => {
              setThumbnail(e.target.files[0]);
              setPreviewImage(URL.createObjectURL(e.target.files[0]));
            }}
            fullWidth
            InputLabelProps={{ className: "inputLabel" }}
            InputProps={{ className: "input" }}
            error={errors.thumbnail ? true : false}
            helperText={errors.thumbnail}
          />
          {previewImage && (
            <>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{
                  alignSelf: "flex-start",
                  marginBottom: 2,
                }}
              >
                Aperçu de l'image :
              </Typography>
              <Box
                component="img"
                sx={{
                  height: 300,
                  width: 350,
                  maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                }}
                alt="The house from the offer."
                src={previewImage}
              />
            </>
          )}

          <Button
            variant="contained"
            sx={{
              marginBottom: 2,
              width: "100%",
            }}
            fullWidth
            onClick={(e) => {
              newBlog(e);
            }}
          >
            Confirmer
          </Button>
        </>
      </Box>
    </>
  );

  return (
    <>
      {!loading ? (
        <div>
          <React.Fragment>
            <SwipeableDrawer
              anchor="right"
              open={open}
              onClose={(e) => toggleDrawerModify(e, false)}
              onOpen={(e) => toggleDrawerModify(e, true)}
            >
              {list("right")}
            </SwipeableDrawer>
          </React.Fragment>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Rings color="#3f51b5" />
        </Box>
      )}
    </>
  );
}
