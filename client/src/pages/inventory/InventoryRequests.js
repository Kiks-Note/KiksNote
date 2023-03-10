import CheckIcon from "@mui/icons-material/Check";
import {Box, IconButton, Tooltip, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {toast, Toaster} from "react-hot-toast";
import {Rings} from "react-loader-spinner";
import ClearIcon from "@mui/icons-material/Clear";
import moment from "moment";

export const InventoryRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      await axios
        .get("http://localhost:5050/inventory")
        .then(async (inventoryRes) => {
          const inventoryItems = inventoryRes.data;
          const requests = [];
          for (const item of inventoryItems) {
            const requestId = item.lastRequestId;
            try {
              const requestRes = await axios.get(
                `http://localhost:5050/inventory/request/${requestId}`
              );
              const request = {_device: item, _request: requestRes.data};
              requests.push(request);
            } catch (err) {
              console.log(err);
              const request = {_device: item, _request: null};
              requests.push(request);
            }
          }
          setRequests(requests);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  const handleAcceptRequest = async (deviceId, requestId) => {
    await axios
      .put(
        `http://localhost:5050/inventory/acceptrequest/${deviceId}/${requestId}`
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRefuseRequest = async (deviceId, requestId) => {
    toast.promise(
      axios.put(
        `http://localhost:5050/inventory/refuserequest/${deviceId}/${requestId}`
      ),
      {
        loading: "Refus de la demande...",
        success: "Demande refusée" + requestId,
        error: "Erreur lors du refus de la demande",
      }
    );
  };

  const renderActionCell = (params) => {
    const {row} = params;
    const deviceId = row.id;
    const requestId = row.lastRequestId;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Tooltip title="Accepter la demande">
          <IconButton onClick={() => handleAcceptRequest(deviceId, requestId)}>
            <CheckIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Refuser la demande">
          <IconButton onClick={() => handleRefuseRequest(deviceId, requestId)}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  return (
    <div>
      <Typography variant="h5" sx={{marginBottom: 2}}>
        Demandes de matériel
      </Typography>
      <Toaster position="bottom-left" />
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
        <Box sx={{height: 800}}>
          {/* {console.log(requests)} */}
          <DataGrid
            rows={
              requests
                ? requests
                    .filter((request) => request._request.status === "pending")
                    .map((request) => {
                      return {
                        id: request._device.id,
                        lastRequestId: request._device.lastRequestId,
                        label: request._device.label,
                        ref: request._device.ref,
                        category: request._device.category,
                        campus: request._device.campus,
                        requester: request._request.requester,
                        date: request._request
                          ? moment(request._request.startDate).format(
                              "DD/MM/YYYY"
                            )
                          : "",
                        fin: request._request
                          ? moment(request._request.endDate).format(
                              "DD/MM/YYYY"
                            )
                          : "",
                      };
                    })
                : []
            }
            columns={[
              {field: "id", headerName: "Matériel ID", width: 210},
              {field: "lastRequestId", headerName: "Demande ID", width: 210},
              {field: "label", headerName: "Nom", width: 130},
              {field: "ref", headerName: "Référence", width: 130},
              {field: "category", headerName: "Catégorie", width: 130},
              {field: "campus", headerName: "Campus", width: 130},
              {
                field: "requester",
                headerName: "Demandeur",
                width: 250,
                resizable: true,
              },
              {field: "date", headerName: "Pour le", width: 130},
              {field: "fin", headerName: "Fin le", width: 130},

              {
                field: "action",
                headerName: "Action",
                width: 100,
                renderCell: renderActionCell,
                headerAlign: "center",
              },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            style={{fontFamily: "poppins-regular"}}
          />
        </Box>
      )}
    </div>
  );
};
