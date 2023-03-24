import {Button, Fab, Grid, Tooltip} from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {toast, Toaster} from "react-hot-toast";
import {Rings} from "react-loader-spinner";
import {CustomDropdown} from "../../components/inventory/CustomDropdown";
import InvBox from "../../components/inventory/InvBox";
import ModalForm from "../../components/inventory/ModalForm";
import SideBarRequest from "../../components/inventory/SideBarRequest";
import userObj from "../../userObj";
import AddIcon from "@mui/icons-material/Add";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import "../../styles/inventoryGlobal.css";
import {useNavigate} from "react-router-dom";
import SideBarModify from "../../components/inventory/SideBarModify";
import Snackbar from "../../components/inventory/CustomSnackBar";
import CustomSnackbar from "../../components/inventory/CustomSnackBar";
import SideBarSuggestion from "../../components/inventory/SideBarSuggestion";

function InventoryHome() {
  const [inventory, setInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
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
  const [openSuggestion, setOpenSuggestion] = useState(false);
  const user = userObj;
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
  const toggleDrawerDevice = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenAdd(open);
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

  const toggleDrawerSuggestion = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenSuggestion(open);
  };

  const handleEditClick = (e) => {
    setIsMenuOpen(false);
    toggleDrawerModify(e, true);
  };

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = async () => {
    await axios
      .get("http://localhost:5050/inventory")
      .then((res) => {
        setInventory(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
      <SideBarSuggestion
      open={openSuggestion}
      toggleDrawerSuggestion={toggleDrawerSuggestion}
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
      <Toaster position="bottom-left" />

      <div className="buttons-wrapper">
        {user.admin && (
          <>
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
              title="Ajouter une suggestion"
              aria-label="add"
              sx={{marginBottom: "20px"}}
              placement="left"
            >
              <Fab
                color="primary"
                aria-label="add"
                onClick={(e) => toggleDrawerSuggestion(e, true)}
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
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <CustomDropdown
          placeholder="Filtrer"
          data={[
            {label: "Tous", value: "all"},
            {label: "Disponible", value: "available"},
            {label: "Emprunté", value: "borrowed"},
            {label: "Demandés", value: "requested"},
            {label: "Indisponibles", value: "unavailable"},
          ]}
          onChange={(e) => {
            setStatusFilter(e[0].value);
          }}
        />
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
                  if (statusFilter === "all") {
                    return item;
                  } else if (statusFilter === "borrowed") {
                    return item.status === "borrowed";
                  } else if (statusFilter === "requested") {
                    return item.status === "requested";
                  } else if (statusFilter === "unavailable") {
                    return item.status === "unavailable";
                  } else if (statusFilter === "available") {
                    return item.status === "available";
                  } else {
                    return item.status === "available";
                  }
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
                      reference={item.ref}
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
