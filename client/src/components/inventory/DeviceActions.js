import Check from "@mui/icons-material/Check";
import Save from "@mui/icons-material/Save";
import {Box, CircularProgress, Fab} from "@mui/material";
import {green} from "@mui/material/colors";
import React, {useState} from "react";
import axios from "axios";

const DeviceActions = ({params, rowId, setRowId}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const {label, ref, category, campus, status, deviceId} = params.row;
    console.log(params.row);
    const res = await axios.put(
      `http://212.73.217.176:5050/inventory/edit/${deviceId}`,
      {
        label,
        ref,
        category,
        campus,
        status,
        lastModifiedBy: "admin",
      }
    );

    if (res) {
      setSuccess(true);
      setRowId(null);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        m: 1,
        position: "relative",
      }}
    >
      {success ? (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
            bgcolor: green[500],
            "&:hover": {
              bgcolor: green[700],
            },
          }}
        >
          <Check />
        </Fab>
      ) : (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
          }}
          disabled={params.id !== rowId || loading}
          onClick={handleClick}
        >
          <Save />
        </Fab>
      )}
      {loading && (
        <CircularProgress
          size={52}
          sx={{
            color: green[500],
            position: "absolute",
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

export default DeviceActions;
