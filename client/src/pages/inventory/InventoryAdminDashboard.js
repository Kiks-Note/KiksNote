import {
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {Box, Container} from "@mui/system";
import React, {useEffect, useState} from "react";
import "./inventory.css";
import Paper from "@mui/material/Paper";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
const Item = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const InventoryAdminDashboard = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    (async () => {
      await axios.get("http://localhost:5050/inventory").then((res) => {
        setDevices(res.data);
        console.log(res.data);
      });
    })();
  }, []);

  return (
    <Box
      style={{
        height: "100vh",
        // width: "100%",
        // flexDirection: "column",
      }}
    >
      <Typography
        variant="h5"
        className="inventory-admin-dashboard-title"
        sx={{color: "white", marginTop: "1rem", fontFamily: "poppins-semibold"}}
      >
        Inventaire Admin Dashboard
      </Typography>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{xs: 1, sm: 2, md: 3}}
        direction="row"
        height="50%"
      >
        <Grid item xs={6}>
          <Item
            style={{
              height: "95%",
              backgroundColor: "#202940",
              boxShadow: "0px 5px 10px 0px rgba(0,0,0,0.26)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Id
                  </TableCell>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Device
                  </TableCell>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Categorie
                  </TableCell>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Historique
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices
                  .filter((device) => device.status === "available")
                  .slice(0, 5)
                  .map((device) => (
                    <TableRow key={device.id}>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {device.id}
                      </TableCell>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {device.label}
                      </TableCell>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {device.category}
                      </TableCell>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {device.status === "available"
                          ? "Disponible"
                          : device.status === "borrowed"
                          ? "Emprunté"
                          : device.status === "inrepair"
                          ? "En réparation"
                          : "Perdu"}
                      </TableCell>
                      <TableCell>
                        <VisibilityIcon
                          style={{color: "white", cursor: "pointer"}}
                          onClick={() => {}}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item
            style={{
              height: "95%",
              backgroundColor: "#202940",
              boxShadow: "0px 5px 10px 0px rgba(0,0,0,0.26)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Id
                  </TableCell>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Device
                  </TableCell>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Categorie
                  </TableCell>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Historique
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices
                  .filter((device) => device.status === "requested")
                  .slice(0, 5)
                  .map((device) => (
                    <TableRow key={device.id}>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {device.id}
                      </TableCell>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {device.label}
                      </TableCell>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {device.category}
                      </TableCell>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {device.status === "available"
                          ? "Disponible"
                          : device.status === "borrowed"
                          ? "Emprunté"
                          : device.status === "inrepair"
                          ? "En réparation"
                          : "Perdu"}
                      </TableCell>
                      <TableCell>
                        <VisibilityIcon
                          style={{color: "white", cursor: "pointer"}}
                          onClick={() => {}}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Item>
        </Grid>
      </Grid>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{xs: 1, sm: 2, md: 3}}
        direction="row"
        height="50%"
        width="100%"
      >
        <Grid item xs={6}>
          <Item
            style={{
              height: "95%",
              backgroundColor: "#202940",
              boxShadow: "0px 5px 10px 0px rgba(0,0,0,0.26)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Id
                  </TableCell>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Device
                  </TableCell>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Categorie
                  </TableCell>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{color: "white", fontFamily: "poppins-semibold"}}
                  >
                    Historique
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices
                  .filter((device) => device.status === "borrowed")
                  .slice(0, 5)
                  .map((device) => (
                    <TableRow key={device.id}>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {device.id}
                      </TableCell>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {device.label}
                      </TableCell>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {device.category}
                      </TableCell>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {device.status === "available"
                          ? "Disponible"
                          : device.status === "borrowed"
                          ? "Emprunté"
                          : device.status === "inrepair"
                          ? "En réparation"
                          : "Perdu"}
                      </TableCell>
                      <TableCell>
                        <VisibilityIcon
                          style={{color: "white", cursor: "pointer"}}
                          onClick={() => {}}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item
            style={{
              height: "95%",
              backgroundColor: "#202940",
              boxShadow: "0px 5px 10px 0px rgba(0,0,0,0.26)",
            }}
          >
            <Typography
              variant="h6"
              sx={{color: "black", fontFamily: "poppins-semibold"}}
            >
              Total Devices Requestes
            </Typography>
            <Typography
              variant="h6"
              sx={{color: "black", fontFamily: "poppins-semibold"}}
            >
              {devices.length}
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryAdminDashboard;
