import React from "react";
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
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
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
        />
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

export default function TableBoard({ rows, addFavorite, deleteBoards }) {
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
      headerName: "Parametres",
      flex: 1,
      disableReorder: true,
      getActions: (params) => [
        <GridActionsCellItem
          color="primary"
          icon={<OpenInNewIcon color="primary" />}
          label="Ouvrir le board"
          showInMenu
        />,
        <GridActionsCellItem
          icon={<DeleteIcon sx={{ color: "red" }} />}
          label="Supprimer le board"
          onClick={deleteBoards(params.id)}
          showInMenu
        />,
        params.row.favorite === true ? (
          <GridActionsCellItem
            icon={<StarIcon sx={{ color: "purple" }} />}
            onClick={addFavorite(params.id)}
            label="Supprimer un favoris "
            showInMenu
          />
        ) : (
          <GridActionsCellItem
            icon={<StarBorderIcon sx={{ color: "purple" }} />}
            onClick={addFavorite(params.id)}
            label="Mettre en favoris"
            showInMenu
          />
        ),
      ],
    },
  ];

  return (
    <DataGrid
      autoHeight
      sx={{
        border: "none",
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
