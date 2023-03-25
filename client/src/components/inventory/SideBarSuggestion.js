import {

  IconButton,

  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import axios from "axios";
import * as React from "react";
import {useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import {toast} from "react-hot-toast";

export default function ModalForm({open, toggleDrawerSuggestion}) {
  const [description, setDescription] = useState("");
  const [label, setLabel] = useState("");
  const [link,  setLink] = useState("");
  const [motivation, setMotivation] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");

  const addSuggestion = async () => {
    if (!link || !motivation || !price || !label || !description) {
      toast.error("Veuillez remplir tous les champs");
      return;
    } else {
      try {
        await toast.promise(
          axios.post("http://localhost:5050/addSuggestion", {
            link: link,
            motivation: motivation,
            price: price,
            label: label,
            description: description,
            status: status,
          }),
          {
            success: () => {
              resetInputs();
              toggleDrawerSuggestion(false);
              return "Le périphérique a bien été ajouté";
            },
            // error: () => {
            //   return "Une erreur est survenue";
            // },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetInputs = () => {
    setLabel("");
    setLink("");
    setMotivation("");
    setPrice("");
    setDescription("");
  };


  const list = () => (
    <Box
      sx={{
        width: 350,
        p: 2,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
    >
      <Typography variant="h5" sx={{marginBottom: 2}}>
        Ajouter une suggestion
      </Typography>
      <IconButton
        sx={{position: "absolute", top: 12, right: 0}}
        onClick={(e) => {
          toggleDrawerSuggestion(e, false);
        }}
      >
        <CloseIcon />
      </IconButton>
      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Nom du produit"
        type={"text"}
        name="label"
        value={label ? label : ""}
        onChange={(e) => setLabel(e.target.value)}
        fullWidth
      />

      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="lien du produit"
        type={"text"}
        name="image"
        value={link ? link : ""}
        onChange={(e) => setLink(e.target.value)}
        fullWidth
      />
            <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="price"
        type={"text"}
        name="price"
        value={price ? price : ""}
        onChange={(e) => setPrice(e.target.value)}
        fullWidth
      />
            <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="description"
        type={"text"}
        name="description"
        value={description ? description : ""}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
      />
            <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="motivation"
        type={"text"}
        name="motivation"
        value={motivation ? motivation : ""}
        onChange={(e) => setMotivation(e.target.value)}
        fullWidth
      />

      <Button
        variant="contained"
        sx={{marginBottom: 2}}
        fullWidth
        onClick={() => {
          setStatus("waiting")
          addSuggestion();
        }}
      >
        Ajouter
      </Button>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <SwipeableDrawer
          anchor={"right"}
          open={open}
          onClose={(e) => toggleDrawerSuggestion(e, false)}
          onOpen={(e) => toggleDrawerSuggestion(e, true)}
        >
          {list("right")}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
