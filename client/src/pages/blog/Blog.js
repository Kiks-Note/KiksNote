import { useEffect, useState } from "react";
import CardBlog from "../../components/blog/CardBlog";
import { Box, Grid, Button } from "@mui/material";
import { w3cwebsocket } from "websocket";
import { Toaster } from "react-hot-toast";
import { Rings } from "react-loader-spinner";
import useFirebase from "../../hooks/useFirebase";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
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
  // console.log("blog : ", blog);
  blog.sort((a, b) => b.created_at.localeCompare(a.created_at)); // sort by date
  // console.log("blogSorted : ", blogSorted);

  const AdvancedCarouselPending = () => {
    const { scrollRef, pages, activePageIndex, next, prev, goTo } =
      useSnapCarousel();
    return (
      <>
        <ul
          ref={scrollRef}
          style={{
            display: "flex",
            overflow: "auto",
            scrollSnapType: "x mandatory",
          }}
        >
          {blog
            // .filter((blog) => blog.type !== "tuto")
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
      </>
    );
  };

  const AdvancedCarouselTuto = () => {
    const { scrollRef, pages, activePageIndex, next, prev, goTo } =
      useSnapCarousel();
    return (
      <>
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
            .filter((blog) => blog.visibility === "public").length > 0
            ? blog
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
            : "Pas de tutoriel disponible"}
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
      </>
    );
  };

  const AdvancedCarouselBlog = () => {
    const { scrollRef, pages, activePageIndex, next, prev, goTo } =
      useSnapCarousel();
    return (
      <>
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
            .filter((blog) => blog.visibility === "public").length > 0
            ? blog
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
            : "Pas de blog disponible"}
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
      </>
    );
  };

  const AdvancedCarouselEvent = () => {
    const { scrollRef, pages, activePageIndex, next, prev, goTo } =
      useSnapCarousel();
    // console.log("123");
    // console.log(blog);
    // for (let i = 0; i < blog?.length; i++) {
    //   for (let j = 0; j < blog[i]?.tag?.length; j++) {
    //     if (blog[i]?.tag[j] === "u6OdMq2h22MOR2Qhfw2w") {
    //       console.log("event", blog[i]?.tag[j]);
    //       console.log(blog[i]);
    //     }
    //   }
    // }
    // blog.filter((blog) => blog.filter((tag) => tag === "u6OdMq2h22MOR2Qhfw2w"));
    // console.log("456");
    return (
      <>
        <ul
          ref={scrollRef}
          style={{
            display: "flex",
            overflow: "auto",
            scrollSnapType: "x mandatory",
          }}
        >
          {blog
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
      </>
    );
  };

  return (
    <>
      {/*<Toaster />*/}
      <Box sx={{ margin: 2 }}>
        <Box>
          <Box>
            <SplitButtonChoice />
          </Box>
          <Box sx={{ width: "93vw" }}>
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
            pending
            <AdvancedCarouselPending />
            tuto
            <AdvancedCarouselTuto />
            blog
            <AdvancedCarouselBlog />
            event
            <AdvancedCarouselEvent />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Blog;
