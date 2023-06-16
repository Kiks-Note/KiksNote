import React, { useEffect, useState } from "react";
import CardBlog from "../../components/blog/CardBlog";
import { Box, Grid, Button } from "@mui/material";
import { w3cwebsocket } from "websocket";
import { Toaster } from "react-hot-toast";
import { Rings } from "react-loader-spinner";
import useFirebase from "../../hooks/useFirebase";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { useTheme } from "@mui/material/styles";
import TopCreatorsChart from "../../components/blog/TopCreator.js";
import MostParticipantsChart from "../../components/blog/TopEvent.js";
import SplitButtonChoice from "../../components/blog/SplitButtonChoice";
import "./Blog.css";
import BlogRepartition from "../../components/blog/Repartition.js";
import { useSnapCarousel } from "react-snap-carousel";
import axios from "axios";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function Blog() {
  const theme = useTheme();
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useFirebase();
  const [tags, setTags] = useState([]);

  const stats = [
    {
      label: "Top 10 des créateurs d'articles",
      component: <TopCreatorsChart />,
    },
    {
      label: "Top des élèves avec le plus de participation",
      component: <MostParticipantsChart />,
    },
    {
      label: "Répartition entre les tutoriels et les blogs",
      component: <BlogRepartition />,
    },
  ];
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  useEffect(() => {
    const ws = new w3cwebsocket("ws://localhost:5050/blog");

    ws.onopen = function (e) {
      console.log("[open] Connection established");
      console.log("Sending to server");
    };

    ws.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      var blogs = dataFromServer;
      var allBlogs = [];
      const dateOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      blogs.forEach((blog) => {
        const dateCreation = new Date(
          blog.created_at._seconds * 1000 +
          blog.created_at._nanoseconds / 100000
        ).toLocaleString("fr", dateOptions);
        const userLiked = blog.like.includes(user.id);
        const userDisliked = blog.dislike.includes(user.id);
        const userIsParticipant = blog.participant.includes(user.id);
        const blogFront = {
          id: blog.id,
          created_at: dateCreation,
          created_by: blog.created_by,
          editorState: blog.editorState,
          inputEditorState: blog.inputEditorState,
          participant: blog.participant,
          comment: blog.comment,
          statut: blog.statut,
          thumbnail: blog.thumbnail,
          title: blog.title,
          description: blog.description,
          updated_at: blog.updated_at,
          like: blog.like,
          dislike: blog.dislike,
          userLiked: userLiked,
          userDisliked: userDisliked,
          userIsParticipant: userIsParticipant,
          type: blog.type,
          tag: blog.tag,
          info_creator: blog.info_creator,
          visibility: blog.visibility,
        };
        allBlogs.push(blogFront);
      });

      setBlog(allBlogs);
      fetchTags();
      setLoading(false);
    };
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

  // test for sort by date
  blog.sort((a, b) => b.created_at.localeCompare(a.created_at)); // sort by date

  const AdvancedCarouselPending = () => {
    const { scrollRef, pages, activePageIndex, next, prev, goTo } =
      useSnapCarousel();
    return (
      <Box sx={{ mt: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            En attente de validation
          </Typography>
        </Box>
        <ul
          ref={scrollRef}
          style={{
            display: "flex",
            overflow: "auto",
            scrollSnapType: "x mandatory",
          }}
        >
          {blog
            .filter((blog) =>
              user.status !== "etudiant"
                ? blog.visibility === "pending"
                : user.email === blog.created_by
                  ? blog.visibility === "pending"
                  : undefined
            )
            .map((filtered) => (
              <Box
                sx={{
                  // backgroundColor: "aqua",
                  fontSize: "50px",
                  width: 450,
                  height: "auto",
                  flexShrink: 0,
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 2,
                  mx: 1,
                }}
              >
                <CardBlog blog={filtered} key={filtered.id} tags={tags} />
                {/*<Typography>{user.email}</Typography>*/}
                {/*<Typography>{filtered.created_by}</Typography>*/}
                {/*<Typography>{filtered.visibility}</Typography>*/}
              </Box>
            ))}
        </ul>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button onClick={() => prev()}>
            <KeyboardArrowLeft />
          </Button>
          <ol style={{ display: "flex", padding: "0px" }}>
            {pages.map((_, i) => (
              <li key={i} style={{ listStyle: "none" }}>
                <button
                  onClick={() => goTo(i)}
                  color="red"
                  style={{
                    transition: "opacity 100ms ease-out",
                    opacity: i !== activePageIndex ? 0.5 : 1,
                    display: "inline-block",
                    padding: "6px",
                    margin: "5px",
                    backgroundColor: "#374151",
                    borderRadius: "50%",
                    cursor: "pointer",
                    border: "none",
                  }}
                ></button>
              </li>
            ))}
          </ol>
          <Button onClick={() => next()}>
            <KeyboardArrowRight />
          </Button>
        </Box>
      </Box>
    );
  };

  const AdvancedCarouselTuto = () => {
    const { scrollRef, pages, activePageIndex, next, prev, goTo } =
      useSnapCarousel();
    return (
      <Box sx={{ mt: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Tuto
          </Typography>
        </Box>
        <ul
          ref={scrollRef}
          style={{
            display: "flex",
            overflow: "auto",
            scrollSnapType: "x mandatory",
          }}
        >
          {blog
            .filter((blog) => blog.type === "tuto")
            .filter((blog) => blog.visibility === "public").length > 0 ? (
            blog
              .filter((blog) => blog.type === "tuto")
              .filter((blog) => blog.visibility === "public")
              .map((filtered) => (
                <Box
                  sx={{
                    // backgroundColor: "aqua",
                    fontSize: "50px",
                    width: 450,
                    height: "auto",
                    flexShrink: 0,
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 2,
                    mx: 1,
                  }}
                >
                  <CardBlog blog={filtered} key={filtered.id} tags={tags} />
                  {/*<Typography>{user.email}</Typography>*/}
                  {/*<Typography>{filtered.created_by}</Typography>*/}
                  {/*<Typography>{filtered.visibility}</Typography>*/}
                </Box>
              ))
          ) : (
            <Box>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Pas de tuto disponible
              </Typography>
            </Box>
          )}
        </ul>
        {blog
          .filter((blog) => blog.type === "tuto")
          .filter((blog) => blog.visibility === "public").length > 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button onClick={() => prev()}>
              <KeyboardArrowLeft />
            </Button>
            <ol style={{ display: "flex", padding: "0px" }}>
              {pages.map((_, i) => (
                <li key={i} style={{ listStyle: "none" }}>
                  <button
                    onClick={() => goTo(i)}
                    color="red"
                    style={{
                      transition: "opacity 100ms ease-out",
                      opacity: i !== activePageIndex ? 0.5 : 1,
                      display: "inline-block",
                      padding: "6px",
                      margin: "5px",
                      backgroundColor: "#374151",
                      borderRadius: "50%",
                      cursor: "pointer",
                      border: "none",
                    }}
                  ></button>
                </li>
              ))}
            </ol>
            <Button onClick={() => next()}>
              <KeyboardArrowRight />
            </Button>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    );
  };

  const AdvancedCarouselBlog = () => {
    const { scrollRef, pages, activePageIndex, next, prev, goTo } =
      useSnapCarousel();
    return (
      <Box sx={{ mt: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Blog
          </Typography>
        </Box>
        <ul
          ref={scrollRef}
          style={{
            display: "flex",
            overflow: "auto",
            scrollSnapType: "x mandatory",
          }}
        >
          {blog
            .filter((blog) => blog.type === "blog")
            .filter((blog) => blog.visibility === "public").length > 0 ? (
            blog
              .filter((blog) => blog.type === "blog")
              .filter((blog) => blog.visibility === "public")
              .map((filtered) => (
                <Box
                  sx={{
                    // backgroundColor: "aqua",
                    fontSize: "50px",
                    width: 450,
                    height: "auto",
                    flexShrink: 0,
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 2,
                    mx: 1,
                  }}
                >
                  <CardBlog blog={filtered} key={filtered.id} tags={tags} />
                  {/*<Typography>{user.email}</Typography>*/}
                  {/*<Typography>{filtered.created_by}</Typography>*/}
                  {/*<Typography>{filtered.visibility}</Typography>*/}
                </Box>
              ))
          ) : (
            <Box>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Pas de blog disponible
              </Typography>
            </Box>
          )}
        </ul>
        {blog
          .filter((blog) => blog.type === "blog")
          .filter((blog) => blog.visibility === "public").length > 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button onClick={() => prev()}>
              <KeyboardArrowLeft />
            </Button>
            <ol style={{ display: "flex", padding: "0px" }}>
              {pages.map((_, i) => (
                <li key={i} style={{ listStyle: "none" }}>
                  <button
                    onClick={() => goTo(i)}
                    color="red"
                    style={{
                      transition: "opacity 100ms ease-out",
                      opacity: i !== activePageIndex ? 0.5 : 1,
                      display: "inline-block",
                      padding: "6px",
                      margin: "5px",
                      backgroundColor: "#374151",
                      borderRadius: "50%",
                      cursor: "pointer",
                      border: "none",
                    }}
                  ></button>
                </li>
              ))}
            </ol>
            <Button onClick={() => next()}>
              <KeyboardArrowRight />
            </Button>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    );
  };

  const AdvancedCarouselEvent = () => {
    const { scrollRef, pages, activePageIndex, next, prev, goTo } =
      useSnapCarousel();
    return (
      <Box sx={{ mt: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Évenements
          </Typography>
        </Box>
        <ul
          ref={scrollRef}
          style={{
            display: "flex",
            overflow: "auto",
            scrollSnapType: "x mandatory",
          }}
        >
          {blog
            .filter((blog) => blog.type === "event")
            .filter((blog) => blog.visibility === "public").length > 0 ? (
            blog
              .filter((blog) => blog.type === "event")
              .filter((blog) => blog.visibility === "public")
              .map((filtered) => (
                <Box
                  sx={{
                    // backgroundColor: "aqua",
                    fontSize: "50px",
                    width: 450,
                    height: "auto",
                    flexShrink: 0,
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 2,
                    mx: 1,
                  }}
                >
                  <CardBlog blog={filtered} key={filtered.id} tags={tags} />
                  {/*<Typography>{user.email}</Typography>*/}
                  {/*<Typography>{filtered.created_by}</Typography>*/}
                  {/*<Typography>{filtered.visibility}</Typography>*/}
                </Box>
              ))
          ) : (
            <Box>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Pas d'événement disponible
              </Typography>
            </Box>
          )}
        </ul>
        {blog
          .filter((blog) => blog.type === "event")
          .filter((blog) => blog.visibility === "public").length > 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button onClick={() => prev()}>
              <KeyboardArrowLeft />
            </Button>
            <ol style={{ display: "flex", padding: "0px" }}>
              {pages.map((_, i) => (
                <li key={i} style={{ listStyle: "none" }}>
                  <button
                    onClick={() => goTo(i)}
                    color="red"
                    style={{
                      transition: "opacity 100ms ease-out",
                      opacity: i !== activePageIndex ? 0.5 : 1,
                      display: "inline-block",
                      padding: "6px",
                      margin: "5px",
                      backgroundColor: "#374151",
                      borderRadius: "50%",
                      cursor: "pointer",
                      border: "none",
                    }}
                  ></button>
                </li>
              ))}
            </ol>
            <Button onClick={() => next()}>
              <KeyboardArrowRight />
            </Button>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    );
  };

  return (
    <>
      {!loading ? (
        <>
          <Toaster />
          <Box sx={{ margin: 2 }}>
            <Box>
              <Box>
                <SplitButtonChoice />
              </Box>
              <Box sx={{ width: "93vw" }}>
                {user.status !== "etudiant" && (
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-around",
                      alignItems: "center",
                      bgcolor: "#c6c5c5",
                      my: 2,
                    }}
                  >
                    <TopCreatorsChart />
                    <Box>
                      <MostParticipantsChart />
                    </Box>
                    <BlogRepartition />
                  </Box>
                )}
                {blog
                  // .filter((blog) => blog.type !== "tuto")
                  .filter((blog) =>
                    user.status !== "etudiant"
                      ? blog.visibility === "pending"
                      : user.email === blog.created_by
                      ? blog.visibility === "pending"
                      : undefined
                  ).length > 0 ? (
                  <AdvancedCarouselPending />
                ) : (
                  <> </>
                )}
                <AdvancedCarouselTuto />
                <AdvancedCarouselBlog />
                <AdvancedCarouselEvent />
              </Box>
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
    </>
  );
}

export default Blog;
