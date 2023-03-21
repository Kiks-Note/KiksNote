import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {toast, Toaster} from "react-hot-toast";
import {Rings} from "react-loader-spinner";
import TestDataGrid from "../../components/TestDataGrid";
import {TestTable} from "../../components/TestTable";

export default function InventoryDevices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [changedValue, setChangedValue] = useState("");
  const [modifiedCells, setModifiedCells] = useState([]);
  const admin = true;
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
        // console.log(requests);
        setData(requests);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCellEditStop = (params) => {
    // Add modified cell data to state variable
    const {id, field, value} = params;
    const index = modifiedCells.findIndex(
      (cell) => cell.id === id && cell.value !== undefined
    );
    if (index !== -1) {
      setModifiedCells((prev) => [
        ...prev.slice(0, index),
        {...prev[index], field, value: changedValue},
        ...prev.slice(index + 1),
      ]);
    } else {
      setModifiedCells((prev) => [...prev, {id, field, value: changedValue}]);
    }
  };

  const handleValidate = async () => {
    console.log(
      "modifiedCells",
      modifiedCells.map((cell) => cell)
    );
    try {
      // Send PUT request to server with modified cell data
      await axios
        .put("http://localhost:5050/inventory/edit", modifiedCells)
        .then(() => {
          loadData().then(() => {
            setModifiedCells([]);
            setChangedValue("");
            toast.success("Modifications enregistrées avec succès!");
          });
        });
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement des modifications!");
    }
  };

  const changedValueGetter = (params) => {
    const {id, field} = params;
    const modifiedCell = modifiedCells.find(
      (cell) => cell.id === id && cell.field == field
    );

    if (modifiedCell) {
      if (field === "date" || field === "fin") {
        return new Date(modifiedCell.value);
      } else {
        return modifiedCell.value;
      }
    } else {
      return params.value;
    }
  };

  const columns = [
    {field: "id", headerName: "Matériel ID", width: 210},
    {
      field: "label",
      headerName: "Nom",
      width: 210,
      editable: admin && editMode,

      renderEditCell: (params) => (
        <input
          type="text"
          value={changedValue}
          onChange={(e) => {
            setChangedValue(e.target.value);
          }}
          style={{width: "100%", height: "100%", border: "none"}}
        />
      ),
      valueGetter: (params) => changedValueGetter(params),
    },
    {
      field: "ref",
      headerName: "Référence",
      width: 130,
    },
    {
      field: "category",
      headerName: "Catégorie",
      width: 130,
      editable: admin && editMode,
      renderEditCell: (params) => (
        <input
          type="text"
          value={changedValue}
          onChange={(e) => {
            setChangedValue(e.target.value);
          }}
          style={{width: "100%", height: "100%", border: "none"}}
        />
      ),
      valueGetter: (params) => changedValueGetter(params),
    },
    {
      field: "campus",
      headerName: "Campus",
      width: 130,
      editable: admin && editMode,
      renderEditCell: (params) => (
        <input
          type="text"
          value={changedValue}
          onChange={(e) => {
            setChangedValue(e.target.value);
          }}
          style={{width: "100%", height: "100%", border: "none"}}
        />
      ),
      valueGetter: (params) => changedValueGetter(params),
    },
    {
      field: "status",
      headerName: "Statut",
      width: 130,
      editable: admin && editMode,
      renderEditCell: (params) => (
        <Select
          fullWidth
          style={{height: "100%", border: "none"}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={changedValue}
          displayEmpty
          onChange={(e) => {
            setChangedValue(e.target.value);
          }}
        >
          <MenuItem value={"available"}>Disponible</MenuItem>
          <MenuItem value={"unavailable"}>Indisponible</MenuItem>
          <MenuItem value={"borrowed"}>Emprunté</MenuItem>
          <MenuItem value={"requested"}>Demandé</MenuItem>
        </Select>
      ),

      valueGetter: (params) => changedValueGetter(params),
    },
    {field: "requestID", headerName: "ID de la demande", width: 200},
    {
      field: "date",
      headerName: "Date de début",
      width: 190,
      editable: admin && editMode,
      type: "dateTime",
      valueGetter: (params) => changedValueGetter(params),
    },
    {
      field: "fin",
      headerName: "Date de fin",
      width: 190,
      editable: admin && editMode,
      type: "dateTime",
      valueGetter: (params) => changedValueGetter(params),
    },
    {
      field: "requester",
      headerName: "Demandeur",
      width: 130,
      editable: admin && editMode,

      renderEditCell: (params) => (
        <input
          type="text"
          value={changedValue}
          onChange={(e) => {
            setChangedValue(e.target.value);
          }}
          style={{width: "100%", height: "100%", border: "none"}}
        />
      ),
      valueGetter: (params) => changedValueGetter(params),
    },
  ];

  const rows = data.map((item) => {
    return {
      id: item.device.id,
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
      date: ["borrowed", "requested"].includes(item.device.status)
        ? new Date(item.request.startDate)
        : null,
      fin: ["borrowed", "requested"].includes(item.device.status)
        ? new Date(item.request.endDate)
        : null,
      requester: ["borrowed", "requested"].includes(item.device.status)
        ? item.request.requester
        : "N/A",
    };
  });

  return (
    <div>
      <TestTable />
      {/* <TestDataGrid /> */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Typography variant="h5" sx={{marginBottom: 2}}>
          Liste de tout les matériels
        </Typography>
        {admin && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setEditMode(!editMode);
              }}
            >
              {editMode ? "Quitter le mode édition" : "Mode édition"}
            </Button>
            {editMode && (
              <>
                <Button variant="contained" onClick={() => handleValidate()}>
                  Valider
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setModifiedCells([])}
                >
                  Annuler
                </Button>
              </>
            )}
          </div>
        )}
      </div>
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
          <DataGrid
            rows={rows}
            columns={admin && columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            style={{
              fontFamily: "poppins-regular",
              fontSize: "14px",
              color: "#000000",
            }}
            onCellEditStart={(params) => {
              setChangedValue(params.value);
            }}
            onCellEditStop={(params) => handleCellEditStop(params)}
          />
        </Box>
      )} */}
    </div>
  );
}
