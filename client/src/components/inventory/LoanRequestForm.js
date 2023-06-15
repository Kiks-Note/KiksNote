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
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

export default function LoanRequestForm({open, toggleDrawerAdd, reloadData}) {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [concernedPeople, setConcernedPeople] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);


  const addDevice = async () => {
    if (!startDate || !endDate || !concernedPeople || !reason) {
      toast.error("Veuillez remplir tous les champs");
      return;
    } else {
      try {
        await toast.promise(
          axios.post("http://212.73.217.176:5050/requestDevice", {
            startDate: startDate,
            endDate: endDate,
            concernedPeople: concernedPeople,
            reason: reason,
          }),
          {
            success: () => {
              resetInputs();
              toggleDrawerAdd(false);
              return "La demande a été effectué";
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
    startDate("");
    endDate("");
    concernedPeople("");
    reason("");
  };

  useEffect(() => {
    open === true &&
      (async () => {
        await axios.get("http://212.73.217.176:5050/categories").then((res) => {
          setLoading(false);
        });
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
      <Typography variant="h5" sx={{marginBottom: 2}}>
        Faire une demande
      </Typography>
      <IconButton
        sx={{position: "absolute", top: 12, right: 0}}
        onClick={(e) => {
          toggleDrawerAdd(e, false);
        }}
      >
        <CloseIcon />
      </IconButton>
      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Date de début"
        type={"text"}
        name="label"
        value={startDate ? startDate : ""}
        onChange={(e) => setStartDate(e.target.value)}
        fullWidth
      />
      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Date de fin"
        type={"text"}
        name="price"
        value={endDate ? endDate : ""}
        onChange={(e) => setEndDate(e.target.value)}
        fullWidth
      />

      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Personnes concernées"
        type={"text"}
        name="label"
        value={concernedPeople ? concernedPeople : ""}
        onChange={(e) => setConcernedPeople(e.target.value)}
        fullWidth
      />

      <TextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        label="Raison"
        type={"text"}
        name="label"
        value={reason ? reason : ""}
        onChange={(e) => setReason(e.target.value)}
        fullWidth
        Datetime
      />

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
