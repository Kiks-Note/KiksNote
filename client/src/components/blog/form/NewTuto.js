import React, { useState, useEffect } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  TextField,
  IconButton,
} from "@mui/material";
import { toast } from "react-hot-toast";
import draftToHtml from "draftjs-to-html";
import useFirebase from "../../../hooks/useFirebase";
import Autocomplete from "@mui/material/Autocomplete";
import { Rings } from "react-loader-spinner";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

export default function NewTuto({ open, toggleDrawerModify }) {
  const [editorStates, setEditorStates] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [numSteps, setNumSteps] = useState(1);
  const [showForm, setShowForm] = useState(true);
  const [title, setTitle] = useState("");
  const [titleStep, setTitleStep] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useFirebase();

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
  const newTuto = async (e) => {
    const inputEditorState = editorStates.map((editorState, index) => {
      const currentContent = editorState.getCurrentContent();
      const content = draftToHtml(convertToRaw(currentContent));
      return { id: index, content: content };
    });

    console.log(inputEditorState);
    var statut = "online";
    var visibility = true;
    if (user.status === "etudiant") {
      statut = "pending";
      visibility = false;
    }

    const formData = new FormData();
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("editorState", editorStates);
    formData.append("inputEditorState", inputEditorState);
    formData.append("inputEditorStateTitle", titleStep);
    formData.append("created_by", user.id);
    formData.append("type", "tuto");
    formData.append("tag", selectedTags);
    formData.append("statut", statut);
    formData.append("visibility", visibility);

    try {
      const response = await axios.post(
        "http://localhost:5050/blog/tuto",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Tuto crée avec succès");
      toggleDrawerModify(e, false);
      handleCancel();
      console.log(response.data);
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.log(error);
    }
  };

  const handleNextStep = () => {
    const currentContent = editorStates[activeStep].getCurrentContent();
    if (currentContent.hasText()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNumStepsChange = (event) => {
    const num = parseInt(event.target.value);
    if (num >= 1 && num <= 10) {
      setNumSteps(num);
      setEditorStates((prevStates) => {
        if (prevStates.length < num) {
          const newStates = Array(num - prevStates.length)
            .fill()
            .map(() => EditorState.createEmpty());
          return [...prevStates, ...newStates];
        } else if (prevStates.length > num) {
          return prevStates.slice(0, num);
        }
        return prevStates;
      });
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (title.trim() === "") {
      toast.error("Veuillez entrer un titre");
      return;
    }
    if (thumbnail === null) {
      toast.error("Veuillez sélectionner une miniature globale.");
      return;
    }
    let isFormValid = true;
    const titles = [];
    for (let i = 0; i < numSteps; i++) {
      const pageTitle = event.target.elements[`title-${i}`].value.trim();
      console.log(pageTitle);
      if (pageTitle === "") {
        toast.error(`Veuillez saisir un titre pour la page ${i + 1}.`);
        isFormValid = false;
        break;
      }
      titles.push(pageTitle);
    }
    setTitleStep(titles);
    if (isFormValid) {
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setShowForm(true);
    setActiveStep(0);
    setNumSteps(1);
    setEditorStates([]);
    setTitle("");
    setTitleStep([]);
    setSelectedTags([]);
    setThumbnail(null);
  };

  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
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
      >
        <Typography
          variant="h6"
          sx={{
            marginBottom: 4,
          }}
        >
          Création de tutoriel
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
          }}
        >
          <CloseIcon />
        </IconButton>
        <>
          {showForm ? (
            <form onSubmit={handleFormSubmit}>
              <TextField
                type="text"
                label="Titre "
                fullWidth
                InputLabelProps={{ className: "inputLabel" }}
                InputProps={{ className: "input" }}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
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
              <Box marginTop={2}>
                <TextField
                  sx={{ marginBottom: 2 }}
                  id="outlined-search"
                  type="file"
                  onChange={(e) => {
                    setThumbnail(e.target.files[0]);
                    setPreviewImage(URL.createObjectURL(e.target.files[0]));
                  }}
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
                      alt="preview Miniature"
                      src={previewImage}
                    />
                  </>
                )}
              </Box>
              <TextField
                type="number"
                label="Nombre de page"
                value={numSteps}
                onChange={handleNumStepsChange}
                inputProps={{ min: 1, max: 10 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {[...Array(numSteps)].map((_, index) => (
                  <Box key={index} marginTop={2}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      Page {index + 1}
                    </Typography>
                    <TextField
                      type="text"
                      label={`Titre de la page ${index + 1}`}
                      name={`title-${index}`}
                    />
                  </Box>
                ))}
              </Box>

              <Button type="submit" variant="contained" color="primary">
                Commencer le tuto
              </Button>
            </form>
          ) : (
            <Box display="flex">
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                orientation="vertical"
              >
                {editorStates.map((_, index) => (
                  <Step key={index}>
                    <StepLabel> {titleStep[index]}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box marginLeft={2}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {titleStep[activeStep]}
                </Typography>
                <Editor
                  editorState={
                    editorStates[activeStep] || EditorState.createEmpty()
                  }
                  onEditorStateChange={(state) =>
                    setEditorStates((prevStates) => [
                      ...prevStates.slice(0, activeStep),
                      state,
                      ...prevStates.slice(activeStep + 1),
                    ])
                  }
                  toolbar={{
                    options: [
                      "inline",
                      "blockType",
                      "list",
                      "textAlign",
                      "link",
                      "embedded",
                      "image",
                    ],
                    inline: {
                      options: ["bold", "italic", "underline"],
                    },
                    blockType: {
                      options: [
                        "Normal",
                        "H1",
                        "H2",
                        "H3",
                        "H4",
                        "H5",
                        "H6",
                        "Code",
                        "Blockquote",
                      ],
                    },
                    list: {
                      options: ["unordered", "ordered"],
                    },
                    textAlign: {
                      options: ["left", "center", "right", "justify"],
                    },
                    link: {
                      defaultTargetOption: "_blank",
                      showOpenOptionOnHover: true,
                    },
                    embedded: {
                      defaultSize: {
                        height: "auto",
                        width: "auto",
                      },
                    },
                    image: {
                      uploadCallback: handleImageUpload,
                      alt: { present: true, mandatory: true },
                      previewImage: true,
                      inputAccept:
                        "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                    },
                  }}
                />
                <Box marginTop={2}>
                  {activeStep > 0 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handlePrevStep}
                      style={{ marginLeft: "8px" }}
                    >
                      Précédent
                    </Button>
                  )}
                  {activeStep < numSteps - 1 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNextStep}
                      style={{ marginLeft: "8px" }}
                      disabled={
                        !editorStates[activeStep].getCurrentContent().hasText()
                      }
                    >
                      Suivant
                    </Button>
                  )}
                  {activeStep === numSteps - 1 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={newTuto}
                      disabled={
                        !editorStates[activeStep].getCurrentContent().hasText()
                      }
                    >
                      Sauvegarder
                    </Button>
                  )}
                  {/* <Button
                    variant="contained"
                    onClick={handleCancel}
                    style={{ marginLeft: "8px" }}
                  >
                    Annuler
                  </Button> */}
                </Box>
              </Box>
            </Box>
          )}
        </>
      </Box>
    </>
  );

  return (
    <>
      {!loading ? (
        <div>
          <>
            <SwipeableDrawer
              anchor="left"
              open={open}
              onClose={(e) => toggleDrawerModify(e, false)}
              onOpen={(e) => toggleDrawerModify(e, true)}
            >
              {list()}
            </SwipeableDrawer>
          </>
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
