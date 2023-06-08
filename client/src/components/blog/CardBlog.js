import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useFirebase from "../../hooks/useFirebase";
import OrangeHashtag from "../../assets/img/orange-hashtag.svg";
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

  return (
    <>
      <div className="card_blog" color="background.default">
        <div className="card-img-holder">
          <img src={blog.thumbnail} alt={blog.thumbnail} />
        </div>
        <div className="card-blog-content">
          <div className="content-title">
            <h3 className="blog-title">{blog.title}</h3>{" "}
            {user.id === blog.created_by ? (
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


          <div className="back-text">
            <span className="blog-time">
              {blog.created_at} | J'aime {blog.like.length} | J'aime pas{" "}
              {blog.dislike.length} | Commentaires {blog.comment.length}
            </span>
            <p className="description">
              {blog.description}{" "}
              <br />

              <Button size="small" onClick={handleClick}
                variant="contained"
                color="success"

              >
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
