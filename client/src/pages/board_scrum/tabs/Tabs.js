import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Clear";
import TabContainer from "./TabContainer";
import Dashboard from "../Dashboard";
import Overview from "../overview/OverView";
import PdfView from "../overview/PdfView";
import Board from "../Board";
import Tooltip from "@material-ui/core/Tooltip";


TabDemo.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
      id: PropTypes.string.isRequired,
      component: PropTypes.string.isRequired,
      closeable: PropTypes.bool.isRequired,
      data: PropTypes.any, // Ajoutez ici la définition du type des données pour chaque composant si nécessaire
    }).isRequired
  ).isRequired,
  selectedTab: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function TabDemo({
  tabs,
  selectedTab,
  handleChange,
  handleClose,
}) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeTabs, setActiveTabs] = useState([]);

  useEffect(() => {
    setActiveTabs(tabs);
    setActiveTab(selectedTab);
  }, [tabs, selectedTab]);

  return (
    <>
      <Tabs value={activeTab} onChange={handleChange}>
        {activeTabs.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={
              <Tooltip title={tab.label}>
                <span>
                  {tab.label.length > 15
                    ? `${tab.label.substring(0, 15)}...`
                    : tab.label}
                  {tab.closeable && (
                    <a
                      className="closeTab"
                      title={"Close tab"}
                      onClick={() => handleClose(tab)}
                    >
                      <CloseIcon />
                    </a>
                  )}
                </span>
              </Tooltip>
            }
          />
        ))}
      </Tabs>
      {activeTabs.map((tab) =>
        activeTab === tab.id ? (
          <TabContainer key={tab.id}>
            {tab.component === "Dashboard" && <Dashboard />}
            {tab.component === "OverView" && <Overview id={tab.id} />}
            {tab.component === "PdfView" && (
              <PdfView
                linkPdf={tab.data.pdfLink}
                dashboardId={tab.data.dashboardId}
              />
            )}
            {tab.component === "Board" && (
              <Board
                boardId={tab.data.boardId}
                dashboardId={tab.data.dashboardId}
              />
            )}
            {/* Ajoutez des conditions pour d'autres composants ici */}
          </TabContainer>
        ) : null
      )}
    </>
  );
}
