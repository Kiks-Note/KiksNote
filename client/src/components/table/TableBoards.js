import * as React from "react";
import {
  DataGrid,
  GridToolbarQuickFilter,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Modal from "../modal/Modal";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
            searchInput
              .split(",")
              .map((value) => value.trim())
              .filter((value) => value !== "")
          }
        />
        <Modal />
      </Stack>
    </>
  );
}

// * Icon for the column
export function SortedDescendingIcon() {
  return <ExpandMoreIcon className="icon" />;
}
//*  Icon for the column
export function SortedAscendingIcon() {
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

function Action() {
  const navigate = useNavigate();
  navigate("/board");
}
// * Column of table
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
    field: "favorite",
    headerName: "Favoris",
    flex: 1,
    disableReorder: true,
    type: "boolean",
    renderCell: ({ value }) => (value === true ? <FavoriteIcon color="secondary" /> : <FavoriteBorderSharpIcon />),
  },
  {
    field: "links",
    headerName: "Actions",
    flex: 1,
    disableReorder: true,
    onclick: Action,
    renderCell: ({ value }) => <Link href={value}>Accéder</Link>,
  },
];
export default function TableBoard({ rows }) {
  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        sx={{
          boxShadow: 1,
          border: 1,
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
    </div>
  );
}
