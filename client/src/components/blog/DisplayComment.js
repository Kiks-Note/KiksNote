import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function DisplayComment({ comment, tutoId }) {
  console.log(comment.id);
  const handleDeleteComment = function () {
    axios
      .delete(`http://localhost:5050/blog/${tutoId}/comments/${comment.id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("Supprimer le commentaire :", comment.id);
  };
  const deleteBlog = function () {};
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={comment.user.firstname} src={comment.user.image} />
        </ListItemAvatar>
        <ListItemText
          primary={`${comment.user.firstname} ${comment.user.lastname}`}
          secondary={
            <>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {comment.content}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Publié le{" "}
                {new Date(comment.date._seconds * 1000).toLocaleDateString(
                  "fr-FR"
                )}
              </Typography>
            </>
          }
        />
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={handleDeleteComment}
        >
          <DeleteIcon />
        </IconButton>
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
}
