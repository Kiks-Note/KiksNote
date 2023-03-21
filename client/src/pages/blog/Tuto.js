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

function Tuto() {
  const [tutos, setTutos] = useState([]);
  const [tutosId, setTutosId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModify, setOpenModify] = useState(false);

  useEffect(() => {
    (async () => {
      const wsTutos = new w3cwebsocket("ws://localhost:5050/tuto");

      wsTutos.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);
        console.log("Got message from server ", dataFromServer);
        setTutos(dataFromServer);
        setLoading(false);
      };
    })();
  }, []);

  // const getTutos = async () => {
  //   const response = await axios.get("http://localhost:5050/tutos");
  //   setTutos(response.data);
  //   // console.log(response.data);
  // };

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

  // const getTutosId = async () => {
  //   const response = await axios.get("http://localhost:5050/tutos/id");
  //   setTutosId(response.data);
  //   // console.log(response.data);
  // };

  // useEffect(() => {
  //   getTutos();
  //   getTutosId();
  // }, []);
  // <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
  //     <Grid item xs={4}>
  //         <Item>1</Item>
  //     </Grid>
  //     <Grid item xs={8}>
  //         <Item>2</Item>
  //     </Grid>
  //
  // </Grid>

  return (
    <>
      <Toaster />
      <Box
        sx={
          {
            // display: 'flex', flexWrap: 'wrap', justifyContent: 'center'
          }
        }
      >
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={2}>
            <TagFilter />
          </Grid>
          <Grid
            item
            xs={10}
            // justifyContent="center" alignItems="flex-start"
            // spacing={2} columns={{xs: 4, sm: 8, md: 12}}
          >
            <Grid
              container
              direction={"column"}
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid container item>
                <Grid item xs={10}>
                  <SearchBar title={tutos} />
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
                // spacing={2} columns={{xs: 4, sm: 8, md: 12}}
              >
                {/*{tutosId.length > 0*/}
                {/*  ? tutosId.map((blogId) => <ImgMediaCard id={blogId} />)*/}
                {/*  : Array.from(new Array(9)).map(() => <TutoSkeleton />)}*/}

                {!loading
                  ? tutos.map((blog) => (
                      <ImgMediaCard
                        image={blog.photo}
                        title={blog.title}
                        description={blog.description}
                        key={blog.id}
                        id={blog.id}
                        like={blog.like}
                        dislike={blog.dislike}
                        type="tuto"
                      />
                    ))
                  : Array.from(new Array(9)).map(() => <TutoSkeleton />)}

                {/*<ImgMediaCard/>*/}
                {/*<ImgMediaCard/>*/}
                {/*<ImgMediaCard/>*/}
                {/*<ImgMediaCard/>*/}
                {/*<ImgMediaCard/>*/}
                {/*<ImgMediaCard/>*/}
                {/*<ImgMediaCard/>*/}
                {/*<ImgMediaCard/>*/}
                {/*<ImgMediaCard/>*/}
                {/*<ImgMediaCard/>*/}
                {/*<ImgMediaCard/>*/}
                {/*<TutoSkeleton/>*/}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Tuto;
