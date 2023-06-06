import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, CardHeader, CardMedia, CardContent, Typography, Button } from "@mui/material";
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

function DetailBlog() {
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

        var datat = JSON.parse(dataFromServer[0].editorState);
        const contentState = convertFromRaw(datat);
        const text = contentState.getPlainText();
        console.log(blogDto.participant);
        const blogFront = {
          id: blogDto.id,
          created_at: dateCreation,
          created_by: blogDto.created_by,
          editorState: text,
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
  return (
    <>
      <Box
        sx={{
          margin: 2,
          width: "100%",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#FFFFFF",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!loading ? (
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
                      startIcon={data.userLiked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                      onClick={handleLike}
                      sx={{
                        backgroundColor: data.userLiked ? "#00BFFF" : "#F5F5F5",
                        color: data.userLiked ? "#FFFFFF" : "#000000",
                        ":hover": {
                          backgroundColor: data.userLiked ? "#0080FF" : "#EEEEEE",
                        },
                      }}
                    >
                      J'aime ({data.like.length})
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={data.userDisliked ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
                      onClick={handleDislike}
                      sx={{
                        backgroundColor: data.userDisliked ? "#FF0000" : "#F5F5F5",
                        color: data.userDisliked ? "#FFFFFF" : "#000000",
                        ":hover": {
                          backgroundColor: data.userDisliked ? "#CC0000" : "#EEEEEE",
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
                          backgroundColor: data.userIsParticipant ? "#008000" : "#F5F5F5",
                          color: data.userIsParticipant ? "#FFFFFF" : "#000000",
                          ":hover": {
                            backgroundColor: data.userIsParticipant ? "#006400" : "#EEEEEE",
                          },
                        }}
                      >
                        {data.userIsParticipant ? "Je participe" : "Ne participe pas"}
                      </Button>
                    )}
                  </div>
                  <br />
                  <CreateComment tutoId={id} />
                  {data &&
                    data.comment &&
                    Array.isArray(data.comment) &&
                    data.comment.slice(0, visibleComments).map((comment, index) => (
                      <DisplayComment key={index} comment={comment} tutoId={id} />
                    ))}
                  {visibleComments < data.comment.length ? (
                    <>
                      <button onClick={handleShowMore}>Voir plus</button>
                      {visibleComments > 5 && <button onClick={handleShowLess}>Voir moins</button>}
                    </>
                  ) : (
                    visibleComments > 5 && <button onClick={handleShowLess}>Voir moins</button>
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
                Retour à la page de blog
              </Button>
            </Grid>
          </Grid>
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
