import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import DisplayComment from "../../components/blog/DisplayComment";
import CreateComment from "../../components/blog/CreateComment";
import { w3cwebsocket } from "websocket";
import useFirebase from "../../hooks/useFirebase";
import { Rings } from "react-loader-spinner";
import "./Blog.css";
import MDEditor from "@uiw/react-md-editor";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import "./Blog.css";

function DetailTuto() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useFirebase();
  const navigate = useNavigate();
  const [visibleComments, setVisibleComments] = useState(5);

  const handleShowMore = () => {
    setVisibleComments(visibleComments + 5);
  };

  const handleShowLess = () => {
    setVisibleComments(visibleComments - 5);
  };

  useEffect(() => {
    const ws = new w3cwebsocket(
      `${process.env.REACT_APP_SERVER_API_WS}/blogDetail`
    );
    ws.onopen = function (e) {
      ws.send(JSON.stringify(id));
    };

    ws.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer[0]) {
        var blogDto = dataFromServer[0];

        const dateOptions = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
        const dateCreation = new Date(
          blogDto.created_at._seconds * 1000 +
            blogDto.created_at._nanoseconds / 100000
        ).toLocaleString("fr", dateOptions);
        const userLiked = blogDto.like.includes(user.id);
        const userDisliked = blogDto.dislike.includes(user.id);
        const userIsParticipant = blogDto.participant.includes(user.id);

        // console.log(blogDto.participant);
        const blogFront = {
          id: blogDto.id,
          created_at: dateCreation,
          created_by: blogDto.created_by,
          inputEditorState: blogDto.inputEditorState,
          participant: blogDto.participant,
          comment: blogDto.comment,
          statut: blogDto.statut,
          thumbnail: blogDto.thumbnail,
          title: blogDto.title,
          description: blogDto.description,
          updated_at: blogDto.updated_at,
          like: blogDto.like,
          dislike: blogDto.dislike,
          userLiked: userLiked,
          userDisliked: userDisliked,
          userIsParticipant: userIsParticipant,
          markdownStepsInfo: blogDto.markdownStepsInfo,
          titleStep: blogDto.titleStep,
          type: blogDto.type,
          tag: blogDto.tag,
          info_creator: blogDto.info_creator,
        };
        setData(blogFront);
        setLoading(false);
      } else {
        navigate("/404erreur");
      }
    };
  }, []);
  async function handleParticipate() {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_API}/blog/${data.id}/participant`,
        {
          userId: user.id,
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function handleLike() {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_API}/blog/${data.id}/like`,
        {
          userId: user.id,
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDislike() {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_API}/blog/${data.id}/dislike`,
        {
          userId: user.id,
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  // stepper

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const steps = data?.titleStep;

  const totalSteps = () => {
    return steps.length;
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
          steps.findIndex((step, i) => !(i in completed))
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
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <>
      <Box
        sx={{
          margin: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!loading ? (
          <>
            <Box sx={{ width: "100%", mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => {
                  navigate(-1);
                }}
                sx={{ marginTop: 2 }}
              >
                Retour À la page de blog
              </Button>
            </Box>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                p: 2,
                // backgroundColor: "red",
              }}
            >
              <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
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
                      Vous avez terminé le tutoriel !
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleReset}>Recommencer</Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box sx={{ m: 3 }}>
                      <div data-color-mode="light">
                        <MDEditor.Markdown
                          source={data.markdownStepsInfo[activeStep]}
                          style={{
                            padding: 10,
                            // ...{
                            //   backgroundColor: theme.palette.background.paper,
                            //   color: theme.palette.text.primary,
                            // },
                          }}
                        />
                      </div>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Précédent
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleNext} sx={{ mr: 1 }}>
                        Suivant
                      </Button>
                      {activeStep !== steps.length &&
                        (completed[activeStep] ? (
                          <Typography
                            variant="caption"
                            sx={{ display: "inline-block" }}
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                px: 2,
                my: 2,
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Button
                  variant="contained"
                  startIcon={
                    data.userLiked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />
                  }
                  onClick={handleLike}
                  sx={{
                    backgroundColor: data.userLiked ? "#00BFFF" : "#F5F5F5",
                    color: data.userLiked ? "#FFFFFF" : "#000000",
                    ":hover": {
                      backgroundColor: data.userLiked ? "#0080FF" : "#EEEEEE",
                    },
                    mr: 3,
                  }}
                >
                  J'aime ({data.like.length})
                </Button>
                <Button
                  variant="contained"
                  startIcon={
                    data.userDisliked ? (
                      <ThumbDownAltIcon />
                    ) : (
                      <ThumbDownOffAltIcon />
                    )
                  }
                  onClick={handleDislike}
                  sx={{
                    backgroundColor: data.userDisliked ? "#FF0000" : "#F5F5F5",
                    color: data.userDisliked ? "#FFFFFF" : "#000000",
                    ":hover": {
                      backgroundColor: data.userDisliked
                        ? "#CC0000"
                        : "#EEEEEE",
                    },
                  }}
                >
                  J'aime pas ({data.dislike.length})
                </Button>
              </Box>
              <CreateComment tutoId={id} />
            </Box>
            <Box sx={{ width: "100%" }}>
              {data &&
                data.comment &&
                Array.isArray(data.comment) &&
                data.comment
                  .slice(0, visibleComments)
                  .map((comment, index) => (
                    <DisplayComment key={index} comment={comment} tutoId={id} />
                  ))}
              {visibleComments < data.comment.length ? (
                <>
                  <button onClick={handleShowMore}>Voir plus</button>
                  {visibleComments > 5 && (
                    <button onClick={handleShowLess}>Voir moins</button>
                  )}
                </>
              ) : (
                visibleComments > 5 && (
                  <button onClick={handleShowLess}>Voir moins</button>
                )
              )}
            </Box>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70%",
            }}
          >
            <Rings
              height="200"
              width="200"
              color="#00BFFF"
              radius="6"
              wrapperStyle={{}}
              wrapperClass="loader"
              visible={true}
              ariaLabel="rings-loading"
            />
          </div>
        )}
      </Box>
    </>
  );
}

export default DetailTuto;
