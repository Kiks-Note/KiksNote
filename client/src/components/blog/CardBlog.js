import {
  CardHeader,
  Card,
  CardActions,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";
import { useNavigate } from "react-router-dom";
import PopUpBlog from "./PopUpBlog";
import useFirebase from "../../hooks/useFirebase";

export default function CardBlog({ blog }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [infoBlog, setInfoBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useFirebase();
  useEffect(() => {
    setIsLiked(blog.userLiked);
    setIsDisliked(blog.userDisliked);
    setIsParticipant(blog.userIsParticipant);
    setInfoBlog(blog);
    setLoading(false);
  }, []);
  const deleteBlog = function () {
    axios
      .delete(`http://localhost:5050/blog/${blog.id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function handleLike() {
    try {
      await axios.put(`http://localhost:5050/blog/${infoBlog.id}/like`, {
        userId: user.id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDislike() {
    try {
      await axios.put(`http://localhost:5050/blog/${infoBlog.id}/dislike`, {
        userId: user.id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  const navigate = useNavigate();
  function handleClick() {
    navigate(`/blog/${infoBlog.id}`);
  }

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  async function handleParticipate() {
    try {
      await axios.put(`http://localhost:5050/blog/${infoBlog.id}/participant`, {
        userId: user.id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {" "}
          <Card sx={{ maxWidth: 380, m: 2 }}>
            <CardHeader
              title={<Typography variant="h4">{infoBlog.title}</Typography>}
              subheader={infoBlog.created_at}
              action={
                user.id == infoBlog.created_by ? (
                  <IconButton
                    aria-label="more options"
                    aria-controls="card-menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                  >
                    <MoreVertIcon />
                  </IconButton>
                ) : (
                  <></>
                )
              }
            />
            <CardMedia
              component="img"
              height="10"
              image={infoBlog.thumbnail}
              sx={{ maxHeight: 250 }}
            />
            <CardActions>
              <IconButton onClick={handleLike}>
                {isLiked ? (
                  <ThumbUpIcon color={"primary"} />
                ) : (
                  <ThumbUpOffAltIcon />
                )}
              </IconButton>{" "}
              {infoBlog.like.length}
              <IconButton onClick={handleDislike}>
                {isDisliked ? (
                  <ThumbDownAltIcon color={"error"} />
                ) : (
                  <ThumbDownOffAltIcon />
                )}
              </IconButton>
              {infoBlog.dislike.length}
            </CardActions>

            <CardActions>
              {/* Bouton pour participer */}
              <Button
                size="small"
                onClick={handleParticipate}
                style={{ background: isParticipant ? "green" : "gray" }}
              >
                {isParticipant ? "Participant" : " Ne participe pas"}
              </Button>
              <Button size="small" onClick={handleClick}>
                En savoir plus
              </Button>
              {/* Afficher d'autres boutons, composants, etc. */}
              <PopUpBlog participants={infoBlog.participant} />
            </CardActions>
          </Card>
          <Menu
            id="card-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Button onClick={deleteBlog}>Supprimer</Button>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>Modifier</MenuItem>
          </Menu>
        </>
      )}
    </>
  );
}
