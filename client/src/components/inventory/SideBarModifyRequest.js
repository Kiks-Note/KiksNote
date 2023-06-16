import CloseIcon from "@mui/icons-material/Close";
import {
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
import moment from "moment";
import * as React from "react";
import {useEffect, useState} from "react";
import {Rings} from "react-loader-spinner";
import "../../App.css";
import timeConverter from "../../functions/TimeConverter";
import {toast} from "react-hot-toast";

export default function SideBarModifyRequest({
  open,
  toggleDrawerModify,
  requestId,
}) {
  const [request, setRequest] = useState({});
  const [loading, setLoading] = useState(true);
  const [reference, setReference] = useState("");
  const [requester, setRequester] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [returnedDate, setReturnedDate] = useState(null);
  const [status, setStatus] = useState("");
  const [returned, setReturned] = useState("");
  const [openCalendar, setOpenCalendar] = useState(false);

  useEffect(() => {
    open === true &&
      (async () => {
        await axios
          .get(
            `${process.env.REACT_APP_SERVER_API}/inventory/request/${requestId}`
          )
          .then((res) => {
            setRequest(res.data);
            setLoading(false);
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
        console.log(requestId);
      })();
  }, [open === true]);

  const handleModify = async () => {
    toast.promise(
      axios.put(
        `${process.env.REACT_APP_SERVER_API}/inventory/request/${requestId}`,
        {
          // label,
          // reference,
          // category,
          // campus,
          // status,
          // image,
          // lastModifiedBy: "admin",
        }
      ),
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
      }}
      role="presentation"
    >
      <Typography variant="h5" sx={{marginBottom: 2}}>
        Modifier une demande
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
            name="reference"
            label="Référence"
            defaultValue={request.id}
            onChange={(e) => setReference(e.target.value)}
            fullWidth
            disabled={true}
          />

          <TextField
            sx={{marginBottom: 2}}
            id="outlined-search"
            type={"text"}
            name="requester"
            label="Demandeur"
            defaultValue={request.requester}
            onChange={(e) => setRequester(e.target.value)}
            fullWidth
            disabled={true}
          />

          <TextField
            sx={{marginBottom: 2}}
            id="outlined-search"
            type={"text"}
            name="createdAt"
            label="Date de création"
            defaultValue={moment(timeConverter(request.createdAt)).format(
              "DD.MM.YYYY"
            )}
            onChange={(e) => setCreatedAt(e.target.value)}
            fullWidth
            disabled={true}
          />

          {request.status === "accepted" && (
            <FormControl sx={{marginBottom: 2, width: "100%"}}>
              <InputLabel id="demo-simple-select-label">Retour</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={returned}
                label="Retour"
                onChange={(e) => setReturned(e.target.value)}
              >
                <MenuItem value={"yes"}>Oui</MenuItem>
                <MenuItem value={"no"}>Non</MenuItem>
              </Select>
            </FormControl>
          )}

          {returned === "yes" && (
            <DatePicker
              sx={{width: "100%", marginBottom: 2}}
              label="Date de retour"
              format="DD/MM/YYYY"
              value={returnedDate}
              onChange={(newValue) => {
                setReturnedDate(newValue);
              }}
            />
          )}

          {/* <DatePicker
            label="Controlled picker"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          /> */}

          {request.status === "pending" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                marginBottom: 2,
              }}
            >
              <Button
                variant="contained"
                color="success"
                sx={{width: "100px", height: "50px"}}
              >
                Accepter
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{width: "100px", height: "50px"}}
              >
                Refuser
              </Button>
            </Box>
          )}

          {request.status === "accepted" && (
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
          )}
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
