import {
  Avatar,
  AvatarGroup,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import styled from "styled-components";
import timeConverter from "../../functions/TimeConverter";
import {DataGrid} from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../theme";

const ImageView = styled.img`
  width: 60%;
  height: 35%;
  object-fit: cover;
  border-radius: 10px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 50%;
  margin: 0.5rem 0;
`;

const Text = styled(Typography)`
  font-family: "poppins-regular";
  font-size: 1.15rem;
  color: #fff;
`;

const Title = styled(Typography)`
  font-family: "poppins-semiBold";
  font-size: 1.5rem;
  color: #ffff;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

const Containers = styled(Container)`
    display: "flex",
    align-items: "center",
    flex-direction: "column",
    justify-content: "center",
    width: "100%",
    padding-block: "2rem",
`;

// dark random colors
const colors = [
  "#1abc9c",
  "#3498db",
  "#34495e",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#2c3e50",
  "#e67e22",
  "#e74c3c",
  "#d35400",
  "#c0392b",
  "#235789",
  // "#161925",
];

const YourModalComponent = ({
  params,
  clientY,
  clientX,
  setIsModalOpen,
  open,
}) => {
  console.log(params);
  return (
    // <div
    //   style={{
    //     position: "absolute",
    //     top: clientY,
    //     left: clientX,
    //     backgroundColor: "#fff",
    //     padding: "1rem",
    //     borderRadius: "10px",
    //     zIndex: 100,
    //   }}

    // >
    //   <button onClick={() => setIsModalOpen(false)}>Close</button>
    //   <div
    //     style={{
    //       display: "flex",
    //       flexWrap: "wrap",
    //       alignItems: "flex-start",
    //       flexDirection: "column",
    //       marginTop: "1rem",
    //       minWidth: "200px",
    //     }}
    //   >
    //     {params.map((value) => {
    //       return (
    //         <Chip
    //           key={value}
    //           sx={{
    //             backgroundColor: "#2980b9",
    //             fontFamily: "poppins-regular",
    //             fontSize: "0.9rem",
    //             margin: "0.2rem",
    //             color: "#fff",
    //           }}
    //           label={value}
    //         />
    //       );
    //     })}
    //   </div>
    // </div>
    <Dialog open={open} onClose={() => setIsModalOpen(false)}>
      <div style={{maxWidth: 500, maxHeight: 750, overflow: "auto"}}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Liste du groupe</Typography>
          <IconButton
            onClick={() => setIsModalOpen(false)}
            sx={{color: theme.colors.components.light}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {params.map((value) => {
            return (
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: "#00000026",
                  fontFamily: "poppins-regular",
                  fontSize: "0.9rem",
                  marginBlock: "0.5rem",
                  color: "#fff",
                  padding: "0.5rem",
                  borderRadius: "5px",
                }}
              >
                {value}
              </Typography>
            );
          })}
        </DialogContent>
      </div>
    </Dialog>
  );
};

const DeviceHistory = () => {
  const [deviceHistory, setDeviceHistory] = useState([]);
  const [device, setDevice] = useState({});
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(15);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientX, setClientX] = useState(0);
  const [clientY, setClientY] = useState(0);
  const [params, setParams] = useState({});

  const {deviceId} = useParams();

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `http://localhost:5050/inventory/device/${deviceId}`
      );
      const resHistory = await axios.get(
        "http://localhost:5050/inventory/deviceRequests/" + deviceId
      );
      setDeviceHistory(resHistory.data);
      setDevice(res.data);
      setLoading(false);
    })();
  }, [deviceId]);

  const columns = [
    {field: "id", headerName: "ID", width: 100, editable: false, hide: true},
    {
      field: "createdAt",
      headerName: "Date de demande",
      width: 125,
      editable: false,
    },
    {
      field: "startDate",
      headerName: "Date de début",
      width: 125,
      editable: false,
    },
    {
      field: "endDate",
      headerName: "Date de fin",
      width: 100,
      editable: false,
    },
    {
      field: "status",
      headerName: "Statut",
      width: 100,
      editable: false,
    },
    {
      field: "requesterId",
      headerName: "Demandeur",
      width: 200,
      editable: false,
    },
    {
      field: "reason",
      headerName: "Raison",
      width: 200,
      editable: false,
    },
    {
      field: "group",
      headerName: "Groupe",
      width: 200,
      editable: false,
      renderCell: (params) => {
        // return a chip with the first letter of the group
        return params.value.length > 0 ? (
          <AvatarGroup
            onClick={(e) => {
              setIsModalOpen(true);
              setParams(params.value);
              setClientX(e.clientX);
              setClientY(e.clientY);
            }}
          >
            {params.value.map((value) => {
              return (
                <Avatar
                  key={value}
                  sx={{
                    // backgroundColor: colors[Math.floor(Math.random() * 13)],
                    backgroundColor: "#2980b9",
                    fontFamily: "poppins-semiBold",
                    fontSize: "1rem",
                    margin: "0.2rem",
                    color: "#fff",
                    width: 30,
                    height: 30,
                  }}
                >
                  {value.charAt(0).toUpperCase()}
                </Avatar>
              );
            })}
          </AvatarGroup>
        ) : (
          <Text>0</Text>
        );
      },
    },
  ];

  const rows = deviceHistory.map((item) => {
    return {
      id: item.id,
      createdAt: moment(timeConverter(item.createdAt)).format("DD.MM.YYYY"),
      startDate: moment(timeConverter(item.startDate)).format("DD.MM.YYYY"),
      endDate: moment(timeConverter(item.endDate)).format("DD.MM.YYYY"),
      status: item.status,
      requesterId: item.requesterId,
      reason: item.reason,
      group: item.group,
    };
  });

  return (
    <Container
      style={{
        display: "flex",
      }}
      sx={{width: "100%", minWidth: "100%"}}
    >
      <Containers
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBlock: "2rem",
          width: "45%",
        }}
      >
        {!loading && (
          <>
            <ImageView src={device?.image} alt={device?.label} />
            <Title variant="h5">{device?.label}</Title>
            <Item>
              <Text variant="h6">Catégorie: </Text>
              <Text variant="h6">{device?.category}</Text>
            </Item>
            <Item>
              <Text variant="h6">Etat: </Text>
              <Text variant="h6">
                {device?.condition === "new" ? "Neuf" : "Occasion"}
              </Text>
            </Item>
            <Item>
              <Text variant="h6">Date d'ajout: </Text>
              <Text variant="h6">
                {moment(timeConverter(device?.createdAt)).format("DD.MM.YYYY")}
              </Text>
            </Item>
            <Item>
              <Text variant="h6">Reference: </Text>
              <Text variant="h6">{device?.reference}</Text>
            </Item>
            <Item>
              <Text variant="h6">Prix: </Text>
              <Text variant="h6">{parseInt(device?.price).toFixed(2)} €</Text>
            </Item>
            <Item>
              <Text variant="h6">Statut: </Text>
              <Text variant="h6">
                {device?.status === "available" ? "Disponible" : "Indisponible"}
              </Text>
            </Item>
            <Item>
              <Text variant="h6">Storage: </Text>
              <Text variant="h6">{device?.storage}</Text>
            </Item>
          </>
        )}
      </Containers>
      <Containers
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // width: 2200,
        }}
      >
        <Title variant="h5">Historique</Title>
        <DataGrid
          autoHeight
          sx={{width: "100%"}}
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[15, 30, 50]}
          disableSelectionOnClick
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
              count > 1 ? `${count} filtres actifs` : `${count} filtre actif`,

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
              count > 1 ? `${count} filtres actifs` : `${count} filtre actif`,
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
            checkboxSelectionSelectAllRows: "Sélectionner toutes les lignes",
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
        {isModalOpen && (
          // render your modal component here
          // you can use a library like `react-modal` to create the modal
          <YourModalComponent
            params={params}
            open={isModalOpen}
            clientX={isModalOpen && clientX}
            clientY={isModalOpen && clientY}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </Containers>
    </Container>
  );
};

export default DeviceHistory;
