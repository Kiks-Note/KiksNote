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
  const [filter, setFilter] = useState(null);
  const [filter2, setFilter2] = useState(null);
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
          placeholder="Date"
          data={[
            {label: "Disponibilité", value: "statut"},
            {label: "Date", value: "date"},
            {label: "Categorie", value: "categorie"},
            {label: "Disponibles", value: "disponibles"},
            {label: "Emprunté", value: "borrowed"},
          ]}
          onChange={(e) => {
            setFilter(e[0].value);
          }}
        />
        <CustomDropdown
          placeholder="Campus"
          data={[
            {label: "Cergy", value: "Cergy"},
            {label: "Paris", value: "Paris"},
          ]}
          onChange={(e) => {
            setFilter2(e[0].value);
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
              .sort((a, b) =>
                filter === "date"
                  ? new Date(b.createdAt) - new Date(a.createdAt)
                  : filter === "statut"
                  ? a.status.localeCompare(b.status)
                  : filter === "categorie"
                  ? a.category.localeCompare(b.category)
                  : null
              )
              .filter((item) =>
                filter === "disponibles"
                  ? item.status === "available"
                  : filter === "borrowed"
                  ? item.status === "borrowed"
                  : filter2 === "Cergy"
                  ? item.campus === "Cergy"
                  : filter2 === "Paris"
                  ? item.campus === "Paris"
                  : item
              )
              .map((item, index) => (
                <Grid item key={index}>
                  <InvBox
                    image={item.image}
                    label={item.label}
                    reference={item.ref}
                    category={item.category}
                    campus={item.campus}
                    status={item.status}
                    onClickRequest={(e) => {
                      if (item.status === "available") {
                        toggleDrawerRequest(e, true);
                        setClickedDevice(item.id);
                      } else {
                        fetchRequests(item.id, item.lastRequestId);
                        toast.error(
                          "Cet appareil n'est pas disponible, veuillez consulter les demandes en cours."
                        );
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
