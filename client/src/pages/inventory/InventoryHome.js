import { Button, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";
import InvBox from "../../components/inventory/InvBox";
import ModalForm from "../../components/inventory/ModalForm";

function InventoryHome() {
  const [inventory, setInventory] = useState([]);
  const [opened, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const getInventory = async () => {
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

  useEffect(() => {
    getInventory();
  }, [loading]);

  return (
    <>
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
        <Box sx={{ flexGrow: 1 }}>
          <ModalForm opened={opened} />

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
