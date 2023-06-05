import {Box} from "@mui/system";
import {DataGrid} from "@mui/x-data-grid";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {w3cwebsocket} from "websocket";
import timeConverter from "../../functions/TimeConverter";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import {toast, Toaster} from "react-hot-toast";
import {Avatar, Button, Typography} from "@mui/material";
import theme from "../../theme";
import {useNavigate} from "react-router-dom";
import SideBarModify from "../../components/inventory/SideBarModify";
import CustomSnackbar from "../../components/inventory/CustomSnackBar";
import {FiInfo} from "react-icons/fi";
import GridData from "../../components/inventory/GridData";

export default function InventoryList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(15);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const ws = new w3cwebsocket("ws://localhost:5050/liveInventory");
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log(data);
        setData(data);
        setLoading(false);
      };
    })();
  }, []);

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

  const handleDeleteClick = async () => {
    setIsMenuOpen(false);
    setSnackBarOpen(false);

    await axios
      .delete(`http://localhost:5050/inventory/device/${deviceId}`)
      .then((res) => {
        toast.success("Matériel supprimé avec succès");
      })
      .catch((err) => {
        toast.error("Une erreur est survenue");
        console.log(err);
      });
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      hide: true,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-semibold"}}>
            {params.row.id}
          </Typography>
        );
      },
    },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => {
        return <Avatar src={params.row.image} sx={{width: 50, height: 50}} />;
      },
    },
    {
      field: "deviceId",
      headerName: "Matériel ID",
      width: 225,
      renderCell: (params) => {
        return (
          <Button
            sx={{
              fontFamily: "poppins-regular",
              color: "white",
              backgroundColor: "#1E4675",
              width: 200,

              "&:hover": {
                backgroundColor: "#2868B6",
              },
            }}
            onClick={() => {
              navigate("/deviceHistory/" + params.row.deviceId);
            }}
          >
            <Typography sx={{fontFamily: "poppins-regular", fontSize: 14}}>
              {params.row.deviceId}
            </Typography>
          </Button>
        );
      },
    },
    {
      field: "label",
      headerName: "Nom",
      width: 200,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular", fontSize: 14}}>
            {params.row.label}
          </Typography>
        );
      },
    },
    {
      field: "reference",
      headerName: "Référence",
      width: 175,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular", fontSize: 14}}>
            {params.row.reference}
          </Typography>
        );
      },
    },
    {
      field: "category",
      headerName: "Catégorie",
      width: 150,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular", fontSize: 14}}>
            {params.row.category}
          </Typography>
        );
      },
    },
    {
      field: "campus",
      headerName: "Campus",
      width: 100,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular", fontSize: 14}}>
            {params.row.campus}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Statut",
      width: 130,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular", fontSize: 14}}>
            {params.row.status}
          </Typography>
        );
      },
    },
    {
      field: "condition",
      headerName: "Etat",
      width: 130,
      renderCell: (params) => {
        return (
          <Typography
            sx={{
              fontFamily: "poppins-semiBold",
              fontSize: 14,
              width: 100,
              textAlign: "center",
              height: 30,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                params.row.condition === "Neuf"
                  ? "#378E3F"
                  : params.row.condition === "Usagé"
                  ? "#5A756F"
                  : params.row.condition === "Cassé"
                  ? "#AB4249"
                  : params.row.condition === "Perdu"
                  ? "#AB4249"
                  : params.row.condition === "Manquant"
                  ? "#D08557"
                  : params.row.condition === "Bon état"
                  ? "#2868B6"
                  : params.row.condition === "Mauvais état"
                  ? "#AB4249"
                  : "#1E4675",
            }}
          >
            {params.row.condition}
          </Typography>
        );
      },
    },
    {
      field: "date",
      headerName: "Ajouté le",
      width: 130,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular", fontSize: 14}}>
            {params.row.date}
          </Typography>
        );
      },
    },
    {
      field: "acquisitiondate",
      headerName: "Acquis le",
      width: 130,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular"}}>
            {params.row.acquisitiondate}
          </Typography>
        );
      },
    },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              // justifyContent: "space-between",
            }}
          >
            <EditRoundedIcon
              style={{color: "white", cursor: "pointer"}}
              sx={{mr: 2}}
              onClick={(e) => {
                setDeviceId(params.row.deviceId);
                toggleDrawerModify(e, true);
              }}
            />
            <DeleteIcon
              style={{color: "#de2828", cursor: "pointer"}}
              onClick={() => {
                setSnackBarOpen(true);
                setIsMenuOpen(false);
                setDeviceId(params.row.deviceId);
              }}
            />
          </div>
        );
      },
    },
  ];

  const rows = data.map((item, i) => {
    return {
      id: i,
      image: item.image,
      deviceId: item.id,
      label: item.label,
      reference: item.reference,
      category: item.category,
      campus: item.campus,
      status:
        item.status === "available"
          ? "Disponible"
          : item.status === "requested"
          ? "Demandé"
          : item.status === "unavailable"
          ? "Indisponible"
          : item.status === "borrowed"
          ? "Emprunté"
          : "Inconnu",
      condition:
        item.condition === "new"
          ? "Neuf"
          : item.condition === "used"
          ? "Usagé"
          : item.condition === "broken"
          ? "Cassé"
          : item.condition === "lost"
          ? "Perdu"
          : item.condition === "missing"
          ? "Manquant"
          : item.condition === "good"
          ? "Bon état"
          : item.condition === "bad"
          ? "Mauvais état"
          : "Inconnu",

      date: moment(timeConverter(item.createdAt)).format("DD.MM.YYYY"),
      acquisitiondate: moment(timeConverter(item.acquisitiondate)).format(
        "DD.MM.YYYY"
      ),
    };
  });

  return (
    <div>
      <div style={{display: "flex", marginBlock: 20, alignItems: "center"}}>
        <FiInfo size={30} />
        <Typography
          sx={{
            fontFamily: "poppins-regular",
            fontSize: 16,
            marginLeft: 2,
          }}
        >
          Pour accéder à l'historique du matériel, cliquez sur la case du
          "Matériel ID".
        </Typography>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <SideBarModify
            open={openModify}
            toggleDrawerModify={toggleDrawerModify}
            deviceId={deviceId}
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
          <GridData rows={rows} columns={columns} />
        </>
      )}
    </div>
  );
}
