import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";

export default function ImgMediaCard({
  image,
  title,
  description,
  like,
  dislike,
  id,
}) {
  // console.log(id);

  // const [tuto, setTuto] = useState([]);
  // // const [comments, setComments] = useState([]);
  //
  // const getTuto = async () => {
  //   const response = await axios.get(`http://localhost:5050/tuto/${id}`);
  //   setTuto(response.data);
  //   // console.log(response.data);
  // };
  //
  // // const getComments = async () => {
  // //     const response = await axios.get(`http://localhost:5050/tuto/${id}/comments`);
  // //     setComments(response.data);
  // //     console.log(response.data);
  // // }
  //
  // useEffect(() => {
  //   getTuto();
  //   // getComments();
  // }, []);

  return (
    <Grid item xs={2} sm={4} md={5}>
      <Card sx={{ maxWidth: 380, m: 2 }}>
        <CardMedia
          component="img"
          // alt="green iguana"
          height="10"
          image={image}
          // image="https://cdn.code.daypilot.org/image/big/7sca734yufgatkpbudmqro7tga/vue-resource-calendar-open-source.png"
          // sx={{maxHeight: 250}}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
            {/*yo*/}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
            {/*sisi*/}
          </Typography>
        </CardContent>
        <CardActions>
          {like}
          <Checkbox
            icon={<ThumbUpOffAltIcon />}
            checkedIcon={<ThumbUpIcon />}
          />
          {dislike}
          <Checkbox
            icon={<ThumbDownOffAltIcon />}
            checkedIcon={<ThumbDownAltIcon color={"error"} />}
          />
          <Comment tutoId={id} />
          <Button size="small">Commencer</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
