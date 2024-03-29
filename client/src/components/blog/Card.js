import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {Button, Grid, Paper, Stack, styled} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useState} from "react";
import Comment from "./Comment";
import axios from "axios";

export default function ImgMediaCard({
  image,
  title,
  description,
  like,
  dislike,
  id,
  type,
  visibility,
}) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const Item = styled(Paper)(({theme}) => ({
    padding: theme.spacing(1),
  }));

  const handleLike = (e) => {
    like = e.target.checked ? like + 1 : like - 1;

    if (!liked && disliked) {
      setDisliked(false);
      dislike--;
    }

    axios.put(`${process.env.REACT_APP_SERVER_API}/blog/${id}/likes`, {
      like: like,
      dislike: dislike,
    });

    setLiked(!liked);
  };

  const handleDislike = (e) => {
    dislike = e.target.checked ? dislike + 1 : dislike - 1;

    if (!disliked && liked) {
      setLiked(false);
      like--;
    }

    axios.put(`${process.env.REACT_APP_SERVER_API}/blog/${id}/likes`, {
      like: like,
      dislike: dislike,
    });

    setDisliked(!disliked);
  };

  const handleVisilibity = () => {
    visibility = !visibility;

    axios.put(`${process.env.REACT_APP_SERVER_API}/blog/${id}/visibility`, {
      visibility,
    });
  };

  return (
    <>
      {type === "tuto" ? (
        <Grid item xs={2} sm={4} md={5}>
          <Card sx={{maxWidth: 380, m: 2}}>
            <CardMedia component="img" height="10" image={image} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                paddingLeft="7px"
              >
                {description}
              </Typography>
            </CardContent>
            <CardActions>
              <Stack direction="column">
                <Stack direction="row" paddingLeft="10px">
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<ThumbUpOffAltIcon />}
                        checkedIcon={<ThumbUpIcon />}
                        onClick={handleLike}
                        checked={liked}
                      />
                    }
                    label={like}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<ThumbDownOffAltIcon />}
                        checkedIcon={<ThumbDownAltIcon color={"error"} />}
                        onClick={handleDislike}
                        checked={disliked}
                      />
                    }
                    label={dislike}
                  />
                  {/*</Stack>*/}
                  {/*<Stack direction="row">*/}
                  <Comment tutoId={id} />
                  <Button size="medium">Commencer</Button>
                </Stack>
                <Stack paddingLeft="10px">
                  <FormControlLabel
                    control={
                      <Checkbox
                        onClick={handleVisilibity}
                        checked={visibility}
                      />
                    }
                    label="Visible pour tous"
                  />
                </Stack>
              </Stack>
            </CardActions>
          </Card>
        </Grid>
      ) : (
        <h1>Blog</h1>
      )}
    </>
  );
}
