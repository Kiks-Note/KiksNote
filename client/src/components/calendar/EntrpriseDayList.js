import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import DeleteIcon from "@mui/icons-material/Delete";

  // * Pagination for the table
  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <Pagination
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
  }
export default function Calendar(props) {
  const [sortedDays, setSortedDays] = useState([]);

  useEffect(() => {
    if (props.entrepriseDaysList) {
      setSortedDays(props.entrepriseDaysList);
    }
  }, [props.entrepriseDaysList, setSortedDays]);

  const columns = [
    { field: "title", headerName: "Titre", flex: 1 },
    { field: "start", headerName: "Début", flex: 1 },
    { field: "end", headerName: "Fin", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Supprimer",
      flex: 1,
      disableReorder: true,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon sx={{ color: "red" }} />}
          label="Supprimer "
          onClick={() => handleRowSelection(params)}
        />,
      ],
    },
  ];

  const handleRowSelection = (params) => {
    const updatedDays = sortedDays.filter((day) => day.id !== params.id);
    setSortedDays(updatedDays);

    // Make axios request to delete the selected event from the backend
    axios
      .delete(`http://localhost:5050/calendar/${params.id}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <DataGrid
      rows={sortedDays}
      columns={columns}
      autoHeight
      disableSelectionOnClick
      components={{
        Pagination: CustomPagination,
      }}
      disableColumnFilter
      disableColumnSelector
      disableDensitySelector
      disableColumnMenu
    />
  );
}
