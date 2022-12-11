import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InvBox from "../../components/inventory/InvBox";
import { Button, Grid } from "@mui/material";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DrawerForm from "../../components/inventory/ModalForm";

function InventoryHome() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);

  const getInventory = async () => {
    const response = await axios.get("http://localhost:5050/inventory");
    setInventory(response.data);
  };

  useEffect(() => {
    getInventory();
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Button
          style={{ marginBottom: 15 }}
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setOpen(true)}
        >
          Refresh
        </Button>
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
        <DrawerForm />
      </Box>
    </>
  );
}

export default InventoryHome;
