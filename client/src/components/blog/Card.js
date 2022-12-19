import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Grid} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import {useEffect, useState} from "react";
import axios from "axios";

export default function ImgMediaCard({blog}) {
    // console.log(blog);

    const [comment, setComment] = useState([]);

    const getComment = async () => {
        const response = await axios.get(`http://localhost:5050/tuto/${blog.id}/comments`);
        setComment(response.data);
        console.log(response.data);
    }

    useEffect(() => {
        getComment();
    }, []);

    return (
        <Grid item xs={2} sm={4} md={5}>
            <Card sx={{maxWidth: 350, m: 2}}>
                <CardMedia
                    component="img"
                    // alt="green iguana"
                    height="10"
                    image={blog.photo}
                    // image="https://cdn.code.daypilot.org/image/big/7sca734yufgatkpbudmqro7tga/vue-resource-calendar-open-source.png"
                    // sx={{maxHeight: 250}}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {blog.title}
                        {/*yo*/}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {blog.description}
                        {/*sisi*/}
                    </Typography>
                </CardContent>
                <CardActions>
                    {blog.like}
                    <Checkbox icon={<ThumbUpOffAltIcon/>} checkedIcon={<ThumbUpIcon/>}/>
                    {blog.dislike}
                    <Checkbox icon={<ThumbDownOffAltIcon/>} checkedIcon={<ThumbDownAltIcon color={'error'}/>}/>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
        </Grid>
    );
}