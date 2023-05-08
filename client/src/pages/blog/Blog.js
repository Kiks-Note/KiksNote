import { useEffect, useState } from "react";
import axios from "axios";
import ImgMediaCard from "../../components/blog/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TutoSkeleton from "../../components/blog/TutoSkeleton";
import TagFilter from "../../components/blog/TagFilter";
import SearchBar from "../../components/blog/SearchBar";
import { w3cwebsocket } from "websocket";
import Button from "@mui/material/Button";
import SideBarModify from "../../components/blog/NewBlog.js";
import { Toaster } from "react-hot-toast";

function Blog() {
  const loggedUser = localStorage.getItem("user");
  const loggedUserParsed = JSON.parse(loggedUser);
  var userStatus = loggedUserParsed.status;
  const [blog, setBlog] = useState([]);
  const [blogId, setBlogId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModify, setOpenModify] = useState(false);

  useEffect(() => {
    (async () => {
      const ws = new w3cwebsocket("ws://localhost:5050/blog");


      ws.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);
        console.log("Got message from server ", dataFromServer);
        setBlog(dataFromServer);
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
          <Grid item xs={2}>
            <TagFilter />
          </Grid>
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
                  ? blog.map((blog) => (
                    <ImgMediaCard
                      image={blog.photo}
                      title={blog.title}
                      description={blog.description}
                      key={blog.id}
                      id={blog.id}
                      like={blog.like}
                      dislike={blog.dislike}
                      participants={blog.participants}
                    />
                  ))
                  : Array.from(new Array(9)).map(() => <TutoSkeleton />)}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Blog;
