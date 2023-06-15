import CloseIcon from "@mui/icons-material/Close";
import {IconButton, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import axios from "axios";
import * as React from "react";
import {useState} from "react";
import {DateRange} from "react-date-range";
import * as locales from "react-date-range/dist/locale";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import toast from "react-hot-toast";
import StyledTextField from "./StyledTextField";
import {FiInfo} from "react-icons/fi";
import useFirebase from "../../hooks/useFirebase";

export default function SideBarRequest({open, toggleDrawerRequest, device}) {
  const [requestReason, setRequestReason] = useState("");
  const [persons, setPersons] = useState([]);
  const [selectDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const {user} = useFirebase();

  const handleRequest = async () => {
    if (!selectDates[0].startDate || !selectDates[0].endDate) {
      toast.error("Veuillez choisir une date de début et de fin");
      return;
    } else if (user.id === undefined) {
      toast.error("Veuillez vous connecter pour faire une demande");
      return;
    } else {
      await axios
        .post(`http://212.73.217.176:5050/inventory/request/${device.id}`, {
          startDate: new Date(selectDates[0].startDate),
          endDate: new Date(selectDates[0].endDate),
          requestReason: requestReason,
          persons: persons.split(",").map((person) => person.trim()) || [],
          requesterId: user.id,
          category: device.category,
        })
        .then((res) => {
          console.log(res);
          toast.success("Demande envoyée");
          toggleDrawerRequest(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Erreur lors de l'envoi de la demande");
        });
    }
  };

  const list = () => (
    <Box
      sx={{
        // width: 350,
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
          toggleDrawerRequest(e, false);
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* <StyledTextField
            type={"text"}
            placeholder="Raison"
            defaultValue={device.requestReason}
            onChange={(e) => {
              setRequestReason(e.target.value);
            }}
            value={requestReason}
          /> */}
      <StyledTextField
        sx={{marginBottom: 2, width: "100%"}}
        placeholder="Raison"
        onChange={(e) => {
          setRequestReason(e.target.value);
        }}
        value={requestReason}
        multiline={true}
        rows={4}
      />
      <StyledTextField
        // sx={{marginBottom: 2}}
        id="outlined-search"
        type={"text"}
        placeholder="Personnes concernées"
        fullWidth
        onChange={(e) => {
          setPersons(e.target.value);
        }}
        value={persons}
      />

      <div style={{display: "flex"}}>
        <FiInfo size={20} />

        <Typography
          sx={{
            marginBottom: 2,
            fontSize: 12,
            fontFamily: "poppins-semiBold",
            marginLeft: 1,
          }}
        >
          Veillez à bien séparer les personnes par une virgule
        </Typography>
      </div>

      <StyledTextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        type={"text"}
        disabled
        name="Label"
        value={device && device.label}
        fullWidth
      />
      <StyledTextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        type={"text"}
        placeholder="Référence"
        value={device && device.reference}
        disabled
        fullWidth
      />

      <StyledTextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        type={"text"}
        placeholder="Catégorie"
        value={device && device.category}
        disabled
        fullWidth
      />

      <StyledTextField
        sx={{marginBottom: 2}}
        id="outlined-search"
        type={"text"}
        placeholder="Campus"
        // defaultValue={device && device.campus}
        value={device && device.campus}
        disabled
        fullWidth
      />
      <Typography variant="h6" sx={{marginBottom: 2}}>
        Choisissez les dates
      </Typography>
      <DateRange
        editableDateInputs={true}
        onChange={(item) => {
          setSelectedDates([item.selection]);
        }}
        moveRangeOnFirstSelection={false}
        ranges={selectDates}
        locale={locales.fr}
        minDate={new Date()}
      />
      <Button
        variant="contained"
        sx={{marginBottom: 2, marginTop: 4}}
        fullWidth
        onClick={(e) => {
          handleRequest();
          // toggleDrawerRequest(e, false);
        }}
      >
        Confirmer
      </Button>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <SwipeableDrawer
          anchor={"right"}
          open={open}
          onClose={(e) => toggleDrawerRequest(e, false)}
          onOpen={(e) => toggleDrawerRequest(e, true)}
        >
          {list("right")}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
