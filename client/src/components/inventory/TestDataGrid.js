import {Box} from "@mui/system";
import {DataGrid} from "@mui/x-data-grid";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {w3cwebsocket} from "websocket";
import timeConverter from "../../functions/TimeConverter";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBarModify from "./SideBarModify";
import CustomSnackbar from "./CustomSnackBar";
import axios from "axios";
import {toast, Toaster} from "react-hot-toast";
import {Avatar, Button, Typography} from "@mui/material";
import theme from "../../theme";
import {useNavigate} from "react-router-dom";

export default function TestDataGrid() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(15);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const ws = new w3cwebsocket(
        `${process.env.REACT_APP_SERVER_API_WS}/liveInventory`
      );
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log(data);
        setData(data);
        setLoading(false);
      };
    })();
  }, []);

  const toggleDrawerModify = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenModify(open);
  };

  const handleDeleteClick = async () => {
    setIsMenuOpen(false);
    setSnackBarOpen(false);

    await axios
      .delete(
        `${process.env.REACT_APP_SERVER_API}/inventory/device/${deviceId}`
      )
      .then((res) => {
        toast.success("Matériel supprimé avec succès");
      })
      .catch((err) => {
        toast.error("Une erreur est survenue");
        console.log(err);
      });
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-semibold"}}>
            {params.row.id}
          </Typography>
        );
      },
    },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => {
        return <Avatar src={params.row.image} sx={{width: 50, height: 50}} />;
      },
    },
    {
      field: "deviceId",
      headerName: "Matériel ID",
      width: 225,
      renderCell: (params) => {
        return (
          <Button
            sx={{
              fontFamily: "poppins-regular",
              color: "white",
              fontSize: 12,
            }}
            onClick={() => {
              navigate("/deviceHistory/" + params.row.deviceId);
            }}
          >
            <Typography sx={{fontSize: 14}}>{params.row.deviceId}</Typography>
          </Button>
        );
      },
    },
    {
      field: "label",
      headerName: "Nom",
      width: 200,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular"}}>
            {params.row.label}
          </Typography>
        );
      },
    },
    {
      field: "reference",
      headerName: "Référence",
      width: 175,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular"}}>
            {params.row.reference}
          </Typography>
        );
      },
    },
    {
      field: "category",
      headerName: "Catégorie",
      width: 150,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular"}}>
            {params.row.category}
          </Typography>
        );
      },
    },
    {
      field: "campus",
      headerName: "Campus",
      width: 100,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular"}}>
            {params.row.campus}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Statut",
      width: 130,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular"}}>
            {params.row.status}
          </Typography>
        );
      },
    },
    {
      field: "condition",
      headerName: "Etat",
      width: 130,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular"}}>
            {params.row.condition}
          </Typography>
        );
      },
    },
    {
      field: "date",
      headerName: "Ajouté le",
      width: 130,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular"}}>
            {params.row.date}
          </Typography>
        );
      },
    },
    {
      field: "acquisitiondate",
      headerName: "Acquis le",
      width: 130,
      renderCell: (params) => {
        return (
          <Typography sx={{fontFamily: "poppins-regular"}}>
            {params.row.acquisitiondate}
          </Typography>
        );
      },
    },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              // justifyContent: "space-between",
            }}
          >
            <EditRoundedIcon
              style={{color: "white", cursor: "pointer"}}
              sx={{mr: 2}}
              onClick={(e) => {
                setDeviceId(params.row.deviceId);
                toggleDrawerModify(e, true);
              }}
            />
            <DeleteIcon
              style={{color: "#de2828", cursor: "pointer"}}
              onClick={() => {
                setSnackBarOpen(true);
                setIsMenuOpen(false);
                setDeviceId(params.row.deviceId);
              }}
            />
          </div>
        );
      },
    },
  ];

  const rows = data.map((item, i) => {
    return {
      id: i,
      image: item.image,
      deviceId: item.id,
      label: item.label,
      reference: item.reference,
      category: item.category,
      campus: item.campus,
      status:
        item.status === "available"
          ? "Disponible"
          : item.status === "requested"
          ? "Demandé"
          : item.status === "unavailable"
          ? "Indisponible"
          : item.status === "borrowed"
          ? "Emprunté"
          : "Inconnu",
      condition:
        item.condition === "new"
          ? "Neuf"
          : item.condition === "used"
          ? "Usagé"
          : item.condition === "broken"
          ? "Cassé"
          : item.condition === "lost"
          ? "Perdu"
          : item.condition === "missing"
          ? "Manquant"
          : item.condition === "good"
          ? "Bon état"
          : item.condition === "bad"
          ? "Mauvais état"
          : "Inconnu",

      date: moment(timeConverter(item.createdAt)).format("DD.MM.YYYY"),
      acquisitiondate: moment(timeConverter(item.acquisitiondate)).format(
        "DD.MM.YYYY"
      ),
    };
  });

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <SideBarModify
            open={openModify}
            toggleDrawerModify={toggleDrawerModify}
            deviceId={deviceId}
          />
          <CustomSnackbar
            open={snackBarOpen}
            setOpen={setSnackBarOpen}
            message="Voulez-vous vraiment supprimer cet appareil ?"
            onClickCheck={() => {
              handleDeleteClick();
            }}
            onClickClose={() => {
              setSnackBarOpen(false);
            }}
          />
          <Toaster position="bottom-left" />
          <Box sx={{height: 800}}>
            <DataGrid
              isRowSelectable={false}
              columns={columns}
              rows={rows}
              pageSize={pageSize}
              rowHeight={60}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[15, 30, 50]}
              // sx={{background: "white"}}
              disableSelectionOnClick
              sx={{
                background: theme.colors.background.dark,
                color: "white",
                "& .MuiIconButton-root": {
                  color: "white",
                },
              }}
              localeText={{
                noRowsLabel: "Pas de résultats",
                noResultsOverlayLabel: "Aucun résultat.",

                // Density selector toolbar button text
                toolbarDensity: "Densité",
                toolbarDensityLabel: "Densité",
                toolbarDensityCompact: "Compact",
                toolbarDensityStandard: "Standard",
                toolbarDensityComfortable: "Confortable",

                // Columns selector toolbar button text
                toolbarColumns: "Colonnes",
                toolbarColumnsLabel: "Choisir les colonnes",

                // Filters toolbar button text
                toolbarFilters: "Filtres",
                toolbarFiltersLabel: "Afficher les filtres",
                toolbarFiltersTooltipHide: "Cacher les filtres",
                toolbarFiltersTooltipShow: "Afficher les filtres",
                toolbarFiltersTooltipActive: (count) =>
                  count > 1
                    ? `${count} filtres actifs`
                    : `${count} filtre actif`,

                // Quick filter toolbar field
                toolbarQuickFilterPlaceholder: "Recherche…",
                toolbarQuickFilterLabel: "Recherche",
                toolbarQuickFilterDeleteIconLabel: "Supprimer",

                // Export selector toolbar button text
                toolbarExport: "Exporter",
                toolbarExportLabel: "Exporter",
                toolbarExportCSV: "Télécharger en CSV",
                toolbarExportPrint: "Imprimer",
                toolbarExportExcel: "Télécharger pour Excel",

                // Columns panel text
                columnsPanelTextFieldLabel: "Chercher colonne",
                columnsPanelTextFieldPlaceholder: "Titre de la colonne",
                columnsPanelDragIconLabel: "Réorganiser la colonne",
                columnsPanelShowAllButton: "Tout afficher",
                columnsPanelHideAllButton: "Tout cacher",

                // Filter panel text
                filterPanelAddFilter: "Ajouter un filtre",
                // filterPanelRemoveAll: 'Remove all',
                filterPanelDeleteIconLabel: "Supprimer",
                filterPanelLogicOperator: "Opérateur logique",
                filterPanelOperator: "Opérateur",
                filterPanelOperatorAnd: "Et",
                filterPanelOperatorOr: "Ou",
                filterPanelColumns: "Colonnes",
                filterPanelInputLabel: "Valeur",
                filterPanelInputPlaceholder: "Filtrer la valeur",

                // Filter operators text
                filterOperatorContains: "Contient",
                filterOperatorEquals: "Égal à",
                filterOperatorStartsWith: "Commence par",
                filterOperatorEndsWith: "Se termine par",
                filterOperatorIs: "Est",
                filterOperatorNot: "N'est pas",
                filterOperatorAfter: "Postérieur",
                filterOperatorOnOrAfter: "Égal ou postérieur",
                filterOperatorBefore: "Antérieur",
                filterOperatorOnOrBefore: "Égal ou antérieur",
                filterOperatorIsEmpty: "Est vide",
                filterOperatorIsNotEmpty: "N'est pas vide",
                filterOperatorIsAnyOf: "Fait partie de",

                // Filter values text
                filterValueAny: "Tous",
                filterValueTrue: "Vrai",
                filterValueFalse: "Faux",

                // Column menu text
                columnMenuLabel: "Menu",
                columnMenuShowColumns: "Afficher les colonnes",
                // columnMenuManageColumns: 'Manage columns',
                columnMenuFilter: "Filtrer",
                columnMenuHideColumn: "Cacher",
                columnMenuUnsort: "Annuler le tri",
                columnMenuSortAsc: "Tri ascendant",
                columnMenuSortDesc: "Tri descendant",

                // Column header text
                columnHeaderFiltersTooltipActive: (count) =>
                  count > 1
                    ? `${count} filtres actifs`
                    : `${count} filtre actif`,
                columnHeaderFiltersLabel: "Afficher les filtres",
                columnHeaderSortIconLabel: "Trier",

                // Rows selected footer text
                footerRowSelected: (count) =>
                  count > 1
                    ? `${count.toLocaleString()} lignes sélectionnées`
                    : `${count.toLocaleString()} ligne sélectionnée`,

                // Total row amount footer text
                footerTotalRows: "Lignes totales :",

                // Total visible row amount footer text
                footerTotalVisibleRows: (visibleCount, totalCount) =>
                  `${visibleCount.toLocaleString()} sur ${totalCount.toLocaleString()}`,

                // Checkbox selection text
                checkboxSelectionHeaderName: "Sélection",
                checkboxSelectionSelectAllRows:
                  "Sélectionner toutes les lignes",
                checkboxSelectionUnselectAllRows:
                  "Désélectionner toutes les lignes",
                checkboxSelectionSelectRow: "Sélectionner la ligne",
                checkboxSelectionUnselectRow: "Désélectionner la ligne",

                // Boolean cell text
                booleanCellTrueLabel: "Vrai",
                booleanCellFalseLabel: "Faux",

                // Actions cell more text
                actionsCellMore: "Plus",

                // Column pinning text
                pinToLeft: "Épingler à gauche",
                pinToRight: "Épingler à droite",
                unpin: "Désépingler",

                // Tree Data
                treeDataGroupingHeaderName: "Groupe",
                treeDataExpand: "Afficher les enfants",
                treeDataCollapse: "Masquer les enfants",

                // Grouping columns
                groupingColumnHeaderName: "Groupe",
                groupColumn: (name) => `Grouper par ${name}`,
                unGroupColumn: (name) => `Arrêter de grouper par ${name}`,

                // Master/detail
                detailPanelToggle: "Afficher/masquer les détails",
                expandDetailPanel: "Afficher",
                collapseDetailPanel: "Masquer",

                // Row reordering text
                rowReorderingHeaderName: "Positionnement des lignes",

                // Aggregation
                // aggregationMenuItemHeader: 'Aggregation',
                // aggregationFunctionLabelSum: 'sum',
                // aggregationFunctionLabelAvg: 'avg',
                // aggregationFunctionLabelMin: 'min',
                // aggregationFunctionLabelMax: 'max',
                // aggregationFunctionLabelSize: 'size',
              }}
            />
          </Box>
        </>
      )}
    </div>
  );
}
