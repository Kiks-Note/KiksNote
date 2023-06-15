import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
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
import ListParticipants from "../../components/blog/ListParticipants";
import "./Blog.css";
import { useTheme } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";

function DetailBlog() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useFirebase();
  const navigate = useNavigate();
  const [visibleComments, setVisibleComments] = useState(5);
  const [isUserParticipant, setIsUserParticipant] = useState(false);

  const theme = useTheme();
  const [height, setHeight] = useState(0);
  const ref = useRef(null);
  const [showParticipants, setShowParticipants] = useState(false);

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

        const blogFront = {
          id: blogDto.id,
          created_at: dateCreation,
          created_by: blogDto.created_by,
          valueMarkdown: blogDto?.valueMarkdown,
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

  useEffect(() => {
    if (data) {
      getBlogParticipant();
    }
  }, [data]);

  console.log("loading : ", loading);
  async function handleParticipate() {
    try {
      await axios
        .put(`http://localhost:5050/blog/${data.id}/participant`, {
          userId: user.id,
        })
        .then(async () => {
          await getBlogParticipant();
        });
    } catch (err) {
      console.log(err);
    }
  }

  async function getBlogParticipant() {
    console.log("getBlogParticipant");
    try {
      await axios
        .get(`http://localhost:5050/blog/${data?.id}/participant`)
        .then((res) => {
          console.log("res.data : ", res.data);
          if (res.data.length > 0) {
            console.log("ya res.data");
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i] === user.id) {
                setIsUserParticipant(true);
                break;
              } else {
                setIsUserParticipant(false);
              }
            }
          } else {
            setIsUserParticipant(false);
          }
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

  const handleShowParticipants = () => {
    setShowParticipants(!showParticipants);
  };

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [showParticipants]);
  console.log(theme.palette.background.paper);
  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!loading ? (
          <>
            <Box sx={{ width: "100%", mb: 2, ml: 2 }}>
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
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography variant="h3">{data?.title}</Typography>
              <Box
                sx={{ p: 1, width: "100%", display: "flex", height: "100%" }}
                ref={ref}
              >
                {/*<div data-color-mode="dark">*/}
                {/*  <div className="wmde-markdown-var"> </div>*/}
                <MDEditor.Markdown
                  source={data?.valueMarkdown}
                  style={{
                    padding: 10,
                    // ...{
                    //   backgroundColor: theme.palette.background.paper,
                    //   color: theme.palette.text.primary,
                    // },
                  }}
                  // data-color-mode="dark"
                />
                {/*</div>*/}
                {showParticipants && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      overflowY: "auto",
                      height: height,
                      width: { lg: "30%", md: "60%", xs: "100%" },
                    }}
                  >
                    {data?.participant?.length !== 0 ? (
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="h5">
                          Liste des participants
                        </Typography>
                        <ListParticipants participants={data?.participant} />
                      </Box>
                    ) : (
                      <Typography variant="h5" sx={{ ml: 1 }}>
                        Aucun participant
                      </Typography>
                    )}
                  </Box>
                )}
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
                      data?.userLiked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />
                    }
                    onClick={handleLike}
                    sx={{
                      backgroundColor: data?.userLiked ? "#00BFFF" : "#F5F5F5",
                      color: data?.userLiked ? "#FFFFFF" : "#000000",
                      ":hover": {
                        backgroundColor: data?.userLiked
                          ? "#0080FF"
                          : "#EEEEEE",
                      },
                      mr: 3,
                    }}
                  >
                    J'aime ({data?.like?.length})
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={
                      data?.userDisliked ? (
                        <ThumbDownAltIcon />
                      ) : (
                        <ThumbDownOffAltIcon />
                      )
                    }
                    onClick={handleDislike}
                    sx={{
                      backgroundColor: data?.userDisliked
                        ? "#FF0000"
                        : "#F5F5F5",
                      color: data?.userDisliked ? "#FFFFFF" : "#000000",
                      ":hover": {
                        backgroundColor: data?.userDisliked
                          ? "#CC0000"
                          : "#EEEEEE",
                      },
                    }}
                  >
                    J'aime pas ({data?.dislike.length})
                  </Button>
                  {data?.type === "event" && (
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleParticipate}
                        sx={{
                          backgroundColor: data?.userIsParticipant
                            ? "#008000"
                            : "#F5F5F5",
                          color: data?.userIsParticipant
                            ? "#FFFFFF"
                            : "#000000",
                          ":hover": {
                            backgroundColor: data?.userIsParticipant
                              ? "#006400"
                              : "#EEEEEE",
                          },
                          mx: 3,
                        }}
                      >
                        {isUserParticipant
                          ? "Ne pas participé "
                          : "Je participe"}
                      </Button>
                      <Button
                        onClick={handleShowParticipants}
                        variant="contained"
                        size="small"
                      >
                        Participants
                      </Button>
                    </>
                  )}
                </Box>
                <CreateComment tutoId={id} />
              </Box>
              <Box sx={{ width: "100%" }}>
                {data &&
                  data?.comment &&
                  Array.isArray(data?.comment) &&
                  data?.comment
                    .slice(0, visibleComments)
                    .map((comment, index) => (
                      <DisplayComment
                        key={index}
                        comment={comment}
                        tutoId={id}
                      />
                    ))}
                {visibleComments < data?.comment.length ? (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      my: 3,
                    }}
                  >
                    <Button onClick={handleShowMore} sx={{ mr: 4 }}>
                      Voir plus
                    </Button>
                    {visibleComments > 5 && (
                      <Button onClick={handleShowLess}>Voir moins</Button>
                    )}
                  </Box>
                ) : (
                  visibleComments > 5 && (
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        my: 3,
                      }}
                    >
                      <Button onClick={handleShowLess}>Voir moins</Button>
                    </Box>
                  )
                )}
              </Box>
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

export default DetailBlog;
