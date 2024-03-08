import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FaInfoCircle from "@mui/icons-material/Info";
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
  Popper,
  Skeleton,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import axios from "axios";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {toast, Toaster} from "react-hot-toast";
import {IoIosEye} from "react-icons/io";
import {useNavigate} from "react-router";
import {w3cwebsocket} from "websocket";
import BoxStats from "../../components/inventory/BoxStats";
import ModalForm from "../../components/inventory/ModalForm";
import InventoryStatistics from "../../components/inventory/stats/InventoryStatistics";
import MostUsedMaterials from "../../components/inventory/stats/MostUsedMaterials";
import TotalMacCount from "../../components/inventory/stats/TotalMacCount";
import {UserListDialog} from "../../components/inventory/UserListDialog";
import useFirebase from "../../hooks/useFirebase";
import theme from "../../theme";
import "./inventory.css";
import {useTheme} from "@mui/material/styles";

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
      .put(`${process.env.REACT_APP_SERVER_API}/inventory/category`, {
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
      const ws = new w3cwebsocket(
        `${process.env.REACT_APP_SERVER_API_WS}/liveCategories`
      );

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
      .delete(
        `${process.env.REACT_APP_SERVER_API}/inventory/category/${category}`
      )
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
      .put(
        `${process.env.REACT_APP_SERVER_API}/inventory/category/${oldCategory}`,
        {
          newCategory,
        }
      )
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

const CardSkeletonLoader = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1A2027",
        borderRadius: 5,
        px: 2,
        py: 3,
        mt: 2.5,
        boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
        width: "20%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        minHeight: 200,
      }}
    >
      <Skeleton
        variant="text"
        width="80%"
        height={45}
        sx={{marginBottom: 1, backgroundColor: "rgba(255, 255, 255, 0.2)"}}
      />
      <Divider
        sx={{
          width: "100%",
          height: "1px",
          backgroundColor: "#fff",
          opacity: 0.2,
          my: "10px",
        }}
      />
      <Skeleton
        variant="text"
        width="20%"
        height={60}
        sx={{marginBottom: 1, backgroundColor: "rgba(255, 255, 255, 0.2)"}}
      />
      <IconButton
        disabled
        sx={{
          position: "absolute",
          bottom: 10,
          right: 10,
          opacity: 0.8,
        }}
      >
        <IoIosEye style={{fontSize: 30, color: "#fff", opacity: 0.6}} />
      </IconButton>
    </Box>
  );
};

