import {Fab, Grid, Modal, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {Toaster, toast} from "react-hot-toast";
import {Rings} from "react-loader-spinner";
import {useNavigate} from "react-router-dom";
import {CustomDropdown} from "../../components/inventory/CustomDropdown";
import CustomSnackbar from "../../components/inventory/CustomSnackBar";
import InvBox from "../../components/inventory/InvBox";
import LoanRequestForm from "../../components/inventory/LoanRequestForm";
import ModalForm from "../../components/inventory/ModalForm";
import SideBarModify from "../../components/inventory/SideBarModify";
import SideBarRequest from "../../components/inventory/SideBarRequest";
import "../../styles/inventoryGlobal.css";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import useFirebase from "../../hooks/useFirebase";

const Sujection = ({openSujection, setOpenSujection}) => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useFirebase();

  const handleSendSujection = async () => {
    setLoading(true);
    await axios
      .post("http://localhost:5050/inventory/createIdea", {
        name,
        url,
        price,
        description,
        reason,
        createdBy: user.id,
      })
      .then((res) => {
        toast.success(res.data);
        setOpenSujection(false);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data);
        setLoading(false);
      });
  };

  return (
    <div>
      <Dialog open={openSujection} onClose={() => setOpenSujection(false)}>
        <DialogTitle>Idée d'achat</DialogTitle>
        <DialogContent sx={{minWidth: "500px"}}>
          {/* <DialogContentText> */}
          {/* </DialogContentText> */}
          <TextField
            required
            autoFocus
            margin="dense"
            id="url"
            label="URL du produit"
            type="url"
            fullWidth
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <TextField
            required
            autoFocus
            margin="dense"
            id="name"
            label="Nom du produit"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            required
            autoFocus
            margin="dense"
            id="price"
            label="Prix du produit"
            type="number"
            fullWidth
            variant="outlined"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            // required
            autoFocus
            margin="dense"
            id="description"
            label="Description du produit"
            type="text"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            required
            autoFocus
            margin="dense"
            id="motivation"
            label="Motif de l'achat"
            type="text"
            fullWidth
            variant="outlined"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          {!loading && (
            <>
              <Button onClick={() => setOpenSujection(false)}>Annuler</Button>
              <Button onClick={() => handleSendSujection()}>Envoyer</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

function InventoryHome() {
  const [inventory, setInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDemand, setOpenDemand] = useState(false);
  const [openRequest, setOpenResquest] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clickedDeviceId, setClickedDeviceId] = useState({});
  const [clickedRequest, setClickedRequest] = useState({});
  const [campusFilter, setCampusFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [openSujection, setOpenSujection] = useState(false);
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

  const toggleDrawerDemand = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenDemand(open);
  };

  const toggleDrawerRequest = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenResquest(open);
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

  const handleEditClick = (e) => {
    setIsMenuOpen(false);
    toggleDrawerModify(e, true);
  };

  useEffect(() => {
    reloadData();
  }, [loading]);

  const reloadData = async () => {
    loading &&
      (await axios
        .get("http://localhost:5050/inventory")
        .then((res) => {
          setInventory(res.data);
          setLoading(false);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        }));
  };

  const fetchRequests = async (deviceId, requestId) => {
    await axios
      .get(`http://localhost:5050/inventory/request/${deviceId}/${requestId}`)
      .then((res) => {
        setClickedRequest(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteClick = async () => {
    setIsMenuOpen(false);
    setSnackBarOpen(false);

    toast.promise(
      axios.delete(`http://localhost:5050/inventory/delete/${clickedDeviceId}`),
      {
        loading: "Suppression en cours",
        success: (res) => {
          reloadData();
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
    <div>
      <ModalForm
        open={openAdd}
        toggleDrawerAdd={toggleDrawerAdd}
        reloadData={reloadData}
      />
      <LoanRequestForm
        open={openDemand}
        toggleDrawerAdd={toggleDrawerDemand}
        reloadData={reloadData}
      />
      <SideBarRequest
        open={openRequest}
        toggleDrawerRequest={toggleDrawerRequest}
        deviceId={clickedDeviceId}
        reloadData={reloadData}
      />
      <SideBarModify
        open={openModify}
        toggleDrawerModify={toggleDrawerModify}
        deviceId={clickedDeviceId}
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
      {openSujection && (
        <Sujection
          openSujection={openSujection}
          setOpenSujection={setOpenSujection}
        />
      )}
      <Toaster position="bottom-left" />
      <Fab
        onClick={() => setOpenSujection(true)}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>

      {/* <div className="buttons-wrapper">
        {user.admin && (
          <>
            <Tooltip
              title="Demander un emprunt"
              aria-label="add"
              sx={{marginBottom: "20px"}}
              placement="left"
            >
              <Fab
                color="primary"
                aria-label="add"
                onClick={(e) => toggleDrawerDemand(e, true)}
              >
                <AddCircleIcon />
              </Fab>
            </Tooltip>
            <Tooltip
              title="Ajouter un appareil"
              aria-label="add"
              sx={{marginBottom: "20px"}}
              placement="left"
            >
              <Fab
                color="primary"
                aria-label="add"
                onClick={(e) => toggleDrawerAdd(e, true)}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
            <Tooltip
              title="Voir les demandes"
              aria-label="add"
              sx={{marginBottom: "20px"}}
              placement="left"
            >
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => navigate("/inventory/requests")}
              >
                <AccessibilityNewRoundedIcon />
              </Fab>
            </Tooltip>
            <Tooltip
              title="Voir la liste de matériel"
              aria-label="add"
              sx={{marginBottom: "20px"}}
              placement="left"
            >
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => navigate("/inventory/devices")}
              >
                <FormatListNumberedIcon />
              </Fab>
            </Tooltip>
          </>
        )}
      </div> */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <CustomDropdown
          placeholder="Campus"
          data={[
            {label: "Cergy", value: "Cergy"},
            {label: "Paris", value: "Paris"},
            {label: "Reset", value: "reset"},
          ]}
          onChange={(e) => {
            setCampusFilter(e[0].value);
          }}
        />
      </div>
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
        <Box sx={{flexGrow: 1}}>
          <Grid container spacing={4}>
            {!loading &&
              inventory
                .filter((item) => {
                  return item.status === "available";
                })
                .filter((item) => {
                  if (campusFilter === null) {
                    return item;
                  } else if (campusFilter === "reset") {
                    setCampusFilter(null);
                    return item;
                  } else {
                    return (
                      item.campus.charAt(0).toUpperCase() +
                        item.campus.slice(1) ===
                      campusFilter
                    );
                  }
                })
                .map((item, index) => (
                  <Grid item key={index}>
                    <InvBox
                      image={item.image}
                      label={item.label}
                      reference={item.reference}
                      category={item.category}
                      campus={
                        item.campus.charAt(0).toUpperCase() +
                        item.campus.slice(1)
                      }
                      status={item.status}
                      onClickRequest={(e) => {
                        if (item.status === "available") {
                          toggleDrawerRequest(e, true);
                          setClickedDeviceId(item.id);
                        } else {
                          fetchRequests(item.id, item.lastRequestId);
                          toast.error("Cet appareil n'est pas disponible");
                        }
                      }}
                      onEditClick={(e) => {
                        handleEditClick(e);
                      }}
                      onDeleteClick={() => {
                        setSnackBarOpen(true);
                        setIsMenuOpen(false);
                        setClickedDeviceId(item.id);
                      }}
                      isMenuOpen={isMenuOpen}
                      onMenuClick={(e) => {
                        setIsMenuOpen(true);
                        setAnchorEl(e.currentTarget);
                        setClickedDeviceId(item.id);
                      }}
                      onMenuClose={() => setIsMenuOpen(false)}
                      anchorEl={anchorEl}
                    />
                  </Grid>
                ))}
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default InventoryHome;
