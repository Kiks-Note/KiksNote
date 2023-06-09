import axios from "axios";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function PostIt({text}) {
  const deletePostit = () => {
    try {
      axios.delete(`${process.env.REACT_APP_SERVER_API}/agile/`);
    } catch (error) {}
  };

  return (
    <div className="empathy-post-it">
      {text}
      <IconButton
        style={{position: "absolute", top: 0, right: 0, color: "red"}}
        aria-label="delete"
        onClick={deletePostit}
        size="small"
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
}
