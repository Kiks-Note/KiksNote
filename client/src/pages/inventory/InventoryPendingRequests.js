import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {Button, Typography} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {Toaster, toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {w3cwebsocket} from "websocket";
import GridData from "../../components/inventory/GridData";
import {UserListDialog} from "../../components/inventory/UserListDialog";
import timeConverter from "../../functions/TimeConverter";
import useFirebase from "../../hooks/useFirebase";

function InventoryPendingRequests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailsDialogOpen, setEmailsDialogOpen] = useState(false);
  const [emails, setEmails] = useState([]);

  const {user} = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    loading &&
      (async () => {
        const ws = new w3cwebsocket(
          `${process.env.REACT_APP_SERVER_API_WS}/pendingRequests`
        );

        const wsReqs = (ws.onmessage = (e) => {
          const data = JSON.parse(e.data);
          setData(data);
          console.log(data);
        });

        Promise.all(wsReqs).then(() => setLoading(false));
      })();
  }, [loading]);

  const handleAcceptRequest = async (requestId, deviceId) => {
    await axios
      .put(
        {admin: user.id}
      )
      .catch((err) => {
        toast.error(err.response.data);
        console.log(err);
      });
  };

  const handleRefuseRequest = async (requestId, deviceId) => {
    await axios
      .put(
        `${process.env.REACT_APP_SERVER_API}/inventory/refuseRequest/${deviceId}/${requestId}`,
        {admin: user.id}
      )
      .then(() => {
        toast.success("Demande refusée avec succès");
      })
      .catch((err) => {
        toast.error(err.response.data);
        console.log(err);
      });
  };

  const columns = [
    {
      field: "device",
      headerName: "Device",
      width: 200,
      renderCell: (params) => (
        <Button
          sx={{
            fontFamily: "poppins-regular",
            color: "white",
            backgroundColor: "#D08768",
            width: "90%",
            overflow: "hidden",
            textOverflow: "ellipsis",

            "&:hover": {
              backgroundColor: "#A76346",
            },
          }}
          onClick={() => {
            navigate("/deviceHistory/" + params?.value);
          }}
        >
          <Typography
            sx={{
              fontFamily: "poppins-regular",
              fontSize: 14,
              textTransform: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params?.value}
          </Typography>
        </Button>
      ),
    },
    {field: "requester", headerName: "Demandeur", width: 150},
    {field: "startDate", headerName: "Date Debut", width: 150},
    {field: "endDate", headerName: "Date Fin", width: 150},
    {
      field: "group",
      headerName: "Groupe",
      width: 150,
      renderCell: (params) =>
        params?.value !== undefined ? (
          <Button
            sx={{
              backgroundColor: "#1E4675",
              "&:hover": {
                backgroundColor: "#2868B6",
              },
            }}
            onClick={() => {
              setEmailsDialogOpen(true);
              setEmails(params.row.group);
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontFamily: "poppins-regular",
                cursor: "pointer",
                textTransform: "capitalize",
                fontSize: 14,
              }}
            >
              {params?.value.length}
            </Typography>
          </Button>
        ) : (
          <Button
            sx={{
              backgroundColor: "#5A756F",
              "&:hover": {
                backgroundColor: "#7D9E96",
              },
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontFamily: "poppins-regular",
                cursor: "pointer",
                textTransform: "capitalize",
                fontSize: 14,
              }}
            >
              Seul
            </Typography>
          </Button>
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 175,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button
            sx={{
              backgroundColor: "#4FA280",

              "&:hover": {
                backgroundColor: "#1EA36C",
              },
            }}
            onClick={() =>
              handleAcceptRequest(params.row.id, params.row.device)
            }
          >
            <CheckIcon sx={{color: "white"}} />
          </Button>
          <Button
            sx={{
              backgroundColor: "#7B0D1E",
              width: 10,

              "&:hover": {
                backgroundColor: "#B00E1E",
              },
            }}
            onClick={() =>
              handleRefuseRequest(params.row.id, params.row.device)
            }
          >
            <CloseIcon sx={{color: "white"}} />
          </Button>
        </div>
      ),
    },
  ];

  const rows = data.map((r) => ({
    id: r.request.id,
    device: r.request.deviceId,
    requester: r.request.requesterId,
    startDate:
      r.request.startDate &&
      moment(timeConverter(r.request.startDate)).format("DD.MM.YYYY"),
    endDate:
      r.request.endDate &&
      moment(timeConverter(r.request.endDate)).format("DD.MM.YYYY"),
    group: r.request.group,
  }));

  return (
    <>
      <Toaster position="bottom-left" />
      <UserListDialog
        open={emailsDialogOpen}
        toogleDialog={setEmailsDialogOpen}
        emails={emails}
      />

      <GridData rows={rows} columns={columns} />
    </>
  );
}

export default InventoryPendingRequests;
