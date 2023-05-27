import { useEffect, useState } from "react";
import CardBlog from "../../components/blog/CardBlog";
import { Box, Grid, TextField, Select, Button, MenuItem } from "@mui/material";
import { w3cwebsocket } from "websocket";
import SideBarModify from "../../components/blog/form/NewBlog.js";
import { Toaster } from "react-hot-toast";
import { Rings } from "react-loader-spinner";
import useFirebase from "../../hooks/useFirebase";
import axios from "axios";
import TopCreatorsChart from "../../components/blog/TopCreator.js";
import MostParticipantsChart from "../../components/blog/TopEvent.js";

function Blog() {
  const [blog, setBlog] = useState([]);
  const [filteredBlog, setFilteredBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModify, setOpenModify] = useState(false);
  const [tags, setTags] = useState([]);
  const { user } = useFirebase();
  const [filter, setFilter] = useState({
    title: "",
    type: "",
    tags: "",
    date: "",
    sort: "asc",
  });
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

    if (filter.type !== "") {
      filteredBlogs = filteredBlogs.filter((blog) => blog.type === filter.type);
    }

    if (filter.tags !== "") {
      filteredBlogs = filteredBlogs.filter(
        (blog) =>
          blog.tag.length > 0 && blog.tag.some((tag) => tag.id == filter.tags)
      );
    }

    if (filter.sort === "asc") {
      filteredBlogs.sort((a, b) => {
        return a.created_at.localeCompare(b.created_at);
      });
    } else if (filter.sort === "desc") {
      filteredBlogs.sort((a, b) => {
        return b.created_at.localeCompare(a.created_at);
      });
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

  const toggleDrawerModify = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenModify(open);
  };

  return (
    <>
      <Toaster />
      <Box sx={{ margin: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <TextField
                name="title"
                label="Titre"
                value={filter.title}
                onChange={handleFilterChange}
              />
              <Select
                label="Type d'article"
                name="type"
                value={filter.type}
                onChange={handleFilterChange}
              >
                <MenuItem value="">Tout type</MenuItem>
                <MenuItem value="blog">Blog</MenuItem>
                <MenuItem value="tuto">Tuto</MenuItem>
              </Select>
              <Select
                name="sort"
                value={filter.sort}
                onChange={handleFilterChange}
              >
                <MenuItem value="asc">Plus ancien </MenuItem>
                <MenuItem value="desc"> Plus récent </MenuItem>
              </Select>

              <Select
                label="Tags"
                variant="outlined"
                size="small"
                name="tags"
                value={filter.tags}
                onChange={handleFilterChange}
              >
                {tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={(e) => toggleDrawerModify(e, true)}
            >
              Nouveau Blog
            </Button>
            <SideBarModify
              open={openModify}
              toggleDrawerModify={toggleDrawerModify}
            />
            {!loading ? (
              filteredBlog.map((blog) => <CardBlog blog={blog} key={blog.id} />)
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
          </Grid>
          <Grid item xs={3}>
            <TopCreatorsChart />
            <MostParticipantsChart />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Blog;
