import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Pagination from "@mui/material/Pagination";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import StoryListToolBar from "./StoryListToolBar";

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

export default function StoryList({ stories, sprints, dashboardId }) {
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [sprint, setSprint] = useState([]);
  const [idDashboard, setDashbaordId] = useState(null);
  const [display, setDisplay] = useState(false);
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "desc",
      headerName: "Description",
      width: 400,
      renderCell: (params) => (
        <span>
          {params.value.length > 40
            ? `${params.value.substring(0, 40)}...`
            : params.value}
        </span>
      ),
    },
  ];

  const handleSelectionModelChange = (newSelection) => {
    setSelected(rows.filter((row) => newSelection.includes(row.id)));
  };

  useEffect(() => {
    setRows(stories);
    setSprint(sprints);
    setDashbaordId(dashboardId);
    setDisplay(true);
  }, []);
  return (
    <>
      {display ? (
        <DataGrid
          style={{
            "& .MuiDataGridVirtualScroller": {
              width: "fit-content",
            },
            maxHeight: "44vh",
          }}
          rows={rows}
          columns={columns}
          pageSize={5}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          components={{
            Toolbar: (props) => (
              <StoryListToolBar
                dashboardId={idDashboard}
                allReleases={sprint}
                storiesSelected={selected}
                {...props}
              />
            ),
            Pagination: CustomPagination,
          }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableColumnMenu
          checkboxSelection
          disableSelectedRowCount
          pagination
          onSelectionModelChange={handleSelectionModelChange}
        />
      ) : (
        <></>
      )}
    </>
  );
}
StoryList.propTypes = {
  stories: PropTypes.array.isRequired,
  sprints: PropTypes.object.isRequired,
  dashboardId: PropTypes.string.isRequired,
};
