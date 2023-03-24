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
import {UserListDialog} from "./UserListDialog";

export default function BorrowedList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(15);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clickedDeviceId, setClickedDeviceId] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [groupeEmails, setGroupeEmails] = useState([]);

  useEffect(() => {
    (async () => {
      const ws = new w3cwebsocket("ws://localhost:5050/adminBorrowedList");
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setData(data);
        console.log(data);
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

  const toogleDialog = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenDialog(open);
  };

  const handleDeleteClick = async () => {
    setIsMenuOpen(false);
    setSnackBarOpen(false);

    toast.promise(
      await axios.delete(
        `http://localhost:5050/inventory/delete/${clickedDeviceId}`
      ),
      {
        success: (res) => {
          return "Matériel supprimé avec succès";
        },
        error: (err) => {
          console.log(err);
          return "Une erreur est survenue";
        },
      }
    );
  };

  const columns = [
    {field: "id", headerName: "ID", width: 100},
    {field: "deviceId", headerName: "Matériel ID", width: 225},
    {field: "label", headerName: "Nom", width: 200},
    {field: "ref", headerName: "Référence", width: 175},
    {field: "category", headerName: "Catégorie", width: 150},
    {field: "campus", headerName: "Campus", width: 100},
    {field: "requester", headerName: "Demandeur", width: 250},
    {field: "startDate", headerName: "Debut", width: 130},
    {field: "endDate", headerName: "Fin", width: 130},
    {
      field: "groupe",
      headerName: "Groupe",
      width: 130,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              cursor: "pointer",
            }}
            onClick={() => setOpenDialog(true)}
          >
            {params.row.groupe && <p>{params.row.groupe}</p>}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              width: "100%",
            }}
          >
            <EditRoundedIcon
              style={{color: "black", cursor: "pointer"}}
              sx={{mr: 2}}
              onClick={(e) => {
                setClickedDeviceId(params.row.deviceId);
                toggleDrawerModify(e, true);
              }}
            />
          </div>
        );
      },
    },
  ];

  const rows = data
    .sort(
      (a, b) =>
        timeConverter(b.device.createdAt) - timeConverter(a.device.createdAt)
    )
    .map((item, i) => {
      return {
        id: i,
        deviceId: item.device.id,
        label: item.device.label,
        ref: item.device.ref,
        category: item.device.category,
        campus: item.device.campus,
        requester: item.request && item.request.requester,
        startDate:
          item.request &&
          moment(timeConverter(item.request.startDate)).format("DD.MM.YYYY"),
        endDate: moment(
          item.request && timeConverter(item.request.endDate)
        ).format("DD.MM.YYYY"),
        groupe:
          item.request && item.request.groupe ? item.request.groupe : "Aucun",
      };
    });

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <UserListDialog
            open={openDialog}
            toogleDialog={toogleDialog}
            emails={groupeEmails}
          />
          <SideBarModify
            open={openModify}
            toggleDrawerModify={toggleDrawerModify}
            deviceId={clickedDeviceId}
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
              columns={columns}
              rows={rows}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[15, 30, 50]}
              // sx={{background: "white"}}
              disableSelectionOnClick
              sx={{background: "white"}}
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
