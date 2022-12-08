import * as React from "react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Modal from "../modal/Modal";
import Stack from "@mui/material/Stack";

// Search bar
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
        <GridToolbarQuickFilter />
        <Modal />
      </Stack>
    </>
  );
}
// Icon for the column
export function SortedDescendingIcon() {
  return <ExpandMoreIcon className="icon" />;
}
// Icon for the column
export function SortedAscendingIcon() {
  return <ExpandLessIcon className="icon" />;
}

export default function TableBoard({ rows, columns }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        sx={{
          margin: 4,
          boxShadow: 2,
          border: 2,
          borderColor: "primary.light",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
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
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableColumnMenu
      />
    </div>
  );
}
