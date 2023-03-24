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
import axios from "axios";
import * as React from "react";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {Rings} from "react-loader-spinner";
import styled from "styled-components";
import theme from "../../theme";
import "../../styles/inventoryGlobal.css";
import {w3cwebsocket} from "websocket";
import {DatePicker} from "@mui/x-date-pickers";
import timeConverter from "../../functions/TimeConverter";
import moment from "moment";

export default function SideBarModify({open, toggleDrawerModify, deviceId}) {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const [acquisitiondate, setAcquisitiondate] = useState(null);
  const [image, setImage] = useState("");
  const [storage, setStorage] = useState(null);
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [campus, setCampus] = useState(null);
  const [category, setCategory] = useState(null);
  const [status, setStatus] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    open === true &&
      (async () => {
        const ws = new w3cwebsocket("ws://localhost:5050/categoriesInventory");

        ws.onmessage = (e) => {
          const data = JSON.parse(e.data);
          setCategories(data);
          setLoading(false);
        };
      })();
  }, [open === true]);

  useEffect(() => {
    open === true &&
      (async () => {
        await axios
          .get(`http://localhost:5050/inventory/${deviceId}`)
          .then((res) => {
            setLabel(res.data.label);
            setReference(res.data.reference);
            setCategory(res.data.category);
            setCampus(res.data.campus);
            setStatus(res.data.status);
            setImage(res.data.image);
            setAcquisitiondate(timeConverter(res.data.acquisitiondate));
            setPrice(res.data.price);
            setStorage(res.data.storage);
            setCondition(res.data.condition);
            setDescription(res.data.description);
            setLoading(false);
            setData(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })();
  }, [open === true]);

  const handleModify = async () => {
    if (!label || !reference || !category || !campus || !status || !image) {
      return toast.error("Veuillez remplir tous les champs");
    } else if (
      label === data.label &&
      reference === data.ref &&
      category === data.category &&
      campus === data.campus &&
      status === data.status &&
      image === data.image &&
      acquisitiondate === data.acquisitiondate &&
      price === data.price &&
      storage === data.storage &&
      condition === data.condition &&
      description === data.description &&
      status === data.status
    ) {
      return toast.error("Aucune modification n'a été effectuée");
    }

    toast.promise(
      axios.put(`http://localhost:5050/inventory/modify/${deviceId}`, {
        label,
        reference,
        category,
        campus,
        status,
        image,
        // acquisitiondate: moment(acquisitiondate).format("YYYY-MM-DD"),
        price,
        storage,
        condition,
        description,
        lastModifiedBy: "admin",
      }),
      {
        success: () => {
          toggleDrawerModify(null, false);
          return "Le périphérique a bien été modifié";
        },
        loading: () => {
          toggleDrawerModify(null, false);
          return "Modification en cours...";
        },
        error: () => {
          toggleDrawerModify(null, false);
          return "Une erreur est survenue";
        },
      }
    );
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
        backgroundColor: theme.colors.components.dark,
      }}
      role="presentation"
    >
      <Typography
        variant="h6"
        sx={{
          marginBottom: 4,
          color: theme.colors.components.light,
          fontFamily: theme.fonts.regular,
        }}
      >
        Modification de matériel
      </Typography>
      <IconButton
        sx={{
          position: "absolute",
          top: 12,
          right: 5,
          color: theme.colors.components.light,
        }}
        onClick={(e) => {
          toggleDrawerModify(e, false);
        }}
      >
        <CloseIcon />
      </IconButton>
      {!loading ? (
        <>
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
          <TextField
            sx={{marginBottom: 2}}
            id="outlined-search"
            label="Date d'acquisition"
            type={"text"}
            value={
              acquisitiondate
                ? moment(acquisitiondate).format("DD/MM/YYYY")
                : ""
            }
            onChange={(e) => setAcquisitiondate(e.target.value)}
            fullWidth
            InputLabelProps={{className: "inputLabel"}}
            InputProps={{className: "input"}}
            // disabled
          />
          {/* 
          <DatePicker
            fullWidth
            label="Date d'acquisition"
            format="DD/MM/YYYY"
            defaultDate={acquisitiondate}
            value={acquisitiondate ? acquisitiondate : null}
            onChange={(newValue) => {
              setAcquisitiondate(newValue);
            }}
            sx={{marginBottom: 2, width: "100%"}}
            renderInput={(params) => <TextField {...params} />}
          /> */}

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
            <InputLabel id="demo-simple-select-label">Statut</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status ? status : ""}
              label="Statut"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value={"available"}>Disponible</MenuItem>
              <MenuItem value={"unavailable"}>Indisponible</MenuItem>
              <MenuItem value={"borrowed"}>Emprunté</MenuItem>
              <MenuItem value={"repair"}>Reparation</MenuItem>
              <MenuItem value={"requested"}>Demandé</MenuItem>
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
            onClick={(e) => {
              handleModify();
            }}
          >
            Confirmer
          </Button>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Rings
            height="200"
            width="200"
            color="#00BFFF"
            radius="6"
            wrapperStyle={{}}
            wrapperClass="loader"
            visible={true}
            ariaLabel="rings-loading"
          />
        </div>
      )}
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        {/* <Button variant="contained" onClick={toggleDrawerModify("right", true)}>
          Add Device
        </Button> */}
        <SwipeableDrawer
          anchor={"right"}
          open={open}
          onClose={(e) => toggleDrawerModify(e, false)}
          onOpen={(e) => toggleDrawerModify(e, true)}
        >
          {list("right")}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
