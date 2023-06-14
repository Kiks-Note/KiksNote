import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import DisplayComment from "../../components/blog/DisplayComment";
import CreateComment from "../../components/blog/CreateComment";
import { w3cwebsocket } from "websocket";
import useFirebase from "../../hooks/useFirebase";
import { Rings } from "react-loader-spinner";
import { convertFromRaw } from "draft-js";
import ListParticipants from "../../components/blog/ListParticipants";
import "./Blog.css";
import { Grid } from "@mui/material";
import MDEditor, { commands } from "@uiw/react-md-editor";
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
    const ws = new w3cwebsocket("ws://localhost:5050/blogDetail");
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

        // var datat = JSON.parse(dataFromServer[0].editorState);
        // const contentState = convertFromRaw(datat);
        // const text = contentState.getPlainText();
        console.log(blogDto.participant);
        const blogFront = {
          id: blogDto.id,
          created_at: dateCreation,
          created_by: blogDto.created_by,
          // editorState: text,
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
      await axios.put(`http://localhost:5050/blog/${data.id}/participant`, {
        userId: user.id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleLike() {
    try {
      await axios.put(`http://localhost:5050/blog/${data.id}/like`, {
        userId: user.id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDislike() {
    try {
      await axios.put(`http://localhost:5050/blog/${data.id}/dislike`, {
        userId: user.id,
      });
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
          // height: "95vh",
          // borderRadius: "10px",
          // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          // backgroundColor: "#FFFFFF",
          // padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // backgroundColor: "green",
        }}
      >
        {!loading ? (
          /*
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <div className="container_detail_blog">
                                <div className="detail_blog_content">
                                    <Card>
                                        <CardHeader title={data.title} />
                                        <CardMedia
                                            component="img"
                                            src={data.thumbnail}
                                            alt={data.title}
                                            sx={{ width: 300, height: 200 }}
                                        />
                                        <CardContent>
                                            <Typography>{data.editorState}</Typography>
                                        </CardContent>
                                    </Card>
                                    <div className="options">
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
                                                    backgroundColor: data.userLiked
                                                        ? "#0080FF"
                                                        : "#EEEEEE",
                                                },
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
                                                backgroundColor: data.userDisliked
                                                    ? "#FF0000"
                                                    : "#F5F5F5",
                                                color: data.userDisliked ? "#FFFFFF" : "#000000",
                                                ":hover": {
                                                    backgroundColor: data.userDisliked
                                                        ? "#CC0000"
                                                        : "#EEEEEE",
                                                },
                                                marginRight: 50,
                                            }}
                                        >
                                            J'aime pas ({data.dislike.length})
                                        </Button>
                                        {data.type === "blog" && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={handleParticipate}
                                                sx={{
                                                    backgroundColor: data.userIsParticipant
                                                        ? "#008000"
                                                        : "#F5F5F5",
                                                    color: data.userIsParticipant ? "#FFFFFF" : "#000000",
                                                    ":hover": {
                                                        backgroundColor: data.userIsParticipant
                                                            ? "#006400"
                                                            : "#EEEEEE",
                                                    },
                                                }}
                                            >
                                                {data.userIsParticipant
                                                    ? "Je participe"
                                                    : "Ne participe pas"}
                                            </Button>
                                        )}
                                    </div>
                                    <br />
                                    <CreateComment tutoId={id} />
                                    {data &&
                                        data.comment &&
                                        Array.isArray(data.comment) &&
                                        data.comment
                                            .slice(0, visibleComments)
                                            .map((comment, index) => (
                                                <DisplayComment
                                                    key={index}
                                                    comment={comment}
                                                    tutoId={id}
                                                />
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
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <div className="detail_blog_content_list">
                                {data.participant.length !== 0 && (
                                    <>
                                        <Typography variant="h5">Liste des participants</Typography>
                                        <ListParticipants participants={data.participant} />
                                    </>
                                )}
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    window.history.back();
                                }}
                                sx={{ marginTop: 2 }}
                            >
                                Retour Ã la page de blog
                            </Button>
                        </Grid>
                    </Grid>
                    */
          <>
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
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleReset}>Upload</Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box sx={{ m: 3 }}>
                      <MDEditor.Markdown
                        source={data.markdownStepsInfo[activeStep]}
                      />
                    </Box>
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
                      {activeStep !== steps.length &&
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

            {/*<h1>detail Tuto</h1>*/}
            {/*<h1>{data.title}</h1>*/}
            {/*<h1>{data.markdownStepsInfo}</h1>*/}
            {/*<MDEditor.Markdown source={data.markdownStepsInfo[1]} />*/}
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
