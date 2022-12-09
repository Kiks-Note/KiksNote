import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InvBox from "../../components/inventory/InvBox";
import { Grid } from "@mui/material";

function InventoryHome() {
  return (
    <Grid>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} gap={4}>
          <InvBox
            image={
              "https://images.frandroid.com/wp-content/uploads/2022/07/apple-macbook-air-m2-test-6-scaled.jpg"
            }
            label={"Macbook Air M2 2022"}
            reference={"123456"}
            category={"Laptop"}
            campus={"Cergy"}
            status={true}
          />
          <InvBox
            image={
              "https://images.frandroid.com/wp-content/uploads/2022/07/apple-macbook-air-m2-test-6-scaled.jpg"
            }
            label={"Macbook Air M2 2022"}
            reference={"38"}
            category={"Macbook"}
            campus={"Paris"}
            status={false}
          />
        </Grid>
      </Box>
    </Grid>
  );
}

export default InventoryHome;
