import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
// import useAuth from "../../hooks/useAuth";
import CloseIcon from "@mui/icons-material/Close";
import FaInfoCircle from "@mui/icons-material/Info";
import useFirebase from "../../hooks/useFirebase";

const Item = styled(Paper)(({theme}) => ({
  // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const CategoryDialog = ({open, setDialogOpen}) => {
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .put("http://localhost:5050/inventory/category", {
        category,
      })
      .then((res) => {
        setDialogOpen(false);
        setCategory("");
        toast.success("Catégorie ajoutée avec succès");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data);
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
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
        <Button onClick={(e) => handleSubmit(e)}>Ajouter</Button>
      </DialogActions>
    </Dialog>
  );
};

const CategoriesList = ({open, setCategoriesListOpen}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editableIndex, setEditableIndex] = useState(-1);
  const [oldCategory, setOldCategory] = useState("");

  useEffect(() => {
    (async () => {
      const ws = new w3cwebsocket("ws://localhost:5050/liveCategories");

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setCategories(data.labels);
        setLoading(false);
      };
    })();
  }, []);

  const deleteCategory = async (category) => {
    console.log(category);
    await axios
      .delete(`http://localhost:5050/inventory/category/${category}`)
      .then((res) => {
        toast.success("Catégorie supprimée avec succès");
      })
      .catch((err) => {
        toast.error(err.response.data);
        console.log(err);
      });
  };

  const handleEdit = async (e) => {
    const newCategory = document.getElementById(`category-${e}`).textContent;

    await axios
      .put(`http://localhost:5050/inventory/category/${oldCategory}`, {
        newCategory,
      })
      .then((res) => {
        toast.success("Catégorie modifiée avec succès");
        setEditableIndex(-1);
        setOldCategory("");
        console.log(res);
      })
      .catch((err) => {
        toast.error(err.response.data);
        console.log(err);
      });
  };

  const handleCancel = (category) => {
    setEditableIndex(-1);
    setOldCategory("");
    document.getElementById(`category-${category}`).textContent = oldCategory;
    toast("Modification annulée", {
      icon: "✏️",
    });
  };

  return (
    <Dialog open={open} onClose={() => setCategoriesListOpen(false)}>
      <div style={{maxWidth: 500, maxHeight: 750, overflow: "auto"}}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Liste des catégories</Typography>
          <IconButton
            onClick={() => setCategoriesListOpen(false)}
            sx={{color: theme.colors.components.light}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider
          sx={{
            backgroundColor: "transparent",
            flexShrink: 0,
            borderTop: "0px solid rgba(255, 255, 255, 0.12)",
            borderRight: "0px solid rgba(255, 255, 255, 0.12)",
            borderLeft: "0px solid rgba(255, 255, 255, 0.12)",
            borderBottom: "none",
            height: "0.0625rem",
            margin: ".1rem 0",
            opacity: 0.25,
            backgroundImage:
              "linear-gradient(to right, rgba(52, 71, 103, 0), rgb(255, 255, 255), rgba(52, 71, 103, 0)) !important",
          }}
        />
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <FaInfoCircle />
          <Typography variant="body2">
            Double-cliquez sur une catégorie pour la modifier et ensuite appuyez
            sur le bouton pour confirmer
          </Typography>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Typography variant="h6">Chargement...</Typography>
          ) : (
            <List>
              {!loading &&
                categories
                  .sort((a, b) => a.localeCompare(b))
                  .map((category, index) => (
                    <Item
                      key={index}
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
                        <p
                          style={{
                            fontFamily: "poppins-semibold",
                            fontSize: 16,
                            color: theme.colors.components.light,
                          }}
                        >
                          Label:{" "}
                        </p>
                        <p
                          style={{
                            fontFamily: "poppins-regular",
                            fontSize: 16,
                            color: theme.colors.components.light,
                            marginLeft: 5,
                          }}
                          onDoubleClick={() => {
                            setEditableIndex(index);
                            setOldCategory(category);
                          }}
                          contentEditable={editableIndex === index}
                          id={`category-${category}`}
                          suppressContentEditableWarning={true}
                        >
                          {category}
                        </p>
                      </div>
                      <div>
                        {editableIndex === index && (
                          <>
                            <Tooltip title="Annuler">
                              <IconButton
                                onClick={() => handleCancel(category)}
                                sx={{color: "#FF0000"}}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Modifier">
                              <IconButton
                                onClick={() => handleEdit(category)}
                                sx={{color: theme.colors.components.dark}}
                                disabled={
                                  editableIndex !== -1 &&
                                  editableIndex !== index
                                }
                              >
                                <EditRoundedIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Supprimer">
                          <IconButton
                            onClick={() => deleteCategory(category)}
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
      </div>
    </Dialog>
  );
};

const InventoryAdminDashboard = () => {
  const [openModify, setOpenModify] = useState(false);
  const [clickedDeviceId, setClickedDeviceId] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoriesListOpen, setCategoriesListOpen] = useState(false);
  const [todayRequests, setTodayRequests] = useState([]);
  const [emailsDialogOpen, setEmailsDialogOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const navigate = useNavigate();
  const {user} = useFirebase();

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
        emails={emails}
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
                        {r.request.requesterId}
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
                          (setEmailsDialogOpen(true),
                          setEmails(r.request.group))
                        }
                      >
                        {r.request.group && r.request?.group.length > 0
                          ? r.request.group.length
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
