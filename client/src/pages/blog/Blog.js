import { useEffect, useState } from "react";
import axios from "axios";
import ImgMediaCard from "../../components/blog/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TutoSkeleton from "../../components/blog/TutoSkeleton";
import TagFilter from "../../components/blog/TagFilter";
import SearchBar from "../../components/blog/SearchBar";
import Button from "@mui/material/Button";
import SideBarModify from "../../components/blog/NewBlog.js";
import { Toaster } from "react-hot-toast";




function Blog() {
    const [tutos, setTutos] = useState([]);
    const [tutosId, setTutosId] = useState([]);
    const [openModify, setOpenModify] = useState(false);

    const getTutos = async () => {
        const response = await axios.get("http://localhost:5050/tutos");
        setTutos(response.data);
        // console.log(response.data);
    }

    const getTutosId = async () => {
        const response = await axios.get("http://localhost:5050/tutos/id");
        setTutosId(response.data);
        // console.log(response.data);
    }

    useEffect(() => {
        getTutos();
        getTutosId();
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

            <Box sx={{

            }}>


                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={2}>
                        <TagFilter />
                    </Grid>
                    <Grid item xs={10}

                    >

                        <Grid container direction={"column"} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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

                            <Grid container item xs={10} justifyContent="center" alignItems="flex-start"
                            // spacing={2} columns={{xs: 4, sm: 8, md: 12}}
                            >

                                {tutosId.length > 0 ?
                                    tutosId.map((blogId) => (
                                        <ImgMediaCard
                                            id={blogId}
                                        />
                                    ))
                                    :
                                    Array.from(new Array(9)).map(() => (
                                        <TutoSkeleton />
                                    ))
                                }

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
            </Box >

        </>
    );
}

export default Blog;
