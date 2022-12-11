import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
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
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import ModalNotifications from "./ModalNotifications";

export default function TemporaryDrawer() {
  const [state, setState] = useState({ right: false });
  const [categories, setCategories] = useState([]);
  const [label, setLabel] = useState("");
  const [reference, setReference] = useState("");
  const [campus, setCampus] = useState(null);
  const [category, setCategory] = useState(null);
  const [status, setStatus] = useState(null);
  const [image, setImage] = useState("");

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const getCategory = () => {
    axios.get("http://localhost:5050/categories").then((res) => {
      setCategories(res.data);
    });
  };

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
    setState({ right: false });
  };

  useEffect(() => {
    getCategory();
  }, []);

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 350,
        p: 2,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
    >
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Ajouter un periphérique
      </Typography>
      <TextField
        sx={{ marginBottom: 2 }}
        id="outlined-search"
        label="Nom du periphérique"
        type={"text"}
        name="label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        fullWidth
      />
      <TextField
        sx={{ marginBottom: 2 }}
        id="outlined-search"
        label="Référence"
        type={"text"}
        name="reference"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        fullWidth
      />

      <FormControl sx={{ marginBottom: 2 }} fullWidth>
        <InputLabel id="demo-simple-select-label">Catégorie</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          label="Catégorie"
          onChange={handleChange}
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
        sx={{ marginBottom: 2 }}
        id="outlined-search"
        label="Campus"
        type={"text"}
        name="campus"
        value={campus}
        onChange={(e) => setCampus(e.target.value)}
        fullWidth
      />
      <FormControl sx={{ marginBottom: 2 }} fullWidth>
        <InputLabel id="demo-simple-select-label">Statut</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status}
          label="Statut"
          onChange={(e) => setStatus(e.target.value)}
          name="status"
        >
          <MenuItem value={true}>Disponible</MenuItem>
          <MenuItem value={false}>Indisponible</MenuItem>
        </Select>
      </FormControl>

      <TextField
        sx={{ marginBottom: 2 }}
        id="outlined-search"
        label="Image"
        type={"text"}
        name="image"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        fullWidth
      />
      {image && (
        <>
          <Typography
            variant="subtitle2"
            color={"text.secondary"}
            sx={{ alignSelf: "flex-start", marginBottom: 2 }}
          >
            Aperçu de l'image :
          </Typography>
          <CardMedia
            sx={{ marginBottom: 2, borderRadius: 2 }}
            component="img"
            height="140"
            image={image}
            alt=""
          />
        </>
      )}

      <Button
        variant="contained"
        sx={{ marginBottom: 2 }}
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
      <Fragment key={"anchor"}>
        <Button onClick={toggleDrawer("right", true)}>{"right"}</Button>
        <Drawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </Drawer>
      </Fragment>
    </div>
  );
}