const InventoryAdminDashboard = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoriesListOpen, setCategoriesListOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [emailsDialogOpen, setEmailsDialogOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [downloadLink, setDownloadLink] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState("none");
  const [pdfCampus, setPdfCampus] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {user} = useFirebase();
  const theme = useTheme();

  const handleClick = (event) => {
    setOpen((prev) => !prev);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const id = open ? "simple-popper" : undefined;

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

  useEffect(() => {
    (async () => {
      const _ideas = await axios
        .get(`${process.env.REACT_APP_SERVER_API}/inventory/ideas`)
        .then((res) => {
          setIdeas(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      const ws = new w3cwebsocket(
        `${process.env.REACT_APP_SERVER_API_WS}/pendingRequests`
      );
      const ws2 = new w3cwebsocket(
        `${process.env.REACT_APP_SERVER_API_WS}/liveInventory`
      );

      const wsReqs = (ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setPendingRequests(data);
      });

      const inv = (ws2.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setInventory(data);
      });

      Promise.all([_ideas, wsReqs, inv]).then(() => {
        setLoading(false);
      });
    })();
  }, []);

  const generatePdf = async (event, value) => {
    try {
      setPdfLoading("loading");
      setPdfCampus(value);
      let response;

      response = await fetch(
        `${process.env.REACT_APP_SERVER_API}/inventory/generatePdf/${value}`
      );

      if (response.status === 400) {
        toast.error("Erreur lors de la génération du PDF");
        setPdfLoading("none");
        setOpen((prev) => !prev);
        setAnchorEl(anchorEl ? null : event.currentTarget);
        return;
      } else {
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        setDownloadLink(downloadUrl);
        setPdfLoading("done");
        toast.success("PDF généré avec succès");
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la génération du PDF");
      setPdfLoading("none");
      setOpen((prev) => !prev);
      setAnchorEl(anchorEl ? null : event.currentTarget);
    }
  };

  return (
    <>
      <Toaster position="bottom-left" />
      <CategoryDialog open={dialogOpen} setDialogOpen={setDialogOpen} />
      <CategoriesList
        open={categoriesListOpen}
        setCategoriesListOpen={setCategoriesListOpen}
      />

      <ModalForm open={openAdd} toggleDrawerAdd={toggleDrawerAdd} />
      <UserListDialog
        open={emailsDialogOpen}
        toogleDialog={setEmailsDialogOpen}
        emails={emails}
      />
      <Container
        style={{padding: 0, paddingBottom: 40, margin: 0, minWidth: "100%"}}
      >
        <Typography
          variant="h5"
          className="inventory-admin-dashboard-title"
          style={{
            color: theme.palette.text.primary,
            fontFamily: "poppins-semibold",
            marginBottom: 20,
            marginTop: 20,

            backgroundColor: theme.palette.background.paper,
            borderTopLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            borderTopRightRadius: "5px",
            borderBottomLeftRadius: "5px",
            boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            width: "25%",

            padding: 20,
          }}
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
            onClick={() => navigate("/inventory/statistics")}
            sx={{
              backgroundColor: "#ffffff",
              color: "#1A2027",
              fontFamily: "poppins-semibold",
              boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
            }}
          >
            Voir les statistiques
          </Button> */}

          <Button
            variant="contained"
            aria-describedby={id}
            onClick={(event) => handleClick(event)}
            sx={{
              backgroundColor: "#ffffff",
              color: "#1A2027",
              fontFamily: "poppins-semibold",
              boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
            }}
          >
            Télécharger un pdf de l'inventaire
          </Button>
          <Popper id={id} open={open} anchorEl={anchorEl}>
            <Box
              sx={{
                p: 2,
                bgcolor: "background.paper",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                minWidth: 200,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,

                boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
              }}
            >
              <Typography sx={{pb: 2, fontFamily: "poppins-semibold"}}>
                Campus
              </Typography>
              {pdfLoading == "none" ? (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#1A2027",
                      fontFamily: "poppins-semibold",
                      boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                    }}
                    onClick={(event) => generatePdf(event, "Cergy")}
                  >
                    Cergy
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#1A2027",
                      fontFamily: "poppins-semibold",
                      boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                    }}
                    onClick={(event) => generatePdf(event, "Pontoise")}
                  >
                    Pontoise
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#1A2027",
                      fontFamily: "poppins-semibold",
                      boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                    }}
                    onClick={(event) => generatePdf(event, "Paris")}
                  >
                    Paris
                  </Button>
                  {/* <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#1A2027",
                      fontFamily: "poppins-semibold",
                      boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                    }}
                    onClick={() => generatePdf("all")}
                  >
                    Les deux
                  </Button> */}
                </div>
              ) : pdfLoading == "loading" ? (
                <Typography sx={{p: 2, fontFamily: "poppins-semibold"}}>
                  Chargement...
                </Typography>
              ) : pdfLoading == "done" ? (
                <Button
                  href={downloadLink}
                  download={
                    "inventaire_" +
                    moment().format("DD_MM_YYYY") +
                    "_" +
                    (pdfCampus === "all" ? "cergy_paris" : pdfCampus) +
                    ".pdf"
                  }
                  variant="contained"
                  sx={{
                    backgroundColor: "#ffffff",
                    color: "#1A2027",
                    fontFamily: "poppins-semibold",
                    boxShadow: "0px 5px 10px 0px rgba(200, 200, 200, 0.05)",
                  }}
                  onClick={() => {
                    handleClick();
                    setPdfLoading("none");
                    setPdfCampus(null);
                  }}
                >
                  Télécharger
                </Button>
              ) : null}
            </Box>
          </Popper>
        </div>

        {loading ? (
          <>
            <div style={{display: "flex", gap: "30px", flexWrap: "wrap"}}>
              {Array.from(new Array(3)).map((_, index) => CardSkeletonLoader())}
            </div>
            <div style={{display: "flex", gap: "30px", flexWrap: "wrap"}}>
              {Array.from(new Array(3)).map((_, index) => CardSkeletonLoader())}
            </div>
          </>
        ) : (
          <>
            <div style={{display: "flex", gap: "30px", flexWrap: "wrap"}}>
              <BoxStats
                label={"Nombre d'idées non traitées"}
                value={ideas.filter((i) => i.status === "pending").length}
                onClick={() => navigate("/inventory/ideas/pending")}
              />
              <BoxStats
                label={"Nombre d'idées traitées"}
                value={
                  ideas.filter((i) =>
                    ["accepted", "refused"].includes(i.status)
                  ).length
                }
                onClick={() => navigate("/inventory/ideas/treated")}
              />
              <BoxStats
                label={"Nombre d'idées total"}
                value={ideas.length}
                onClick={() => navigate("/inventory/ideas")}
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
              <BoxStats
                label={"Demandes d'emprunt"}
                value={pendingRequests.length}
                onClick={() => navigate("/inventory/requests/pending")}
              />
            </div>
          </>
        )}

        <div
          style={{
            // display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}
        >
          {/* Increase the gridGap value as desired */}
          <h1
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
              fontFamily: "poppins-semibold",
              textTransform: "uppercase",
            }}
          >
            Statistiques
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 50,
              flexWrap: "wrap",
              paddingRight: "2rem",
            }}
          >
            <InventoryStatistics />
            <MostUsedMaterials />
            <TotalMacCount />
          </div>
        </div>
      </Container>
    </>
  );
};

export default InventoryAdminDashboard;
