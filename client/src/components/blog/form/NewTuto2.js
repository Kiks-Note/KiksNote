import axios from "axios";
import React, {useEffect, useState} from "react";
import {
  Box,
  SwipeableDrawer,
  Drawer,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import {Rings} from "react-loader-spinner";
import {Typography} from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import {EditorState} from "draft-js";
import {toast} from "react-hot-toast";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Markdown from "./Markdown";
import MDEditor, {commands} from "@uiw/react-md-editor";
import useFirebase from "../../../hooks/useFirebase";
import {da} from "date-fns/locale";
import Autocomplete from "@mui/material/Autocomplete";

export default function NewTuto2({open, toggleDrawerModify}) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [numSteps, setNumSteps] = useState(1);
  const [editorStates, setEditorStates] = useState([]);
  const [titleStep, setTitleStep] = useState([]);
  const [valueMarkdown, setValueMarkdown] = useState("**Hello world!!!**");
  const [markdownStepsInfo, setMarkdownStepsInfo] = useState([]);
  const {user} = useFirebase();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_API}/blog/tag`
      );
      const tags = response.data;
      setTags(tags);
    } catch (error) {
      console.error("Erreur lors de la récupération des tags :", error);
    }
  };
  useEffect(() => {
    fetchTags();
    setLoading(false);
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!title) {
      toast.error("Veuillez entrer un titre");
      return;
    }

    if (title.trim() === "") {
      toast.error("Veuillez entrer un titre");
      return;
    }

    if (description === null) {
      toast.error("Veuillez entrer une courte description.");
      return;
    }

    if (description.trim() === "") {
      toast.error("Veuillez entrer une courte description.");
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
      // console.log(pageTitle);
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
      console.log("Form submitted");
    }
  };
  // console.log("TitleStep:", titleStep);

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

  const handleCancel = () => {
    setShowForm(true);
    setActiveStep(0);
    setNumSteps(1);
    setEditorStates([]);
    setTitle("");
    setDescription("");
    setTitleStep([]);
    setSelectedTags([]);
    setThumbnail(null);
    setMarkdownStepsInfo([]);
    setCompleted({});
    setPreviewImage("");
    setValueMarkdown("**Hello world!!!**");
  };

  //steper part ------------------------------------------------------------------------

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return titleStep.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          titleStep.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    // console.log("valueMarkdown : ", valueMarkdown);
    setMarkdownStepsInfo(markdownStepsInfo.concat(valueMarkdown));
    setValueMarkdown("");
    handleNext();
  };

  // console.log("markdownStepsInfo : ", markdownStepsInfo);
  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    newTuto2();
  };

  const help = {
    name: "help",
    keyCommand: "help",
    buttonProps: {"aria-label": "Insert help"},
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

  const newTuto2 = async (e) => {
    let statut = "online";
    let visibility = "public";
    if (user.status === "etudiant") {
      statut = "pending";
      visibility = "pending";
    }
    const data = {
      title: title,
      description: description,
      tags: selectedTags,
      markdownStepsInfo: markdownStepsInfo,
      titleStep: titleStep,
      visibility: visibility,
      statut: statut,
      created_by: user.id,
    };
    // console.log("data : ", data);
    const formData = new FormData();
    formData.append("thumbnail", thumbnail);
    formData.append("tutoData", JSON.stringify(data));
    try {
      const response = await axios.post(
        `http${process.env.REACT_APP_SERVER_API}/blog/tuto`,
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
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const tutoInfo = () => (
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
        <Typography variant="h6">Création de tutoriel</Typography>
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
        {showForm ? (
          <form onSubmit={handleFormSubmit} style={{width: "80%"}}>
            <TextField
              type="text"
              label="Titre"
              fullWidth
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              sx={{mb: 2}}
            />
            <TextField
              type="text"
              label="Description"
              fullWidth
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              sx={{mb: 2}}
            />
            <Autocomplete
              sx={{mb: 2}}
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
            <TextField
              type="number"
              label="Nombre de parties"
              value={numSteps}
              onChange={handleNumStepsChange}
              inputProps={{min: 1, max: 10}}
              sx={{width: 150}}
            />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {[...Array(numSteps)].map((_, index) => (
                <Box key={index} sx={{m: 2}}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Partie {index + 1}
                  </Typography>
                  <TextField
                    type="text"
                    label={`Titre de la partie ${index + 1}`}
                    name={`title-${index}`}
                  />
                </Box>
              ))}
            </Box>
            <Box marginTop={2}>
              <TextField
                sx={{marginBottom: 2}}
                id="outlined-search"
                type="file"
                accept="image/png, image/jpeg"
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
                      maxHeight: {xs: 233, md: 167},
                      maxWidth: {xs: 350, md: 250},
                    }}
                    alt="preview Miniature"
                    src={previewImage}
                  />
                </>
              )}
            </Box>
            <Button type="submit" variant="contained" color="primary">
              Commencer le tuto
            </Button>
          </form>
        ) : (
          <Box sx={{width: "100%"}}>
            <Stepper nonLinear activeStep={activeStep}>
              {titleStep.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <div>
              {allStepsCompleted() ? (
                <>
                  <Typography sx={{mt: 2, mb: 1}}>
                    Vous avez terminé de créer votre tutoriel, cliquez sur
                    publier pour le mettre en ligne
                  </Typography>
                  <Box sx={{display: "flex", flexDirection: "row", pt: 2}}>
                    <Box sx={{flex: "1 1 auto"}} />
                    <Button onClick={handleCancel}>Recommencer</Button>
                    <Button onClick={handleReset}>Publier</Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography sx={{mt: 2, mb: 1, py: 1}}>
                    Étape {activeStep + 1} {titleStep[activeStep]}
                    <div data-color-mode="light">
                      <MDEditor
                        value={valueMarkdown}
                        // preview="split"
                        commands={[...commands.getCommands(), help]}
                        onChange={(val) => setValueMarkdown(val)}
                      />
                    </div>
                  </Typography>
                  <Box sx={{display: "flex", flexDirection: "row", pt: 2}}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{mr: 1}}
                    >
                      Précédent
                    </Button>
                    <Box sx={{flex: "1 1 auto"}} />
                    <Button onClick={handleNext} sx={{mr: 1}}>
                      Suivant
                    </Button>
                    {activeStep !== titleStep.length &&
                      (completed[activeStep] ? (
                        <Typography
                          variant="caption"
                          sx={{display: "inline-block"}}
                        >
                          Étape {activeStep + 1} déjà complétée
                        </Typography>
                      ) : (
                        <Button onClick={handleComplete}>
                          {completedSteps() === totalSteps() - 1
                            ? "Terminer le tutoriel"
                            : "Terminer l'étape"}
                        </Button>
                      ))}
                  </Box>
                </>
              )}
            </div>
          </Box>
        )}
      </Box>
    </>
  );

  return (
    <>
      {!loading ? (
        <>
          <Drawer
            anchor="right"
            open={open}
            onClose={(e) => toggleDrawerModify(e, false)}
            onOpen={(e) => toggleDrawerModify(e, true)}
            {...{PaperProps: {style: {width: "90%"}}}}
          >
            {tutoInfo()}
          </Drawer>
        </>
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
