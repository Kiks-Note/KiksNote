import CloseIcon from "@mui/icons-material/Close";
import {
  CardMedia,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
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
// import useAuth from "../../hooks/useAuth";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {useDropzone} from "react-dropzone";
import useFirebase from "../../hooks/useFirebase";
import imageCompression from "browser-image-compression";
import {toast} from "react-hot-toast";

export default function ModalForm({open, toggleDrawerAdd}) {
  const [categories, setCategories] = useState([]);
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const [acquisitiondate, setAcquisitiondate] = useState(null);
  const [image, setImage] = useState(null);
  const [storageRef, setStorage] = useState(null);
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [campus, setCampus] = useState(null);
  const [category, setCategory] = useState(null);
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageType, setImageType] = useState(1);
  const [fileUrl, setFileUrl] = useState(null); // <- add this state variable
  const {user, storage} = useFirebase();

  const Dropzone = () => {
    const {getRootProps, getInputProps} = useDropzone({
      accept: {
        "image/jpeg": [],
        "image/png": [],
      },
      onDrop: (acceptedFiles) => {
        if (acceptedFiles[0] === undefined) {
          toast.error("Veuillez sélectionner un fichier valide");
          return;
        }

        const url = URL.createObjectURL(acceptedFiles[0]);
        setImage(acceptedFiles[0]);
        setFileUrl(url);
        console.log(url);
      },
    });

    return (
      <div
        {...getRootProps({className: "dropzone"})}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          height: 85,
          border: "2px dashed #ccc",
          borderRadius: 5,
          marginBottom: "1rem",
          padding: 10,
        }}
      >
        <input {...getInputProps()} />
        <Typography
          variant="subtitle2"
          color={"text.secondary"}
          sx={{textAlign: "center"}}
        >
          Glissez et déposez une image ici, ou cliquez pour sélectionner un
          fichier
        </Typography>
      </div>
    );
  };

  const addDevice = async () => {
    if (
      !label ||
      !price ||
      !acquisitiondate ||
      !image ||
      !storageRef ||
      !condition ||
      !description ||
      !campus ||
      !category
    ) {
      toast.error("Veuillez remplir tous les champs");
      return;
    } else {
      try {
        let downloadURL = null;
        if (imageType === 2) {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(image, options);

          const imageRef = ref(
            storage,
            `inventory/${category + "_" + reference}`
          );
          const uploadTask = await uploadBytes(imageRef, compressedFile);
          downloadURL = await getDownloadURL(uploadTask.ref);
        }

        await axios.post(`${process.env.REACT_APP_SERVER_API}/inventory`, {
          label: label,
          price: price,
          acquisitiondate: acquisitiondate,
          campus: campus,
          storage: storageRef,
          image: imageType === 1 ? image : downloadURL,
          condition: condition,
          description: description,
          category: category,
          reference: reference,
          createdBy: user.id,
        });

        resetInputs();
        toggleDrawerAdd();
        toast.success("Périphérique ajouté avec succès !");
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
        await axios
          .get(`${process.env.REACT_APP_SERVER_API}/inventory/categories`)
          .then((res) => {
            setCategories(res.data);
            console.log(res.data);
            setLoading(false);
          });
      })();
  }, [open]);

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
        value={storageRef ? storageRef : ""}
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
          {!loading &&
            categories.map((category) => (
              <MenuItem value={category}>{category}</MenuItem>
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

      <div
        style={{
          display: "flex",
          // justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: 2,
        }}
      >
        <Typography variant="subtitle2" color={"text.secondary"}>
          URL
        </Typography>
        <Switch
          checked={imageType === 1 ? false : true}
          onChange={() => {
            setImageType(imageType === 1 ? 2 : 1);
            setImage(null);
          }}
        />
        <Typography variant="subtitle2" color={"text.secondary"}>
          Fichier
        </Typography>
      </div>

      {imageType === 1 ? (
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
      ) : (
        <Dropzone />
      )}
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
            height="150"
            image={imageType === 1 ? image : fileUrl}
            alt=""
          />
        </>
      )}

      <Button
        variant="contained"
        sx={{marginBottom: 2}}
        fullWidth
        onClick={() => addDevice()}
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
