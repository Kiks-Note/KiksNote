import Tile from "../../components/blog/Tile";
import {useEffect, useState} from "react";
import axios from "axios";
import ImgMediaCard from "../../components/blog/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TutoSkeleton from "../../components/blog/TutoSkeleton";
import TagFilter from "../../components/blog/TagFilter";
import SearchBar from "../../components/blog/SearchBar";


function Blog() {

    const [tutos, setTutos] = useState([]);

    const getTutos = async () => {
        const response = await axios.get("http://localhost:5050/tutos");
        setTutos(response.data);
        console.log(response.data);
    }

    useEffect(() => {
        getTutos();
    }, []);
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
        <Box sx={{
            // display: 'flex', flexWrap: 'wrap', justifyContent: 'center'
        }}>
            <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                <Grid item xs={2}>
                    <TagFilter/>
                </Grid>
                <Grid item xs={10}
                    // justifyContent="center" alignItems="flex-start"
                    // spacing={2} columns={{xs: 4, sm: 8, md: 12}}
                >

                    <Grid container direction={"column"} rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                        <Grid item xs={1}>
                            <SearchBar title={tutos}/>
                        </Grid>

                        <Grid container item xs={10} justifyContent="center" alignItems="flex-start"
                            // spacing={2} columns={{xs: 4, sm: 8, md: 12}}
                        >

                            {tutos.length > 0 ?
                                tutos.map((blog) => (
                                    <ImgMediaCard
                                        blog={blog}
                                    />
                                ))
                                :
                                Array.from(new Array(9)).map(() => (
                                    <TutoSkeleton/>
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
        </Box>
    );
}

export default Blog;
  