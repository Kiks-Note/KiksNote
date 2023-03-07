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

export default function ModalForm({open, toggleDrawer}) {
  const [categories, setCategories] = useState([]);
  const [label, setLabel] = useState("");
  const [reference, setReference] = useState("");
  const [campus, setCampus] = useState(null);
  const [category, setCategory] = useState(null);
  const [status, setStatus] = useState(null);
  const [image, setImage] = useState("");

  const addDevice = () => {
    axios
      .post("http://localhost:5050/addDevice", {
        label: label,
        reference: reference,
        category: category,
        campus: campus,
        status: status,
        image: image,
      })
      .then(() => {
        clearForm();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clearForm = () => {
    setLabel("");
    setReference("");
    setCategory("");
    setCampus("");
    setStatus("");
    setImage("");
    // setState({right: false});
  };

  // useEffect(() => {
  //   (async () => {
  //     await axios.get("http://localhost:5050/categories").then((res) => {
  //       setCategories(res.data);
  //     });
  //   })();
  // }, []);

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
        Ajouter un periphérique
      </Typography>
      <IconButton
        sx={{position: "absolute", top: 12, right: 0}}
        onClick={(e) => {
          toggleDrawer(e, false);
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
        value={label || ""}
        onChange={(e) => setLabel(e.target.value)}
        fullWidth
      />
      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Référence"
        type={"text"}
        name="reference"
        value={reference || ""}
        onChange={(e) => setReference(e.target.value)}
        fullWidth
      />

      <FormControl sx={{marginBottom: 2}} fullWidth>
        <InputLabel id="demo-simple-select-label">Catégorie</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          // value={category || ""}
          label="Catégorie"
          // onChange={(e) => setCategory(e.target.value)}
          name="category"
        >
          {categories.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Campus"
        type={"text"}
        name="campus"
        value={campus || ""}
        onChange={(e) => setCampus(e.target.value)}
        fullWidth
      />
      <FormControl sx={{marginBottom: 2}} fullWidth>
        <InputLabel id="demo-simple-select-label">Statut</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status || ""}
          label="Statut"
          onChange={(e) => setStatus(e.target.value)}
          name="status"
        >
          <MenuItem value={true}>Disponible</MenuItem>
          <MenuItem value={false}>Indisponible</MenuItem>
        </Select>
      </FormControl>

      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Image"
        type={"text"}
        name="image"
        value={image || ""}
        onChange={(e) => setImage(e.target.value)}
        fullWidth
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
            image={image || ""}
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
        {/* <Button variant="contained" onClick={toggleDrawer("right", true)}>
          Add Device
        </Button> */}
        <SwipeableDrawer
          anchor={"right"}
          open={open}
          onClose={(e) => toggleDrawer(e, false)}
          onOpen={(e) => toggleDrawer(e, true)}
        >
          {list("right")}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
