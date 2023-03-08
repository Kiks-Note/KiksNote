import {Button, Grid} from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {Rings} from "react-loader-spinner";
import InvBox from "../../components/inventory/InvBox";
import ModalForm from "../../components/inventory/ModalForm";
import userObj from "../../userObj";

function InventoryHome() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const user = userObj;

  const toogleDrawer = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  useEffect(() => {
    (async () => {
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
      setLoading(false);
    })();
  }, []);

  const handleRequest = async (deviceId, category) => {
    await axios
      .put(
        `http://localhost:5050/inventory/makerequest/${category}/${deviceId}`,
        {
          user: user,
          status: "pending",
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <ModalForm open={open} toggleDrawer={toogleDrawer} />
      <Button
        variant="contained"
        sx={{marginBottom: 2}}
        onClick={(e) => toogleDrawer(e, true)}
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
                  onClickRequest={() => {
                    handleRequest(item.id, item.category);
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
