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
import "./cardBlog.css";
export default function CardBlog({ blog }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useFirebase();
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
      await axios.put(`http://localhost:5050/blog/${blog.id}/like`, {
        userId: user.id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDislike() {
    try {
      await axios.put(`http://localhost:5050/blog/${blog.id}/dislike`, {
        userId: user.id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  const navigate = useNavigate();
  function handleClick() {
    navigate(`/blog/${blog.id}`);
  }

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  async function handleParticipate() {
    try {
      await axios.put(`http://localhost:5050/blog/${blog.id}/participant`, {
        userId: user.id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div class="card_blog">
        <h3 class="blog-title">{blog.title}</h3>

        {blog.tag &&
          Array.isArray(blog.tag) &&
          blog.tag.map((tag) => <p>{tag}</p>)}

        {user.id == blog.created_by ? (
          <IconButton
            aria-label="more options"
            aria-controls="card-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            className="menu_three_blog"
          >
            <MoreVertIcon />
          </IconButton>
        ) : (
          <></>
        )}
        <div class="card-img-holder">
          <img src={blog.thumbnail} alt={blog.thumbnail} />
        </div>

        <span class="blog-time">{blog.created_at} </span>
        {/* <p class="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          sagittis viverra turpis, non cursus ex accumsan at.
        </p> */}
        <div class="options">
          <button class="like__btn" onClick={handleLike}>
            <span id="icon">
              {blog.userLiked ? (
                <ThumbUpIcon color={"primary"} />
              ) : (
                <ThumbUpOffAltIcon />
              )}
            </span>
            <span id="count">{blog.like.length}</span> J'aime
          </button>
          <button class="like__btn" onClick={handleDislike}>
            <span id="icon">
              {blog.userDisliked ? (
                <ThumbDownAltIcon color={"error"} />
              ) : (
                <ThumbDownOffAltIcon />
              )}
            </span>
            <span id="count">{blog.dislike.length}</span> J'aime pas
          </button>

          <Button size="small" onClick={handleClick}>
            Consulter
          </Button>
          { blog.type != "blog" ? (
            <></>
          ) : (
            <Button
              size="small"
              onClick={handleParticipate}
              style={{ background: blog.userIsParticipant ? "green" : "gray" }}
            >
              {blog.userIsParticipant ? "Participant" : " Ne participe pas"}
            </Button>
          )}
        </div>
      </div>

      <Menu
        id="card-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Button onClick={deleteBlog}>Supprimer</Button>
        </MenuItem>
      </Menu>
    </>
  );
}
