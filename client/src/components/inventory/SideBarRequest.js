import CloseIcon from "@mui/icons-material/Close";
import {IconButton, TextField, Typography} from "@mui/material";
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

export default function SideBarRequest({open, toggleDrawerRequest, deviceId}) {
  const [device, setDevice] = useState({});
  const [loading, setLoading] = useState(true);
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
            setDevice(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })();
  }, [open === true]);

  const handleRequest = async () => {
    const category = device.category;

    if (!selectDates[0].startDate || !selectDates[0].endDate) {
      toast.error("Veuillez choisir une date de début et de fin");
      return;
    } else {
      await axios
        .put(
          `http://localhost:5050/inventory/makerequest/${category}/${deviceId}`,
          {
            startDate: selectDates[0].startDate,
            endDate: selectDates[0].endDate,
            createdAt: new Date(),
          }
        )
        .then((res) => {
          toast.success("Demande envoyée avec succès !");
          toggleDrawerRequest(false);
        })
        .catch((err) => {
          console.log(err);
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
      {!loading ? (
        <>
          <TextField
            sx={{marginBottom: 2}}
            id="outlined-search"
            type={"text"}
            disabled
            name="label"
            defaultValue={device.label}
            fullWidth
          />
          <TextField
            sx={{marginBottom: 2}}
            id="outlined-search"
            type={"text"}
            name="reference"
            defaultValue={device.ref}
            disabled
            fullWidth
          />

          <TextField
            sx={{marginBottom: 2}}
            id="outlined-search"
            type={"text"}
            name="category"
            defaultValue={device.category}
            disabled
            fullWidth
          />

          <TextField
            sx={{marginBottom: 2}}
            id="outlined-search"
            type={"text"}
            name="campus"
            defaultValue={device.campus}
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
          />

          <Button
            variant="contained"
            sx={{marginBottom: 2}}
            fullWidth
            onClick={(e) => {
              handleRequest();
              // toggleDrawerRequest(e, false);
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
        {/* <Button variant="contained" onClick={toggleDrawerRequest("right", true)}>
          Add Device
        </Button> */}
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
