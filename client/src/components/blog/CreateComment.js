import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {useState} from "react";
import axios from "axios";
import useFirebase from "../../hooks/useFirebase";

export default function CreateComment({tutoId}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useFirebase();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleTextFieldChange = (e) => {
    setMessage(e.target.value);
  };

  const handlePublish = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_SERVER_API}/blog/comments`, {
        id: tutoId,
        userId: user.id,
        message,
      });

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    setOpen(false);
    setMessage("");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{marginRight: 1}}
      >
        Ajouter un commentaire
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle>Nouveau commentaire</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Message"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleTextFieldChange}
            value={message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handlePublish}>Publier</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
