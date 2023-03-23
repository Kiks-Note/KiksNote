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
import axios from "axios";
import * as React from "react";
import {useState, useEffect} from "react";
import CloseIcon from "@mui/icons-material/Close";
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
  const [status, setStatus] = useState(null);
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
      !campus /*|| !category*/ ||
      !status
    ) {
      toast.error("Veuillez remplir tous les champs");
      return;
    } else {
      try {
        await toast.promise(
          axios.post("http://localhost:5050/addDevice", {
            label: label,
            reference: price,
            acquisitiondate: acquisitiondate,
            campus: image,
            status: storage,
            image: condition,
            description: description,
            status: status,
            campus: campus,
            //category: category
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
    setStatus("");
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
        name="label"
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
        type={"text"}
        name="price"
        value={price ? price : ""}
        onChange={(e) => setPrice(e.target.value)}
        fullWidth
        InputLabelProps={{className: "inputLabel"}}
        InputProps={{className: "input"}}
      />

      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Desription"
        type={"text"}
        name="label"
        value={description ? description : ""}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        InputLabelProps={{className: "inputLabel"}}
        InputProps={{className: "input"}}
      />

      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Date d'acquisition"
        type={"text"}
        name="label"
        value={acquisitiondate ? acquisitiondate : ""}
        onChange={(e) => setAcquisitiondate(e.target.value)}
        fullWidth
        InputLabelProps={{className: "inputLabel"}}
        InputProps={{className: "input"}}
      />

      <FormControl sx={{marginBottom: 2}} fullWidth>
        <InputLabel id="demo-simple-select-label">Campus</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={campus ? campus : ""}
          label="Date d'acquisition"
          onChange={(e) => setCampus(e.target.value)}
          name="campus"
        >
          <MenuItem value={"available"}>Cergy</MenuItem>
          <MenuItem value={"unavailable"}>Paris</MenuItem>
          <MenuItem value={"unavailable"}>Pontoise</MenuItem>
        </Select>
      </FormControl>

      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Armoire de stockage"
        type={"text"}
        name="label"
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
          label="Date d'acquisition"
          onChange={(e) => setCategory(e.target.value)}
          name="condition"
        >
          {categories.map((category) => (
            <MenuItem value={category.value}>{category.label}</MenuItem>
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
          name="condition"
        >
          <MenuItem value={"available"}>Bon état</MenuItem>
          <MenuItem value={"unavailable"}>Mauvais état</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{marginBottom: 2}} fullWidth>
        <InputLabel id="demo-simple-select-label">Statut</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status ? status : ""}
          label="Statut"
          onChange={(e) => setStatus(e.target.value)}
          name="status"
        >
          <MenuItem value={"available"}>Disponible</MenuItem>
          <MenuItem value={"unavailable"}>Indisponible</MenuItem>
        </Select>
      </FormControl>

      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Image"
        type={"text"}
        name="image"
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
