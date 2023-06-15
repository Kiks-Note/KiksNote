import {makeStyles} from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";
import {
  Card,
  CardContent,
  FormControl,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {Toaster, toast} from "react-hot-toast";
import {w3cwebsocket} from "websocket";
import InvBox from "../../components/inventory/InvBox";
import LoanRequestForm from "../../components/inventory/LoanRequestForm";
import SideBarRequest from "../../components/inventory/SideBarRequest";
import useFirebase from "../../hooks/useFirebase";
import "../../styles/inventoryGlobal.css";

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
      .post("http://212.73.217.176:5050/inventory/createIdea", {
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

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 445,
    margin: theme.spacing(2),
  },
  media: {
    height: 190,
  },
}));

const BootstrapInput = styled(InputBase)(({theme}) => ({
  "label + &": {
    marginTop: theme.spacing(3),
    fontFamily: "poppins-regular",
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    width: "200px",
    margin: "0px",
    // Use the system font instead of the default Roboto font.
    fontFamily: "poppins-regular",
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

function InventoryHome() {
  const [inventory, setInventory] = useState([]);
  const [openDemand, setOpenDemand] = useState(false);
  const [openRequest, setOpenResquest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clickedDevice, setClickedDevice] = useState({});
  const [campusFilter, setCampusFilter] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [openSujection, setOpenSujection] = useState(false);
  const {user} = useFirebase();

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

  useEffect(() => {
    (async () => {
      const ws = new w3cwebsocket("ws://212.73.217.176:5050/liveInventory");

      const inv = (ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setInventory(data);
      });

      Promise.all([inv]).then(() => {
        setLoading(false);
      });
    })();
  }, [loading]);

  const loadingSkeleton = () => {
    return (
      <Grid spacing={4} container>
        {[...Array(12)].map((item, index) => (
          <Grid item>
            <Card
              style={{
                width: 250,
                margin: "auto",
                transition: "0.3s",
                boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                "&:hover": {
                  boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
                },
              }}
            >
              <Skeleton
                variant="rectangular"
                height={0}
                style={{paddingTop: "56.25%"}}
              />

              <CardContent style={{textAlign: "left", flexDirection: "column"}}>
                <Typography variant="h6" gutterBottom paragraph>
                  <Skeleton variant="text" />
                </Typography>
                <Typography variant="caption" paragraph>
                  <Skeleton variant="text" />
                </Typography>
                <Typography variant="caption" paragraph>
                  <Skeleton variant="text" />
                </Typography>
                <Typography variant="caption" paragraph>
                  <Skeleton variant="text" />
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    style={{marginRight: 10}}
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <div>
      <LoanRequestForm open={openDemand} toggleDrawerAdd={toggleDrawerDemand} />
      <SideBarRequest
        open={openRequest}
        toggleDrawerRequest={toggleDrawerRequest}
        device={clickedDevice}
      />
      <Sujection
        openSujection={openSujection}
        setOpenSujection={setOpenSujection}
      />

      <Toaster position="bottom-left" />
      {user?.status !== "etudiant" && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenSujection(true)}
          style={{marginTop: "20px"}}
          sx={{
            backgroundColor: "#3f51b5",
            color: "#fff",
            fontFamily: "poppins-semiBold",
            "&:hover": {
              backgroundColor: "#3f51b5",
              color: "#fff",
            },
          }}
        >
          Ajouter une idée d'achat
        </Button>
      )}

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        <FormControl sx={{}} variant="standard">
          <InputLabel id="demo-customized-select-label">Campus</InputLabel>
          <Select
            labelId="demo-customized-select-label"
            id="demo-customized-select"
            value={campusFilter === null ? "Tous les campus" : campusFilter}
            onChange={(e) => {
              setCampusFilter(e.target.value);
            }}
            input={<BootstrapInput />}
          >
            <MenuItem
              style={{fontFamily: "poppins-regular", fontSize: "16px"}}
              value={null}
            >
              <em>Vider</em>
            </MenuItem>
            <MenuItem
              style={{fontFamily: "poppins-regular", fontSize: "16px"}}
              value={"Cergy"}
            >
              Cergy
            </MenuItem>
            <MenuItem
              style={{fontFamily: "poppins-regular", fontSize: "16px"}}
              value={"Paris"}
            >
              Paris
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      {loading ? (
        loadingSkeleton()
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
                          setClickedDevice(item);
                        } else {
                          toast.error("Cet appareil n'est pas disponible");
                        }
                      }}
                      onDeleteClick={() => {
                        setSnackBarOpen(true);
                        setIsMenuOpen(false);
                        setClickedDevice(item);
                      }}
                      isMenuOpen={isMenuOpen}
                      onMenuClick={(e) => {
                        setIsMenuOpen(true);
                        setAnchorEl(e.currentTarget);
                        setClickedDevice(item);
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
