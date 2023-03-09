import {Button, Grid} from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {toast, Toaster} from "react-hot-toast";
import {Rings} from "react-loader-spinner";
import {CustomDropdown} from "../../components/inventory/CustomDropdown";
import InvBox from "../../components/inventory/InvBox";
import ModalForm from "../../components/inventory/ModalForm";
import SideBarRequest from "../../components/inventory/SideBarRequest";
import userObj from "../../userObj";

function InventoryHome() {
  const [inventory, setInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openRequest, setOpenResquest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clickedDevice, setClickedDevice] = useState({});
  const [clickedRequest, setClickedRequest] = useState({});
  const [campusFilter, setCampusFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const user = userObj;

  const toggleDrawerAdd = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenAdd(open);
  };

  const toggleDrawerRequest = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenResquest(open);
  };

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = async () => {
    await axios
      .get("http://localhost:5050/inventory")
      .then((res) => {
        setInventory(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchRequests = async (deviceId, requestId) => {
    await axios
      .get(`http://localhost:5050/inventory/request/${deviceId}/${requestId}`)
      .then((res) => {
        setClickedRequest(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <ModalForm
        open={openAdd}
        toggleDrawerAdd={toggleDrawerAdd}
        reloadData={reloadData}
      />
      <SideBarRequest
        open={openRequest}
        toggleDrawerRequest={toggleDrawerRequest}
        deviceId={clickedDevice}
      />
      <Toaster position="bottom-left" />

      {user.admin && (
        <Button
          variant="contained"
          sx={{marginBottom: 2}}
          onClick={(e) => toggleDrawerAdd(e, true)}
        >
          Ajouter un appareil
        </Button>
      )}

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <CustomDropdown
          placeholder="Filtrer"
          data={[
            {label: "Tous", value: "all"},
            {label: "Disponible", value: "available"},
            {label: "Emprunté", value: "borrowed"},
            {label: "Demandés", value: "requested"},
            {label: "Indisponibles", value: "unavailable"},
          ]}
          onChange={(e) => {
            setStatusFilter(e[0].value);
          }}
        />
        <CustomDropdown
          placeholder="Campus"
          data={[
            {label: "Cergy", value: "Cergy"},
            {label: "Paris", value: "Paris"},
            {label: "Reset", value: "reset"},
          ]}
          onChange={(e) => {
            setCampusFilter(e[0].value);
          }}
        />
      </div>
      {loading ? (
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
      ) : (
        <Box sx={{flexGrow: 1}}>
          <Grid container spacing={4}>
            {inventory
              .filter((item) => {
                if (statusFilter === "all") {
                  return item;
                } else if (statusFilter === "borrowed") {
                  return item.status === "borrowed";
                } else if (statusFilter === "requested") {
                  return item.status === "requested";
                } else if (statusFilter === "unavailable") {
                  return item.status === "unavailable";
                } else if (statusFilter === "available") {
                  return item.status === "available";
                } else {
                  return item.status === "available";
                }
              })
              .filter((item) => {
                if (campusFilter === null) {
                  return item;
                } else if (campusFilter === "reset") {
                  setCampusFilter(null);
                  return item;
                } else {
                  return (
                    item.campus.charAt(0).toUpperCase() +
                      item.campus.slice(1) ===
                    campusFilter
                  );
                }
              })
              .map((item, index) => (
                <Grid item key={index}>
                  <InvBox
                    image={item.image}
                    label={item.label}
                    reference={item.ref}
                    category={item.category}
                    campus={
                      item.campus.charAt(0).toUpperCase() + item.campus.slice(1)
                    }
                    status={item.status}
                    onClickRequest={(e) => {
                      if (item.status === "available") {
                        toggleDrawerRequest(e, true);
                        setClickedDevice(item.id);
                      } else {
                        fetchRequests(item.id, item.lastRequestId);
                        toast.error("Cet appareil n'est pas disponible");
                      }
                    }}
                  />
                </Grid>
              ))}
          </Grid>
        </Box>
      )}
    </>
  );
}

export default InventoryHome;
