import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  Skeleton,
  styled,
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
import {UserListDialog} from "../../components/inventory/UserListDialog";
import theme from "../../theme";
import "./inventory.css";
import CloseIcon from "@mui/icons-material/Close";
import FaInfoCircle from "@mui/icons-material/Info";
import {IoIosEye} from "react-icons/io";
import useFirebase from "../../hooks/useFirebase";
import BoxStats from "../../components/inventory/BoxStats";

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
  const [ideas, setIdeas] = useState([]);
  const [ideasNotViewed, setIdeasNotViewed] = useState([]);
  const [inventoryLength, setInventoryLength] = useState(0);

  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(true);
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
      const ws2 = new w3cwebsocket("ws://localhost:5050/liveInventory");

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);
        setTodayRequests(data);
      };

      ws2.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setInventory(data);
      };
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const _ideas = await axios
        .get("http://localhost:5050/inventory/ideas")
        .then((res) => {
          setIdeas(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });

      const invLength = await axios
        .get("http://localhost:5050/inventory/length")
        .then((res) => {
          setInventoryLength(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });

      Promise.all([_ideas, invLength]).then(() => {
        setLoading(false);
      });
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

  const handleAcceptRequest = async (requestId, deviceId) => {
    await axios
      .put(
        `http://localhost:5050/inventory/acceptRequest/${deviceId}/${requestId}`,
        {
          admin: user.id,
        }
      )
      .then(() => {
        toast.success("Demande acceptée avec succès");
      })
      .catch((err) => {
        toast.error(err.response.data);
        console.log(err);
      });
  };

  const handleRefuseRequest = async (requestId, deviceId) => {
    await axios
      .put(
        `http://localhost:5050/inventory/refuseRequest/${deviceId}/${requestId}`,
        {
          admin: user.id,
        }
      )
      .then(() => {
        toast.success("Demande refusée avec succès");
      })
      .catch((err) => {
        toast.error(err.response.data);
        console.log(err);
      });
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
          {/* <Button
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
          </Button> */}
          {/* <Button
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
          </Button> */}
        </div>
        {/* <Grid
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
                    <TableCell
                      sx={{color: "white", fontFamily: "poppins-semibold"}}
                    >
                      Actions
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

                      <TableCell>
                        <Tooltip title="Accepter">
                          <IconButton
                            sx={{color: "#00FF00"}}
                            onClick={() =>
                              handleAcceptRequest(
                                r.request.id,
                                r.request.deviceId
                              )
                            }
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Refuser">
                          <IconButton
                            sx={{color: "#FF0000"}}
                            onClick={() =>
                              handleRefuseRequest(
                                r.request.id,
                                r.request.deviceId
                              )
                            }
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Item>
          </Grid>
        </Grid> */}

        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Skeleton variant="rectangular" width="100%" height={118} />
          ))
        ) : (
          <>
            <div style={{display: "flex", gap: "30px", flexWrap: "wrap"}}>
              <BoxStats
                label={"Nombre d'idées non traitées"}
                value={ideas.filter((i) => i.status === "pending").length}
                onClick={() => navigate("/inventory/ideasnotTreated")}
              />
              <BoxStats
                label={"Nombre d'idées traitées"}
                value={
                  ideas.filter((i) =>
                    ["accepted", "refused"].includes(i.status)
                  ).length
                }
                onClick={() => {}}
              />
              <BoxStats
                label={"Nombre d'idées total"}
                value={ideas.length}
                onClick={() => {}}
              />
            </div>
            <div style={{display: "flex", gap: "30px", flexWrap: "wrap"}}>
              <BoxStats
                label={"Nombre de peripheriques"}
                value={inventory.length}
                onClick={() => navigate("/inventory/admin/list")}
              />
              <BoxStats
                label={"Nombre de peripheriques empruntés"}
                value={inventory.filter((i) => i.status === "borrowed").length}
                onClick={() => navigate("/inventory/admin/borrowed")}
              />
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default InventoryAdminDashboard;
