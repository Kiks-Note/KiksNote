import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Container,
  Grid,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import React, {useEffect, useState} from "react";
import {w3cwebsocket} from "websocket";
import "./inventory.css";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SideBarModify from "../../components/inventory/SideBarModify";
import {toast, Toaster} from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import axios from "axios";
import CustomSnackbar from "../../components/inventory/CustomSnackBar";

const Item = styled(Paper)(({theme}) => ({
  // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const InventoryAdminDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [openModify, setOpenModify] = useState(false);
  const [clickedDeviceId, setClickedDeviceId] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const toggleDrawerModify = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenModify(open);
  };

  useEffect(() => {
    (async () => {
      const ws = new w3cwebsocket("ws://localhost:5050");

      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setDevices(data);
      }; 
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await axios.get("http://localhost:5050/inventory/suggestions").then((res)=>
      setSuggestions(res.data)
      ).catch((err)=>console.log(err))
      
    })();
  }, []);


  const handleDeleteClick = async () => {
    setIsMenuOpen(false);
    setSnackBarOpen(false);

    toast.promise(
      axios.delete(`http://localhost:5050/inventory/delete/${clickedDeviceId}`),
      {
        loading: "Suppression en cours",
        success: (res) => {
          return "Matériel supprimé avec succès";
        },
        error: (err) => {
          console.log(err);
          return "Une erreur est survenue";
        },
      }
    );
  };


  const handleAccepteSuggestion = async () =>{
    
  }
  
  const handleRefuseSuggestion = async () =>{

  }

  return (
    <>
      <Toaster position="bottom-left" />
      <CustomSnackbar
        open={snackBarOpen}
        setOpen={setSnackBarOpen}
        message="Voulez-vous vraiment supprimer cet appareil ?"
        onClickCheck={() => {
          handleDeleteClick();
        }}
        onClickClose={() => {
          setSnackBarOpen(false);
        }}
      />
      <SideBarModify
        open={openModify}
        toggleDrawerModify={toggleDrawerModify}
        deviceId={clickedDeviceId}
      />
      <Container style={{padding: 0, margin: 0, minWidth: "100%"}}>
        <Typography
          variant="h5"
          className="inventory-admin-dashboard-title"
          sx={{color: "white", fontFamily: "poppins-semibold", mb: 2.5}}
        >
          Inventaire Admin Dashboard
        </Typography>
        <Grid
          container
          rowSpacing={{xs: 1, sm: 2, md: 3}}
          columnSpacing={{xs: 1, sm: 2, md: 3}}
          direction="row"
        >
          <Grid item xs={12} md={12} lg={6} sx={{mt: 2.5}}>
            <Item
              style={{
                backgroundColor: "#1A2027",
                minHeight: 450,
                boxShadow: "0px 5px 10px 0px rgba(0,0,0,0.26)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#11151a",
                  height: 50,
                  borderRadius: 5,
                  px: 2,
                  width: "40%",
                  position: "relative",
                  top: -40,
                  boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "poppins-semibold",
                    color: "#fff",
                    fontSize: 18,
                  }}
                >
                  Liste des appareils
                </Typography>
                <Tooltip title="Voir plus" placement="top" arrow>
                  <IconButton
                    sx={{color: "#fff", cursor: "pointer", padding: 0}}
                    onClick= { ()=>{
                      
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </Box>
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
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold"}}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices
                    .filter(
                      (device) =>
                        device.status === "available" ||
                        device.status === "unavailable"
                    )
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
                            : device.status === "unavailable"
                            ? "Indisponible"
                            : "Perdu"}
                        </TableCell>
                        <TableCell>
                          <VisibilityIcon
                            style={{color: "white", cursor: "pointer"}}
                            onClick={() => {}}
                          />
                        </TableCell>
                        <TableCell>
                          <EditRoundedIcon
                            style={{color: "white", cursor: "pointer", mr: 10}}
                            onClick={(e) => {
                              setClickedDeviceId(device.id);
                              toggleDrawerModify(e, true);
                            }}
                          />
                          <DeleteIcon
                            style={{color: "#de2828", cursor: "pointer"}}
                            onClick={(e) => {
                              setSnackBarOpen(true);
                              setIsMenuOpen(false);
                              setClickedDeviceId(device.id);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Item>
          </Grid>
          <Grid item xs={12} md={12} lg={6} sx={{mt: 2.5}}>
            <Item
              style={{
                backgroundColor: "#1A2027",
                boxShadow: "0px 5px 10px 0px rgba(0,0,0,0.26)",
                minHeight: 450,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#11151a",
                  height: 50,
                  borderRadius: 5,
                  px: 2,
                  width: "40%",
                  position: "relative",
                  top: -40,
                  boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "poppins-semibold",
                    color: "#fff",
                    fontSize: 18,
                  }}
                >
                  Demandes d'emprunt
                </Typography>
                <Tooltip title="Voir plus" placement="top" arrow>
                  <IconButton
                    sx={{color: "#fff", cursor: "pointer", padding: 0}}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </Box>
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
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold"}}
                    >
                      Actions
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
                            : device.status === "requested"
                            ? "Demandé"
                            : "Non connu"}
                        </TableCell>
                        <TableCell>
                          <VisibilityIcon
                            style={{color: "white", cursor: "pointer"}}
                            onClick={() => {}}
                          />
                        </TableCell>
                        <TableCell>
                          <EditRoundedIcon
                            style={{color: "white", cursor: "pointer", mr: 10}}
                            onClick={(e) => {
                              setClickedDeviceId(device.id);
                              toggleDrawerModify(e, true);
                            }}
                          />
                          <DeleteIcon
                            style={{color: "#de2828", cursor: "pointer"}}
                            onClick={(e) => {
                              setSnackBarOpen(true);
                              setIsMenuOpen(false);
                              setClickedDeviceId(device.id);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Item>
          </Grid>
          <Grid item xs={12} md={12} lg={6} sx={{mt: 2.5}}>
            <Item
              style={{
                backgroundColor: "#1A2027",
                boxShadow: "0px 5px 10px 0px rgba(0,0,0,0.26)",
                minHeight: 450,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#11151a",
                  height: 50,
                  borderRadius: 5,
                  px: 2,
                  width: "40%",
                  position: "relative",
                  top: -40,
                  boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "poppins-semibold",
                    color: "#fff",
                    fontSize: 18,
                  }}
                >
                  Appareils empruntés
                </Typography>
                <Tooltip title="Voir plus" placement="top" arrow>
                  <IconButton
                    sx={{color: "#fff", cursor: "pointer", padding: 0}}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </Box>
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
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold"}}
                    >
                      Actions
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
                            : device.status === "requested"
                            ? "Demandé"
                            : "Non connu"}
                        </TableCell>
                        <TableCell>
                          <VisibilityIcon
                            style={{color: "white", cursor: "pointer"}}
                            onClick={() => {}}
                          />
                        </TableCell>
                        <TableCell>
                          <EditRoundedIcon
                            style={{color: "white", cursor: "pointer", mr: 10}}
                            onClick={(e) => {
                              setClickedDeviceId(device.id);
                              toggleDrawerModify(e, true);
                            }}
                          />
                          <DeleteIcon
                            style={{color: "#de2828", cursor: "pointer"}}
                            onClick={(e) => {
                              setSnackBarOpen(true);
                              setIsMenuOpen(false);
                              setClickedDeviceId(device.id);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Item>
          </Grid>
          <Grid item xs={12} md={12} lg={6} sx={{mt: 2.5}}>
            <Item
              style={{
                minHeight: 450,
                backgroundColor: "#1A2027",
                boxShadow: "0px 5px 10px 0px rgba(0,0,0,0.26)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#11151a",
                  height: 50,
                  borderRadius: 5,
                  px: 2,
                  width: "40%",
                  position: "relative",
                  top: -40,
                  boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "poppins-semibold",
                    color: "#fff",
                    fontSize: 18,
                  }}
                >
                  Suggestions
                </Typography>
                <Tooltip title="Voir plus" placement="top" arrow>
                  <IconButton
                    sx={{color: "#fff", cursor: "pointer", padding: 0}}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold"}}
                    >
                      Appareil
                    </TableCell>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold"}}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold"}}
                    >
                      Lien
                    </TableCell>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold", width:"10vw"}}
                    >
                      Price
                    </TableCell>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold"}}
                    >
                      Motivation
                    </TableCell>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold"}}
                    >
                      status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suggestions
                    .map((suggestions) => (
                      <TableRow key={suggestions.id}>
                        <TableCell
                          sx={{color: "white", fontFamily: "poppins-regular"}}
                        >
                          {suggestions.id}
                        </TableCell>
                        <TableCell
                          sx={{color: "white", fontFamily: "poppins-regular"}}
                        >
                          {suggestions.description}
                        </TableCell>
                        <TableCell
                          sx={{color: "white", fontFamily: "poppins-regular"}}
                        >
                          {suggestions.link}
                        </TableCell>
                        <TableCell
                          sx={{color: "white", fontFamily: "poppins-regular"}}
                        >
                          {suggestions.price}
                        </TableCell>
                        <TableCell
                          sx={{color: "white", fontFamily: "poppins-regular"}}
                        >
                          {suggestions.motivation}
                        </TableCell>
                        <TableCell
                          sx={{color: "white", fontFamily: "poppins-regular"}}
                        >
                          {suggestions.status === "waiting"
                            ? "en attente"
                            : suggestions.status === "accepted"
                            ? "accepté"
                            : suggestions.status === "refused"
                            ? "Refusé"
                            : "Non connu"}
                        </TableCell>
                        
                        <TableCell>
                          <VisibilityIcon
                            style={{color: "white", cursor: "pointer"}}
                            onClick={() => {}}
                          />
                        </TableCell>
                        <TableCell>
                          <DoneIcon
                            style={{color: "#57D53B", cursor: "pointer", mr: 10}}
                            onClick={(e) => {
                              setClickedDeviceId(suggestions.id);
                              toggleDrawerModify(e, true);
                            }}
                          />
                          <CancelIcon
                            style={{color: "#de2828", cursor: "pointer"}}
                            onClick={(e) => {
                              setSnackBarOpen(true);
                              setIsMenuOpen(false);
                              setClickedDeviceId(suggestions.id);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Item>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default InventoryAdminDashboard;
