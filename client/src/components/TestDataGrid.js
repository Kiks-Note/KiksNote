import {grey} from "@mui/material/colors";
import {Box} from "@mui/system";
import {DataGrid, gridClasses} from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, {useEffect, useMemo, useState} from "react";
import DeviceActions from "./inventory/DeviceActions";

export default function TestDataGrid() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);

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
              const request = {device: item, request: requestRes.data};
              requests.push(request);
            } catch (err) {
              console.log(err);
              const request = {device: item, request: null};
              requests.push(request);
            }
          }
          console.log(requests);
          setData(requests);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  const columns = useMemo(
    () => [
      {field: "id", headerName: "ID", width: 10},
      {field: "deviceId", headerName: "Matériel ID", width: 210},
      {field: "label", headerName: "Nom", width: 200},
      {field: "ref", headerName: "Référence", width: 130},
      {field: "category", headerName: "Catégorie", width: 100},
      {field: "campus", headerName: "Campus", width: 70, editable: true},
      {
        field: "status",
        headerName: "Statut",
        width: 130,
        type: "singleSelect",
        valueOptions: ["Disponible", "Demandé", "Indisponible", "Emprunté"],
        editable: true,

        preProcessEditValue: (params) => {
          const {value} = params;
          return value === "Disponible"
            ? "available"
            : value === "Demandé"
            ? "requested"
            : value === "Indisponible"
            ? "unavailable"
            : "borrowed";
        },
      },
      {field: "requestID", headerName: "ID demande", width: 200},
      {
        field: "requestDate",
        headerName: "Date de demande",
        width: 150,
        renderCell: (params) => {
          return moment(params.row.createdAt).format("DD.MM.YYYY à HH:mm");
        },
      },
      {
        field: "startDate",
        headerName: "Date début",
        width: 100,
        renderCell: (params) => {
          return moment(params.row.date).format("DD.MM.YYYY");
        },
      },
      {
        field: "endDate",
        headerName: "Date fin",
        width: 100,
        renderCell: (params) => {
          return moment(params.row.fin).format("DD.MM.YYYY");
        },
      },
      {field: "requester", headerName: "Demandeur", width: 190},
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        renderCell: (params) => (
          <DeviceActions {...{params, rowId, setRowId}} />
        ),
      },
    ],
    [rowId]
  );

  const rows = data.map((item, i) => {
    return {
      id: i,
      deviceId: item.device.id,
      label: item.device.label,
      ref: item.device.ref,
      category: item.device.category,
      campus: item.device.campus,
      status:
        item.device.status === "available"
          ? "Disponible"
          : item.device.status === "requested"
          ? "Demandé"
          : item.device.status === "unavailable"
          ? "Indisponible"
          : item.device.status === "borrowed"
          ? "Emprunté"
          : "Inconnu",
      requestID: ["borrowed", "requested"].includes(item.device.status)
        ? item.request.id
        : "N/A",
      requestDate: ["borrowed", "requested"].includes(item.device.status)
        ? item.request.createdAt
        : null,
      startDate: ["borrowed", "requested"].includes(item.device.status)
        ? item.request.startDate
        : null,
      endDate: ["borrowed", "requested"].includes(item.device.status)
        ? item.request.endDate
        : null,
      requester: ["borrowed", "requested"].includes(item.device.status)
        ? item.request.requester
        : "N/A",
    };
  });

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Box sx={{height: 800}}>
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.id}
            getRowSpacing={(params) => ({
              top: params.isFirstVisible ? 0 : 5,
              bottom: params.isLastVisible ? 0 : 5,
            })}
            sx={{
              [`& .${gridClasses.row}`]: {
                bgcolor: grey[200],
              },
            }}
            onCellEditCommit={(params) => setRowId(params.id)}
          />
        </Box>
      )}
    </div>
  );
}
