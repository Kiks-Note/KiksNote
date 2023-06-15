import CloseIcon from "@mui/icons-material/Close";
import { Checkbox, IconButton, TextField, Typography } from "@mui/material";
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
import MDEditor, { commands } from "@uiw/react-md-editor";

export default function NewBlog({ open, toggleDrawerModify }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [inputEditorState, setInputEditorState] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [valueMarkdown, setValueMarkdown] = useState("**Hello world!!!**");

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
    setDescription("");
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
    if (!description) {
      errors.description = "Veuillez entrer une description";
      formIsValid = false;
    }

    setErrors(errors);
    return formIsValid;
  };

  const newBlog = async (e) => {
    e.preventDefault();

    let blogType = "blog";

    if (!validateForm()) {
      return;
    }

    let statut = "online";
    let visibility = "public";
    if (user.status === "etudiant") {
      statut = "pending";
      visibility = "pending";
    }

    if (checked) {
      blogType = "event";
    }

    const formData = new FormData();
    formData.append("thumbnail", thumbnail);

    const blogData = {
      title: title,
      description: description,
      valueMarkdown: valueMarkdown,
      created_by: user.id,
      type: blogType,
      tag: selectedTags,
      statut: statut,
      visibility: visibility,
    };
    formData.append("blogData", JSON.stringify(blogData));
    console.log("tags", selectedTags);
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

  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    console.log(checked);
  };

  const handleCancel = () => {
    setValueMarkdown("**Hello world!!!**");
  };

  const help = {
    name: "help",
    keyCommand: "help",
    buttonProps: { "aria-label": "Insert help" },
    icon: (
      <svg viewBox="0 0 16 16" width="12px" height="12px">
        <path
          d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8Zm.9 13H7v-1.8h1.9V13Zm-.1-3.6v.5H7.1v-.6c.2-2.1 2-1.9 1.9-3.2.1-.7-.3-1.1-1-1.1-.8 0-1.2.7-1.2 1.6H5c0-1.7 1.2-3 2.9-3 2.3 0 3 1.4 3 2.3.1 2.3-1.9 2-2.1 3.5Z"
          fill="currentColor"
        />
      </svg>
    ),
    execute: (state, api) => {
      window.open("https://www.markdownguide.org/basic-syntax/", "_blank");
    },
  };

  const list = () => (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100%",
          padding: 5,
        }}
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
            handleCancel();
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
            error={errors.title ? true : false}
            helperText={errors.title}
          />
          <TextField
            sx={{ marginBottom: 2 }}
            id="outlined-search"
            type="text"
            name="Description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            error={errors.description ? true : false}
            helperText={errors.description}
          />
          <Box sx={{ display: "flex", width: "100%", mb: 2 }}>
            <Autocomplete
              sx={{ width: "50%" }}
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

            <Box sx={{ ml: 5 }}>
              <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
              <Typography variant="caption" color="textSecondary">
                Évenement
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: "100%", mb: 2 }}>
            <div data-color-mode="light">
              <MDEditor
                value={valueMarkdown}
                // preview="split"
                commands={[...commands.getCommands(), help]}
                onChange={(val) => setValueMarkdown(val)}
              />
            </div>
          </Box>
          <TextField
            sx={{ marginBottom: 2 }}
            id="outlined-search"
            // label="Miniature"
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => {
              setThumbnail(e.target.files[0]);
              setPreviewImage(URL.createObjectURL(e.target.files[0]));
            }}
            fullWidth
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
              {...{ PaperProps: { style: { width: "90%" } } }}
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
