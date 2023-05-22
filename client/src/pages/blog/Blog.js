import { useEffect, useState } from "react";
import axios from "axios";
import CardBlog from "../../components/blog/CardBlog";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TutoSkeleton from "../../components/blog/TutoSkeleton";
import TagFilter from "../../components/blog/TagFilter";
import SearchBar from "../../components/blog/SearchBar";
import { w3cwebsocket } from "websocket";
import Button from "@mui/material/Button";
import SideBarModify from "../../components/blog/NewBlog.js";
import { Toaster } from "react-hot-toast";
import useFirebase from "../../hooks/useFirebase";
function Blog() {
  const [blog, setBlog] = useState([]);
  const [blogId, setBlogId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModify, setOpenModify] = useState(false);
  const { user } = useFirebase();

  useEffect(() => {
    (async () => {
      const ws = new w3cwebsocket("ws://localhost:5050/blog");

      ws.onopen = function (e) {
        console.log("[open] Connection established");
        console.log("Sending to server");
      };
      ws.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);
        var blogs = dataFromServer;
        var allBlogs = [];
        blogs.forEach((blog) => {
          const dateCreation = new Date(
            blog.created_at._seconds * 1000 +
              blog.created_at._nanoseconds / 100000
          ).toLocaleDateString("fr");
          const likes = blog.like.map((like) => like.id);
          const dislikes = blog.dislike.map((dislike) => dislike.id);
          const participants = blog.participant.map(
            (participant) => participant.id
          );
          const userLiked = likes.includes(user.id);
          const userDisliked = dislikes.includes(user.id);
          const userIsParticipant = participants.includes(user.id);

          const blogFront = {
            id: blog.id,
            created_at: dateCreation,
            created_by: blog.created_by,
            editorState: blog.editorState,
            inputEditorState: blog.inputEditorState,
            participants: participants,
            statut: blog.statut,
            thumbnail: blog.thumbnail,
            title: blog.title,
            updated_at: blog.updated_at,
            likes: blog.like,
            dislikes: blog.dislike,
            userLiked: userLiked,
            userDisliked: userDisliked,
            userIsParticipant: userIsParticipant,
          };
          allBlogs.push(blogFront);
        });

        setBlog(allBlogs);
        setLoading(false);
      };
    })();
  }, []);

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
      <Box>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* <Grid item xs={2}>
            <TagFilter />
          </Grid> */}
          <Grid item xs={10}>
            <Grid
              container
              direction={"column"}
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid container item>
                <Grid item xs={10}>
                  <SearchBar title={blog} />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => toggleDrawerModify(e, true)}
                  >
                    New blog
                  </Button>
                  <SideBarModify
                    open={openModify}
                    toggleDrawerModify={toggleDrawerModify}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                item
                xs={10}
                justifyContent="center"
                alignItems="flex-start"
              >
                {!loading
                  ? blog.map((blog) => <CardBlog blog={blog} key={blog.id} />)
                  : Array.from(new Array(9)).map((index) => (
                      <TutoSkeleton key={index} />
                    ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Blog;
