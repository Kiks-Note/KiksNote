import { useEffect, useState } from "react";
import CardBlog from "../../components/blog/CardBlog";
import { Box, Grid, Button } from "@mui/material";
import { w3cwebsocket } from "websocket";
import { Toaster } from "react-hot-toast";
import { Rings } from "react-loader-spinner";
import useFirebase from "../../hooks/useFirebase";
import axios from "axios";
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
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function Blog() {
  const theme = useTheme();
  const [blog, setBlog] = useState([]);
  const [filteredBlog, setFilteredBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const { user } = useFirebase();
  const [filter, setFilter] = useState({
    title: "",
    tags: "",
  });

  const stats = [
    {
      label: "Top 10 des créateurs d'articles",
      component: <TopCreatorsChart />,
    },
    {
      label: "Top des élèves avec le plus de participation",
      component: <MostParticipantsChart />,
    },
  ];
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = 2;

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
          statut: blog.statut,
          thumbnail: blog.thumbnail,
          title: blog.title,
          updated_at: blog.updated_at,
          like: blog.like,
          dislike: blog.dislike,
          userLiked: userLiked,
          userDisliked: userDisliked,
          userIsParticipant: userIsParticipant,
          type: blog.type,
          tag: blog.tag,
        };
        allBlogs.push(blogFront);
      });

      fetchTags();
      setBlog(allBlogs);
      setLoading(false);
    };
  }, []);
  useEffect(() => {
    // Apply filters whenever they change
    let filteredBlogs = blog;

    if (filter.title !== "") {
      filteredBlogs = filteredBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(filter.title.toLowerCase())
      );
    }

    if (filter.tags !== "") {
      filteredBlogs = filteredBlogs.filter(
        (blog) =>
          blog.tag.length > 0 && blog.tag.some((tag) => tag.id == filter.tags)
      );
    }

    setFilteredBlog(filteredBlogs);
  }, [filter, blog]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };
  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:5050/blog/tag");
      let tags = response.data;
      const aucunTag = { id: "", name: "Aucun" };
      tags = [aucunTag, ...tags];

      // Update the state with the retrieved tags
      setTags(tags);
    } catch (error) {
      console.error("Erreur lors de la récupération des tags :", error);
    }
  };

  return (
    <>
      <Toaster />
      <Box sx={{ margin: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div class="wrapper">
                <div class="search_bar">
                  <div class="search_icon">
                    <svg
                      fill="#8395B3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24px"
                      height="24px"
                    >
                      <path d="M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 19.585938 21.585938 C 20.137937 22.137937 21.033938 22.137938 21.585938 21.585938 C 22.137938 21.033938 22.137938 20.137938 21.585938 19.585938 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z" />
                    </svg>
                  </div>
                  <input
                    id="search"
                    type="text"
                    name="title"
                    label="Titre"
                    value={filter.title}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <div className="container_blog">
              <SplitButtonChoice />
              {!loading ? (
                filteredBlog.map((blog) => (
                  <CardBlog blog={blog} key={blog.id} />
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
              steps={maxSteps}
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
        </Grid>
      </Box>
    </>
  );
}

export default Blog;
