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
import {DateRange} from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import toast from "react-hot-toast";
import {Rings} from "react-loader-spinner";
import * as locales from "react-date-range/dist/locale";

export default function SideBarModify({open, toggleDrawerModify, deviceId}) {
  // const [device, setDevice] = useState({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [label, setLabel] = useState("");
  const [reference, setReference] = useState("");
  const [campus, setCampus] = useState(null);
  const [category, setCategory] = useState(null);
  const [status, setStatus] = useState(null);
  const [image, setImage] = useState("");
  const [selectDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  useEffect(() => {
    open === true &&
      (async () => {
        await axios
          .get(`http://localhost:5050/inventory/${deviceId}`)
          .then((res) => {
            setLabel(res.data.label);
            setReference(res.data.ref);
            setCategory(res.data.category);
            setCampus(res.data.campus);
            setStatus(res.data.status);
            setImage(res.data.image);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })();
    console.log(deviceId);
  }, [open === true]);

  useEffect(() => {
    open === true &&
      (async () => {
        await axios.get("http://localhost:5050/categories").then((res) => {
          setCategories(res.data);
          setLoading(false);
        });
      })();
  }, [open === true]);

  const handleModify = async () => {
    await axios
      .put(`http://localhost:5050/inventory/modify/${deviceId}`, {
        label,
        reference,
        category,
        campus,
        status,
        image,
        lastModifiedBy: "admin",
      })
      .then((res) => {
        toast.success("Matériel modifié avec succès");
        toggleDrawerModify(null, false);
        setLoading(true);
      })
      .catch((err) => {
        toast.error("Une erreur est survenue");
        console.log(err);
      });

    console.log(label, reference, category, campus, status, image);
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
        Modification de matériel
      </Typography>
      <IconButton
        sx={{position: "absolute", top: 12, right: 0}}
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
            type={"text"}
            name="label"
            label="Nom du periphérique"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            fullWidth
          />
          <TextField
            sx={{marginBottom: 2}}
            id="outlined-search"
            type={"text"}
            name="reference"
            label="Référence"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            fullWidth
          />

          <FormControl sx={{marginBottom: 2}} fullWidth>
            <InputLabel id="demo-simple-select-label">Catégorie</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category ? category : ""}
              label="Catégorie"
              onChange={(e) => setCategory(e.target.value)}
              name="category"
            >
              {!loading &&
                categories.map((item, index) => (
                  <MenuItem key={index} value={item.label}>
                    {item.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            sx={{marginBottom: 2}}
            id="outlined-search"
            type={"text"}
            name="campus"
            label="Campus"
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            fullWidth
          />
          <FormControl sx={{marginBottom: 2}} fullWidth>
            <InputLabel id="demo-simple-select-label">Statut</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
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
            value={image}
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
