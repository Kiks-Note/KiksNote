import {Button, Grid} from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {Toaster} from "react-hot-toast";
import {Rings} from "react-loader-spinner";
import InvBox from "../../components/inventory/InvBox";
import ModalForm from "../../components/inventory/ModalForm";
import SideBarRequest from "../../components/inventory/SideBarRequest";
import userObj from "../../userObj";

function InventoryHome() {
  const [inventory, setInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openRequest, setOpenResquest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [clickedDevice, setClickedDevice] = useState({});
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
      <Button
        variant="contained"
        sx={{marginBottom: 2}}
        onClick={(e) => toggleDrawerAdd(e, true)}
      >
        Ajouter un appareil
      </Button>

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
            {inventory.map((item, index) => (
              <Grid item key={index}>
                <InvBox
                  image={item.image}
                  label={item.label}
                  reference={item.reference}
                  category={item.category}
                  campus={item.campus}
                  status={item.status}
                  onClickRequest={(e) => {
                    setClickedDevice(item.id);
                    toggleDrawerRequest(e, true);
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
