import React, { useContext } from "react";
import PropTypes from "prop-types";
import {
  DataGrid,
  GridToolbarQuickFilter,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import LaunchIcon from "@mui/icons-material/Launch";
import OverView from "../../../pages/board_scrum/overview/OverView";

TableDashboard.propTypes = {
  addTab: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
};
TableDashboard.defaultProps = {
  addTab: () => {},
};
export default function TableDashboard({ addTab, rows }) {
  const moveToOverView = (event) => {
    var x = JSON.parse(localStorage.getItem("tabs")) || [];
    x.push({
      id: event.id,
      label: `OverView ${event.row.sprint_group}`,
      closeable: true,
      tab: "OverView " + event.row.sprint_group,
      component: <OverView id={event.id} addTab={addTab} />,
    });
    localStorage.setItem("tabs", JSON.stringify(x));

    addTab({
      id: event.id,
      label: `OverView ${event.row.sprint_group}`,
      closeable: true,
      tab: "OverView " + event.row.sprint_group,
      component: <OverView id={event.id} addTab={addTab} />,
    });
  };

  const columns = [
    {
      field: "sprint_name",
      headerName: "Nom du sprint",
      flex: 1,
    },
    {
      field: "sprint_group",
      headerName: "Groupe du sprint",
      flex: 1,
    },
    {
      field: "start",
      headerName: "Date de début",
      flex: 1,
    },
    {
      field: "end",
      headerName: "Date de fin",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Accès au board",
      flex: 1,
      disableReorder: true,
      getActions: (params) => [
        <GridActionsCellItem
          label="Accéder au board"
          icon={<LaunchIcon />}
          onClick={() => moveToOverView(params)}
        />,
      ],
    },
  ];
  // * Search bar with Modal for
  function QuickSearchToolbar() {
    return (
      <>
        <Stack
          direction="row"
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={2}
          sx={{
            margin: 2,
            p: 0.5,
            pb: 0,
          }}
        >
          <GridToolbarQuickFilter
            quickFilterParser={(searchInput) =>
              searchInput.split(",").map((value) => value.trim())
            }
            quickFilterFormatter={(quickFilterValues) =>
              quickFilterValues.join(", ")
            }
            debounceMs={200} // time before applying the new quick filter value
            placeholder="Recherche"
          />
        </Stack>
      </>
    );
  }
  // * Icon for the column
  function SortedDescendingIcon() {
    return <ExpandMoreIcon className="icon" />;
  }
  //*  Icon for the column
  function SortedAscendingIcon() {
    return <ExpandLessIcon className="icon" />;
  }
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

  return (
    <DataGrid
      autoHeight
      sx={{
        border: "none",
        "& .MuiDataGrid-columnHeader, .MuiDataGrid-row": {
          borderBottom: "none",
          textTransform: "uppercase",
          fontWeight: 600,
        },
        "& .MuiDataGrid-row.Mui-selected": {
          backgroundColor: "#dfe3e6",
        },
        "& .MuiDataGrid-cell": {
          padding: "8px 16px",
        },
        "& .icon": {
          fontSize: "1rem",
        },
        "& .MuiDataGrid-actionsCell": {
          padding: 0,
        },
        "& .MuiDataGrid-iconSeparator": {
          display: "none",
        },
        "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
          borderRight: "1px solid #dfe3e6",
        },
        "& .MuiDataGrid-columnsContainer": {
          backgroundColor: "#e2e4e6",
        },
      }}
      rows={rows}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      componentsProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
      components={{
        Toolbar: QuickSearchToolbar,
        ColumnSortedDescendingIcon: SortedDescendingIcon,
        ColumnSortedAscendingIcon: SortedAscendingIcon,
        Pagination: CustomPagination,
      }}
      disableColumnFilter
      disableColumnSelector
      disableDensitySelector
      disableColumnMenu
      isRowSelectable={() => false}
    />
  );
}
// * Column of table
