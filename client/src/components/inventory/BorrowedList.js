import {Box} from "@mui/system";
import {DataGrid} from "@mui/x-data-grid";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {w3cwebsocket} from "websocket";
import timeConverter from "../../functions/TimeConverter";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBarModify from "./SideBarModify";
import CustomSnackbar from "./CustomSnackBar";
import axios from "axios";
import {toast, Toaster} from "react-hot-toast";
import {UserListDialog} from "./UserListDialog";
import GridData from "./GridData";
import {Avatar, Button, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import useFirebase from "../../hooks/useFirebase";

export default function BorrowedList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedDeviceId, setClickedDeviceId] = useState(null);
  const [openModify, setOpenModify] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [groupeEmails, setGroupeEmails] = useState([]);
  const navigate = useNavigate();
  const {user} = useFirebase();

  useEffect(() => {
    loading &&
      (async () => {
        const ws = new w3cwebsocket("ws://212.73.217.176:5050/adminBorrowedList");
        ws.onmessage = (message) => {
          const data = JSON.parse(message.data);
          setData(data);
          console.log(data);
          setLoading(false);
        };
      })();
  }, [loading]);

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

  const toogleDialog = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenDialog(open);
  };

  const handleReturnClick = async (deviceId, requestId) => {
    await axios
      .put(
        `http://212.73.217.176:5050/inventory/returnedRequest/${deviceId}/${requestId}`,
        {admin: user.id}
      )
      .then(() => {
        toast.success("Matériel retourné avec succès");
      })
      .catch((err) => {
        toast.error(err.response.data);
        console.log(err);
      });
  };

  const columns = [
    {field: "id", headerName: "ID", width: 100, hide: true},
    {
      field: "image",
      headerName: "Image",
      width: 75,
      renderCell: (params) => {
        return <Avatar src={params.value} sx={{width: 50, height: 50}} />;
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
              navigate("/deviceHistory/" + params.value);
            }}
          >
            <Typography sx={{fontFamily: "poppins-regular", fontSize: 14}}>
              {params.value}
            </Typography>
          </Button>
        );
      },
    },
    {field: "label", headerName: "Nom", width: 200},
    {field: "reference", headerName: "Référence", width: 125},
    {field: "category", headerName: "Catégorie", width: 100},
    {field: "campus", headerName: "Campus", width: 100},
    {field: "requesterId", headerName: "Demandeur", width: 250},
    {field: "startDate", headerName: "Debut", width: 130},
    {field: "endDate", headerName: "Fin", width: 130},
    {
      field: "groupe",
      headerName: "Groupe",
      width: 100,
      renderCell: (params) => {
        return (
          <Button
            sx={{
              backgroundColor: "#1E4675",
              "&:hover": {
                backgroundColor: "#2868B6",
              },
            }}
            onClick={() => {
              params.value.lenght !== 0 && setOpenDialog(true);
              setGroupeEmails(params.value);
            }}
          >
            {/* {<p>{params.value.length !== 0 ? params.value.length : "Aucun"}</p>} */}
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                fontSize: 14,
                textOverflow: "ellipsis",
                overflow: "hidden",
                cursor: "pointer",
                color: "#fff",
                textTransform: "none",
              }}
            >
              {params.value && params.value.length !== 0
                ? params.value.length
                : "Aucun"}
            </Typography>
          </Button>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <Button
            sx={{
              fontFamily: "poppins-regular",
              color: "white",
              backgroundColor: "#5A756F",

              "&:hover": {
                backgroundColor: "#7D9E96",
              },
            }}
            onClick={() => {
              handleReturnClick(params.row.deviceId, params.row.requestId);
            }}
          >
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                fontSize: 14,
                textTransform: "none",
              }}
            >
              Rendu
            </Typography>
          </Button>
        );
      },
    },
  ];

  const rows = data
    .sort(
      (a, b) =>
        timeConverter(b.device.createdAt) - timeConverter(a.device.createdAt)
    )
    .map((item, i) => {
      return {
        id: i,
        deviceId: item.device.id,
        requestId: item.request && item.request.id,
        image: item.device.image,
        label: item.device.label,
        reference: item.device.reference,
        category: item.device.category,
        campus: item.device.campus,
        requesterId: item.request && item.request.requesterId,
        startDate:
          item.request &&
          moment(timeConverter(item.request.startDate)).format("DD.MM.YYYY"),
        endDate: moment(
          item.request && timeConverter(item.request.endDate)
        ).format("DD.MM.YYYY"),
        groupe: item.request && item.request.group,
      };
    });

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <UserListDialog
            open={openDialog}
            toogleDialog={toogleDialog}
            emails={groupeEmails}
          />
          <SideBarModify
            open={openModify}
            toggleDrawerModify={toggleDrawerModify}
            deviceId={clickedDeviceId}
          />

          <Toaster position="bottom-left" />
          <GridData columns={columns} rows={rows} />
        </>
      )}
    </div>
  );
}
