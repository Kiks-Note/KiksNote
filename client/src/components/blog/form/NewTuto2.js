import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Box,
  SwipeableDrawer,
  Drawer,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Rings } from "react-loader-spinner";
import { Typography } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import { EditorState } from "draft-js";
import { toast } from "react-hot-toast";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Markdown from "./Markdown";
import MDEditor, { commands } from "@uiw/react-md-editor";
import useFirebase from "../../../hooks/useFirebase";
import { da } from "date-fns/locale";

export default function NewTuto2({ open, toggleDrawerModify }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [numSteps, setNumSteps] = useState(1);
  const [editorStates, setEditorStates] = useState([]);
  const [titleStep, setTitleStep] = useState([]);
  const [valueMarkdown, setValueMarkdown] = useState("**Hello world!!!**");
  const [markdownStepsInfo, setMarkdownStepsInfo] = useState([]);
  const { user } = useFirebase();

  const [title, setTitle] = useState("");
  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:5050/blog/tag");
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
    // setDescription("");
    setTitleStep([]);
    // setSelectedTags([]);
    // setThumbnail(null);
    setMarkdownStepsInfo([]);
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
    console.log("valueMarkdown : ", valueMarkdown);
    setMarkdownStepsInfo(markdownStepsInfo.concat(valueMarkdown));
    setValueMarkdown("");
    handleNext();
  };

  // console.log("markdownStepsInfo : ", markdownStepsInfo);
  const handleReset = () => {
    console.log("envoie");
    console.log("markdownStepsInfo : ", markdownStepsInfo);
    setActiveStep(0);
    setCompleted({});
    newTuto2();
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

  const newTuto2 = async (e) => {
    let statut = "online";
    let visibility = "public";
    if (user.status === "etudiant") {
      statut = "pending";
      visibility = "pending";
    }
    const data = {
      title: title,
      // description: description,
      // tags: selectedTags,
      // thumbnail: thumbnail,
      markdownStepsInfo: markdownStepsInfo,
      visibility: visibility,
      statut: statut,
      created_by: user.id,
    };
    console.log("data : ", data);
    // const formData = new FormData();
    // formData.append("tutoData", JSON.stringify(data));
    try {
      const response = await axios.post(
        "http://localhost:5050/blog/tuto",
        data
      );
      toast.success("Tuto crée avec succès");
      toggleDrawerModify(e, false);
      handleCancel();
      console.log(response.data);
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
          <form onSubmit={handleFormSubmit}>
            <TextField
              type="text"
              label="Titre"
              fullWidth
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              type="number"
              label="Nombre de parties"
              value={numSteps}
              onChange={handleNumStepsChange}
              inputProps={{ min: 1, max: 10 }}
              sx={{ width: 150 }}
            />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {[...Array(numSteps)].map((_, index) => (
                <Box key={index} sx={{ m: 2 }}>
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
            <Button type="submit" variant="contained" color="primary">
              Commencer le tuto
            </Button>
          </form>
        ) : (
          <Box sx={{ width: "100%" }}>
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
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleReset}>Upload</Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                    Step {activeStep + 1} {titleStep[activeStep]}
                    <MDEditor
                      value={valueMarkdown}
                      // preview="split"
                      commands={[...commands.getCommands(), help]}
                      onChange={(val) => setValueMarkdown(val)}
                    />
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleNext} sx={{ mr: 1 }}>
                      Next
                    </Button>
                    {activeStep !== titleStep.length &&
                      (completed[activeStep] ? (
                        <Typography
                          variant="caption"
                          sx={{ display: "inline-block" }}
                        >
                          Step {activeStep + 1} already completed
                        </Typography>
                      ) : (
                        <Button onClick={handleComplete}>
                          {completedSteps() === totalSteps() - 1
                            ? "Finish"
                            : "Complete Step"}
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
            {...{ PaperProps: { style: { width: "90%" } } }}
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
