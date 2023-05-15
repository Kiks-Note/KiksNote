import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Clear";
import TabContainer from "./TabContainer";
TabDemo.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
      id: PropTypes.string.isRequired,
      component: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
        .isRequired,
      closeable: PropTypes.bool.isRequired,
    }).isRequired
  ).isRequired,
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
              typeof tab.tab === "string" ? (
                <span>
                  {tab.tab}
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
              ) : (
                tab.tab
              )
            }
          />
        ))}
      </Tabs>
      {activeTabs.map((tab) =>
        activeTab === tab.id ? (
          <TabContainer key={tab.id}>{tab.component}</TabContainer>
        ) : null
      )}
    </>
  );
}
