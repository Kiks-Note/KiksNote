import CloseIcon from "@mui/icons-material/Close";
import {
  CardMedia,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import {DatePicker} from "@mui/x-date-pickers";
import axios from "axios";
import * as React from "react";
import {useEffect, useState} from "react";
import "react-datetime/css/react-datetime.css";
import {toast} from "react-hot-toast";
import {w3cwebsocket} from "websocket";

export default function ModalForm({open, toggleDrawerAdd}) {
  const [categories, setCategories] = useState([]);
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const [acquisitiondate, setAcquisitiondate] = useState(null);
  const [image, setImage] = useState(null);
  const [storage, setStorage] = useState(null);
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [campus, setCampus] = useState(null);
  const [category, setCategory] = useState(null);
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(true);

  const addDevice = async () => {
    if (
      !label ||
      !price ||
      !acquisitiondate ||
      !image ||
      !storage ||
      !condition ||
      !description ||
      !campus ||
      !category
    ) {
      toast.error("Veuillez remplir tous les champs");
      return;
    } else {
      try {
        await toast.promise(
          axios.post("http://localhost:5050/addDevice", {
            label: label,
            price: price,
            acquisitiondate: acquisitiondate,
            campus: campus,
            storage: storage,
            image: image,
            condition: condition,
            description: description,
            category: category,
            reference: reference,
          }),
          {
            success: () => {
              resetInputs();
              toggleDrawerAdd(false);
              return "Le périphérique a bien été ajouté";
            },
            error: () => {
              return "Une erreur est survenue";
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetInputs = () => {
    setLabel("");
    setPrice("");
    setAcquisitiondate("");
    setImage("");
    setStorage("");
    setCondition("");
    setDescription("");
    setCampus("");
    setCategory("");
  };

  useEffect(() => {
    open === true &&
      (async () => {
        const ws = new w3cwebsocket("ws://localhost:5050/categories");

        // ws.onopen = () => {
        //   console.log("connected");
        // };

        ws.onmessage = (e) => {
          const data = JSON.parse(e.data);
          setCategories(data);
          setLoading(false);
        };
      })();
  }, [open === true]);

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
      <Typography variant="h5" sx={{marginBottom: 2, color: "white"}}>
        Ajouter un periphérique
      </Typography>
      <IconButton
        sx={{position: "absolute", top: 12, right: 0, color: "white"}}
        onClick={(e) => {
          toggleDrawerAdd(e, false);
        }}
      >
        <CloseIcon />
      </IconButton>
      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Nom du periphérique"
        type={"text"}
        value={label ? label : ""}
        onChange={(e) => setLabel(e.target.value)}
        fullWidth
        InputLabelProps={{className: "inputLabel"}}
        InputProps={{className: "input"}}
      />
      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Prix"
        type={"number"}
        value={price ? price : ""}
        onChange={(e) => setPrice(e.target.value)}
        fullWidth
        InputLabelProps={{className: "inputLabel"}}
        InputProps={{className: "input"}}
        inputProps={{min: 0, step: 0.01}}
      />

      <DatePicker
        fullWidth
        label="Date d'acquisition"
        value={acquisitiondate}
        onChange={(newValue) => {
          setAcquisitiondate(newValue);
        }}
        sx={{marginBottom: 2, width: "100%"}}
        renderInput={(params) => <TextField {...params} />}
      />

      <FormControl sx={{marginBottom: 2}} fullWidth>
        <InputLabel id="demo-simple-select-label">Campus</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={campus ? campus : ""}
          label="Campus"
          onChange={(e) => setCampus(e.target.value)}
        >
          <MenuItem value={"Cergy"}>Cergy</MenuItem>
          <MenuItem value={"Paris"}>Paris</MenuItem>
          <MenuItem value={"Pontoise"}>Pontoise</MenuItem>
        </Select>
      </FormControl>

      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Référence"
        type={"text"}
        value={reference ? reference : ""}
        onChange={(e) => setReference(e.target.value)}
        fullWidth
        InputLabelProps={{className: "inputLabel"}}
        InputProps={{className: "input"}}
      />
      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Armoire de stockage"
        type={"text"}
        value={storage ? storage : ""}
        onChange={(e) => setStorage(e.target.value)}
        fullWidth
        InputLabelProps={{className: "inputLabel"}}
        InputProps={{className: "input"}}
      />

      <FormControl sx={{marginBottom: 2}} fullWidth>
        <InputLabel id="demo-simple-select-label">Catégorie</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category ? category : ""}
          label="Catégorie"
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((category) => (
            <MenuItem value={category.label}>{category.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{marginBottom: 2}} fullWidth>
        <InputLabel id="demo-simple-select-label">Etat</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={condition ? condition : ""}
          label="Date d'acquisition"
          onChange={(e) => setCondition(e.target.value)}
        >
          <MenuItem value={"new"}>Neuf</MenuItem>
          <MenuItem value={"good"}>Bon état</MenuItem>
          <MenuItem value={"used"}>Usagé</MenuItem>
          <MenuItem value={"bad"}>Mauvais état</MenuItem>
          <MenuItem value={"broken"}>Cassé</MenuItem>
          <MenuItem value={"lost"}>Perdu</MenuItem>
        </Select>
      </FormControl>

      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Description"
        type={"text"}
        value={description ? description : ""}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        InputLabelProps={{className: "inputLabel"}}
        InputProps={{className: "input"}}
      />

      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Image"
        type={"text"}
        value={image ? image : ""}
        onChange={(e) => setImage(e.target.value)}
        fullWidth
        InputLabelProps={{className: "inputLabel"}}
        InputProps={{className: "input"}}
      />
      {image && (
        <>
          <Typography
            variant="subtitle2"
            color={"text.secondary"}
            sx={{alignSelf: "flex-start", marginBottom: 2}}
          >
            Aperçu de l'image :
          </Typography>
          <CardMedia
            sx={{marginBottom: 2, borderRadius: 2}}
            component="img"
            height="140"
            image={image ? image : ""}
            alt=""
          />
        </>
      )}

      <Button
        variant="contained"
        sx={{marginBottom: 2}}
        fullWidth
        onClick={() => {
          addDevice();
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
          onClose={(e) => toggleDrawerAdd(e, false)}
          onOpen={(e) => toggleDrawerAdd(e, true)}
        >
          {list("right")}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
