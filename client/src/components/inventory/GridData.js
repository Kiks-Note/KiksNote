import {DataGrid} from "@mui/x-data-grid";
import React, {useState} from "react";

const GridData = ({columns, rows}) => {
  const [pageSize, setPageSize] = useState(15);

  return (
    <DataGrid
      autoHeight
      sx={{width: "97%", mt: 4, mb: 4}}
      style={{
        fontFamily: "poppins-regular",
        fontSize: 14,
        textOverflow: "ellipsis",
        overflow: "hidden",
        minHeight: 600,
      }}
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
        checkboxSelectionUnselectAllRows: "Désélectionner toutes les lignes",
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
  );
};

export default GridData;
