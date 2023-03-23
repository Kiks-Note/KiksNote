import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Input,
  List,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {toast, Toaster} from "react-hot-toast";
import {useNavigate} from "react-router";
import {w3cwebsocket} from "websocket";
import CustomSnackbar from "../../components/inventory/CustomSnackBar";
import ModalForm from "../../components/inventory/ModalForm";
import SideBarModify from "../../components/inventory/SideBarModify";
import "./inventory.css";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "../../theme";

const Item = styled(Paper)(({theme}) => ({
  // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const CategoryDialog = ({open, setDialogOpen}) => {
  const [category, setCategory] = useState("");
  const [categoryValue, setCategoryValue] = useState("");

  const writeJson = () => {
    axios
      .post("http://localhost:5050/write-to-file", {
        label: category,
        value: categoryValue,
      })
      .then((res) => {
        console.log(res);
        setDialogOpen(false);
        setCategory("");
        setCategoryValue("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog open={open} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Ajouter une catégorie</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Categorie Label"
          fullWidth
          variant="outlined"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Categorie Value"
          fullWidth
          variant="outlined"
          value={categoryValue}
          onChange={(e) => setCategoryValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
        <Button onClick={() => writeJson()}>Ajouter</Button>
      </DialogActions>
    </Dialog>
  );
};

const CategoriesList = ({open, setCategoriesListOpen}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    open &&
      (async () => {
        const ws = new w3cwebsocket("ws://localhost:5050/categories");

        ws.onopen = () => {
          console.log("connected");
        };

        ws.onmessage = (e) => {
          const data = JSON.parse(e.data);
          setCategories(data);
          setLoading(false);
        };
      })();
  }, [open]);

  const deleteCategory = (id) => {
    axios
      .delete(`http://localhost:5050/delete-from-file/${id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog open={open} onClose={() => setCategoriesListOpen(false)}>
      <DialogTitle>Liste des catégories</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography variant="h6">Chargement...</Typography>
        ) : (
          <List>
            {categories.map((category) => (
              <Item
                key={category.value}
                sx={{
                  mb: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  width: 400,
                }}
              >
                <div>
                  <span style={{fontFamily: "poppins-semibold", fontSize: 16}}>
                    Label:{" "}
                  </span>
                  <span style={{fontFamily: "poppins-regular", fontSize: 16}}>
                    {category.label}
                  </span>
                  <br />
                  <span style={{fontFamily: "poppins-semibold", fontSize: 16}}>
                    Value:{" "}
                  </span>
                  <span style={{fontFamily: "poppins-regular", fontSize: 16}}>
                    {category.value}
                  </span>
                </div>
                <div>
                  <Tooltip title="Modifier">
                    <IconButton
                      onClick={() => {}}
                      sx={{color: theme.colors.components.dark}}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton
                      onClick={() => deleteCategory(category.id)}
                      sx={{color: "#FF0000"}}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </Item>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

const InventoryAdminDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [openModify, setOpenModify] = useState(false);
  const [clickedDeviceId, setClickedDeviceId] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoriesListOpen, setCategoriesListOpen] = useState(false);
  const navigate = useNavigate();

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

  // useEffect(() => {
  //   (async () => {
  //     const ws = new w3cwebsocket("ws://localhost:5050");

  //     ws.onmessage = (message) => {
  //       const data = JSON.parse(message.data);
  //       setDevices(data);
  //     };
  //   })();
  // }, []);

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

  return (
    <>
      <Toaster position="bottom-left" />
      <CategoryDialog open={dialogOpen} setDialogOpen={setDialogOpen} />
      <CategoriesList
        open={categoriesListOpen}
        setCategoriesListOpen={setCategoriesListOpen}
      />
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
      <ModalForm open={openAdd} toggleDrawerAdd={toggleDrawerAdd} />
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
          <Grid
            item
            xs={12}
            md={12}
            lg={6}
            sx={{
              mt: 2.5,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Item
              sx={{
                boxShadow: "none",
                backgroundColor: "transparent",
                minHeight: 450,
              }}
            >
              <Button
                variant="contained"
                onClick={(e) => toggleDrawerAdd(e, true)}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#1A2027",
                  fontFamily: "poppins-semibold",
                  boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                }}
              >
                Ajouter un peripherique
              </Button>
              <Button
                variant="contained"
                onClick={() => setDialogOpen(true)}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#1A2027",
                  fontFamily: "poppins-semibold",
                  boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                  ml: 2,
                }}
              >
                Ajouter une categorie
              </Button>
              <Button
                variant="contained"
                onClick={() => setCategoriesListOpen(true)}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#1A2027",
                  fontFamily: "poppins-semibold",
                  boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                  ml: 2,
                }}
              >
                Liste des categories
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/inventory/admin/list")}
                sx={{
                  mt: 2,
                  backgroundColor: "#ffffff",
                  color: "#1A2027",
                  fontFamily: "poppins-semibold",
                  boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                }}
              >
                Liste des peripheriques
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/inventory/admin/borrowed")}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#1A2027",
                  fontFamily: "poppins-semibold",
                  boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                  mt: 2,
                  ml: 2,
                }}
              >
                Liste des peripheriques empruntés
              </Button>
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
                  Demandes d'emprunt du jour
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
                      Device
                    </TableCell>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold"}}
                    >
                      Demandeur
                    </TableCell>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold"}}
                    >
                      Date Debut
                    </TableCell>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold"}}
                    >
                      Date Fin
                    </TableCell>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold"}}
                    >
                      Groupe
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {devices
                    .filter((device) => device.status === "requested")
                    .slice(0, 5)
                    .map((device) => ( */}
                  <TableRow>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-regular"}}
                    >
                      1dsqgfds123&&&dsq
                    </TableCell>

                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-regular"}}
                    >
                      Rui gaspar
                    </TableCell>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-regular"}}
                    >
                      Mac
                    </TableCell>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-regular"}}
                    >
                      12/12/2021
                    </TableCell>
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-regular"}}
                    >
                      17/12/2021
                    </TableCell>
                  </TableRow>
                  {/* ))} */}
                </TableBody>
              </Table>
            </Item>
          </Grid>
          {/* <Grid item xs={12} md={12} lg={6} sx={{mt: 2.5}}>
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
          </Grid> */}
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
      </Container>
    </>
  );
};

export default InventoryAdminDashboard;
