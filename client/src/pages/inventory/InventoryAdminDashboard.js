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
import timeConverter from "../../functions/TimeConverter";
import moment from "moment";
import {UserListDialog} from "../../components/inventory/UserListDialog";
import useAuth from "../../hooks/useAuth";

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
        const ws = new w3cwebsocket("ws://localhost:5050/categoriesInventory");

        ws.onopen = () => {
          ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setCategories(data);
            setLoading(false);
          };
        };
      })();
  }, [open]);

  const deleteCategory = async (id) => {
    await axios
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
                key={category.i}
                sx={{
                  mb: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  width: 400,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span style={{fontFamily: "poppins-semibold", fontSize: 16}}>
                    Label:{" "}
                  </span>
                  <span style={{fontFamily: "poppins-regular", fontSize: 16}}>
                    {category.label}
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
  const [todayRequests, setTodayRequests] = useState([]);
  const [emailsDialogOpen, setEmailsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const {user} = useAuth();

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

  useEffect(() => {
    (async () => {
      const ws = new w3cwebsocket("ws://localhost:5050/todayRequests");

      console.log(user);

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setTodayRequests(data);
      };
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
      <UserListDialog
        open={emailsDialogOpen}
        toogleDialog={setEmailsDialogOpen}
        emails={
          todayRequests.map((request) => {
            return request.request.groupe;
          }) || []
        }
      />
      <Container style={{padding: 0, margin: 0, minWidth: "100%"}}>
        <Typography
          variant="h5"
          className="inventory-admin-dashboard-title"
          sx={{color: "white", fontFamily: "poppins-semibold", mb: 2.5}}
        >
          Inventaire Admin Dashboard
        </Typography>
        <div
          style={{
            gap: 10,
            boxShadow: "none",
            backgroundColor: "transparent",
            // minHeight: 150,
            paddingBottom: 50,
            flexWrap: "wrap",
            display: "flex",
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
            }}
          >
            Liste des categories
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/inventory/admin/list")}
            sx={{
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
            }}
          >
            Liste des peripheriques empruntés
          </Button>
        </div>
        <Grid
          container
          rowSpacing={{xs: 1, sm: 2, md: 3}}
          columnSpacing={{xs: 1, sm: 2, md: 3}}
          direction="row"
        >
          <Grid item xs={12} md={12} lg={12} sx={{mt: 2.5}}>
            <Item
              style={{
                backgroundColor: "#1A2027",
                boxShadow: "0px 5px 10px 0px rgba(0,0,0,0.26)",
                minHeight: 550,
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
                  width: "25%",
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
              <Table
                sx={{
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: 0,
                  },
                }}
              >
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
                  {todayRequests.slice(0, 5).map((r) => (
                    <TableRow>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {r.request.deviceId}
                      </TableCell>

                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {r.request.requester}
                      </TableCell>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {moment(timeConverter(r.request.startDate)).format(
                          "DD.MM.YYYY"
                        )}
                      </TableCell>
                      <TableCell
                        sx={{color: "white", fontFamily: "poppins-regular"}}
                      >
                        {moment(timeConverter(r.request.endDate)).format(
                          "DD.MM.YYYY"
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontFamily: "poppins-regular",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          r.request.group &&
                          r.request?.group.length > 0 &&
                          setEmailsDialogOpen(true)
                        }
                      >
                        {r.request.group && r.request?.group.length > 0
                          ? r.request.group
                          : "Seul"}
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
