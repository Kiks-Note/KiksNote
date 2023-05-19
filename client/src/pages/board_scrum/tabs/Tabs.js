import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Clear";
import TabContainer from "./TabContainer";
import Dashboard from "../Dashboard";
import Overview from "../overview/OverView";

TabDemo.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
      id: PropTypes.string.isRequired,
      component: PropTypes.string.isRequired,
      closeable: PropTypes.bool.isRequired,
      data: PropTypes.object, // Ajoutez ici la définition du type des données pour chaque composant si nécessaire
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
              <span>
                {tab.label}
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
            }
          />
        ))}
      </Tabs>
      {activeTabs.map((tab) =>
        activeTab === tab.id ? (
          <TabContainer key={tab.id}>
            {tab.component === "Dashboard" && <Dashboard />}
            {tab.component === "OverView" && <Overview id={tab.id} />}
            {/* Ajoutez des conditions pour d'autres composants ici */}
          </TabContainer>
        ) : null
      )}
    </>
  );
}
