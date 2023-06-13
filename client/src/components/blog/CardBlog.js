import {
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useFirebase from "../../hooks/useFirebase";
import "./cardBlog.css";
import OrangeHashtag from "../../assets/img/orange-hashtag.svg";

export default function CardBlog({ blog, tags }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useFirebase();

  const updateVisibility = async function () {
    const weekDelay = new Date();
    weekDelay.setDate(weekDelay.getDate() - 14);

    console.log(new Date(blog.created_at).getTime());
    console.log(weekDelay.getTime());
    console.log("");

    if (
      weekDelay > new Date(blog.created_at) &&
      blog.visibility === "pending"
    ) {
      await axios.put(`http://localhost:5050/blog/${blog.id}/visibility`, {
        visibility: true,
      });
    }
  };

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

  const changeVisibility = function () {
    // blog.visibility = !blog.visibility
    if (blog.visibility === "pending") {
      blog.visibility = "public";
    } else {
      blog.visibility = "pending";
    }
    axios
      .put(`http://localhost:5050/blog/${blog.id}/visibility`, {
        visibility: blog.visibility,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (blog) {
    updateVisibility();
  }

  const navigate = useNavigate();

  function handleClickBlog() {
    navigate(`/blog/${blog.id}`);
  }
  function handleClickTuto() {
    navigate(`/tuto/${blog.id}`);
  }

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  const getTag = function (id) {
    let tag = "";
    id = id?.toString();
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].id === id) {
        tag = tags[i].name;
        break;
      }
    }
    return tag;
  };

  return (
    <>
      {/*
      <div className="card_blog" color="background.default">
        <div className="card-img-holder">
          <img src={blog.thumbnail} alt={blog.thumbnail} />
        </div>
        <div className="card-blog-content">
          <div className="content-title">
            <h3 className="blog-title">{blog.title}</h3>{" "}
            {user.status !== "etudiant" || user.email === blog.created_by ? (
              <div>
                <IconButton
                  aria-label="more options"
                  aria-controls="card-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  className="menu_three_blog"
                >
                  <MoreVertIcon />
                </IconButton>
              </div>
            ) : (
              <></>
            )}
          </div>

          <span className="blog-time">
            {blog.created_at} | J'aime {blog.like.length} | J'aime pas{" "}
            {blog.dislike.length} | Commentaires {blog.comment.length}
          </span>
          <p className="description">
            {blog.description}{" "}
            <Button size="small" onClick={handleClick}>
              Consulter
            </Button>
          </p>

          <ul className="tags_blog">
            {blog.tag.length != 0 && Array.isArray(blog.tag) && (
              <>
                <img src={OrangeHashtag} width={"30"} height={"30"} />
                {blog.tag.map((tag) => (
                  <li>{tag}, </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>

      <Menu
        id="card-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {user.status !== "etudiant" && (
          <MenuItem>
            <Button onClick={changeVisibility}>Visible</Button>
            <Checkbox
              onClick={changeVisibility}
              checked={blog.visibility !== "pending"}
            ></Checkbox>
          </MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>
          <Button onClick={deleteBlog}>Supprimer</Button>
        </MenuItem>
      </Menu>
*/}

      <div className="card_blog" color="background.default">
        <div className="card-img-holder">
          <img src={blog?.thumbnail} alt={blog?.thumbnail} />
        </div>
        <div className="card-blog-content">
          <div className="content-title">
            <h3 className="blog-title">{blog.title}</h3>{" "}
            {user.status !== "etudiant" || user.email === blog?.created_by ? (
              <div style={{ zIndex: 2 }}>
                <IconButton
                  aria-label="more options"
                  aria-controls="card-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  className="menu_three_blog"
                  sx={{ color: "#ffff" }}
                >
                  <MoreVertIcon />
                </IconButton>
              </div>
            ) : (
              <></>
            )}
          </div>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              px: 1,
              bottom: 0,
              position: "absolute",
              left: "0px",
              maxHeight: "190%",
              width: "100%",
              borderRadius: "0.5rem",
              backgroundColor: "rgba(14, 14, 13, 0.5)",
            }}
          >
            <Typography variant="caption">
              {blog?.created_at} | J'aime {blog?.like?.length} | J'aime pas{" "}
              {blog?.dislike.length} | Commentaires {blog?.comment?.length}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "90%",
              }}
            >
              <Typography sx={{ textOverflow: "ellipsis" }}>
                {blog?.description}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                <Button
                  sx={{ mr: 1 }}
                  size="small"
                  onClick={
                    blog?.type === "tuto" ? handleClickTuto : handleClickBlog
                  }
                  variant="contained"
                  color="success"
                >
                  {blog?.type === "tuto" ? "Commencer" : "Consulter"}
                </Button>

                <ul className="tags_blog">
                  {blog?.tag?.length !== 0 && Array.isArray(blog.tag) && (
                    <>
                      <img src={OrangeHashtag} width={"30"} height={"30"} />
                      {blog?.tag?.slice(0, 3).map((tag) => (
                        // <li>{tag}, </li>
                        <Typography
                          variant="body1"
                          sx={{ mr: 1, color: "white" }}
                        >
                          {getTag(tag)}
                        </Typography>
                      ))}
                    </>
                  )}
                </ul>
              </Box>
            </Box>
          </Box>
        </div>
      </div>

      <Menu
        id="card-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {user.status !== "etudiant" && (
          <MenuItem>
            <Button onClick={changeVisibility}>Visible</Button>
            <Checkbox
              onClick={changeVisibility}
              checked={blog?.visibility !== "pending"}
            ></Checkbox>
          </MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>
          <Button onClick={deleteBlog}>Supprimer</Button>
        </MenuItem>
      </Menu>
    </>
  );
}
