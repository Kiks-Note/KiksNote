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

  const AdvancedCarousel = () => {
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
            .filter((blog) => blog.type !== "tuto")
            .filter((blog) =>
              user.status === "etudiant"
                ? blog.visibility === "public"
                : blog.visibility === "pending" || blog.visibility === "public"
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

  return (
    <>
      <Toaster />
      <Box sx={{ margin: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SplitButtonChoice />
          </Grid>
          <Box sx={{ width: "94vw" }}>
            <AdvancedCarousel />
          </Box>
          <Grid item xs={5}>
            <div className="container_blog">
              <div className="container_blog">
                <Typography>En attente de validation</Typography>
                {!loading &&
                  blog
                    .filter((blog) =>
                      user.status !== "etudiant"
                        ? blog.visibility === "pending"
                        : user.email === blog.created_by
                        ? blog.visibility === "pending"
                        : undefined
                    )
                    .map((filtered) => (
                      <>
                        <CardBlog
                          blog={filtered}
                          key={filtered.id}
                          tags={tags}
                        />
                        {/*<Typography>{user.email}</Typography>*/}
                        {/*<Typography>{filtered.created_by}</Typography>*/}
                        {/*<Typography>{filtered.visibility}</Typography>*/}
                        {/*<Typography>{!filtered.visibility}</Typography>*/}
                      </>
                    ))}
                <Typography>Fin attente de validation</Typography>
              </div>
              {!loading ? (
                blog
                  .filter((blog) => blog.type !== "tuto")
                  .filter((blog) =>
                    user.status === "etudiant"
                      ? blog.visibility === "public"
                      : blog.visibility === "pending" ||
                        blog.visibility === "public"
                  )
                  .map((filtered) => (
                    <>
                      <CardBlog blog={filtered} key={filtered.id} tags={tags} />
                      {/*<Typography>{user.email}</Typography>*/}
                      {/*<Typography>{filtered.created_by}</Typography>*/}
                      {/*<Typography>{filtered.visibility}</Typography>*/}
                    </>
                  ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
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
            </div>
          </Grid>
          {user.status !== "etudiant" && (
            <Grid item xs={4}>
              <Paper
                square
                elevation={0}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  pl: 2,
                  bgcolor: "background.default",
                }}
              >
                <Typography variant="h6">{stats[activeStep].label}</Typography>
              </Paper>
              <AutoPlaySwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
                interval={20000}
              >
                {stats.map((step, index) => (
                  <div key={step.label}>{step.component}</div>
                ))}
              </AutoPlaySwipeableViews>
              <MobileStepper
                steps={stats.length}
                position="static"
                activeStep={activeStep}
                nextButton={
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={activeStep === stats.length - 1}
                  >
                    Suivant
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                    Précédent
                  </Button>
                }
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}

export default Blog;
