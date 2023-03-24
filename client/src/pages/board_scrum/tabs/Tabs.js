import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Tabs, Tab, IconButton } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Clear";
import TabContainer from "./TabContainer";
import "./Tab.scss";
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  colorPrimary: {
    color: "green",
  },
});

export const TabsDemo = ({ tabs, selectedTab, onClose, tabsProps = { indicatorColor: "black" }, ...rest }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activetabs, setActiveTabs] = useState([]);

  useEffect(() => {
    setActiveTabs(tabs);
    setActiveTab(selectedTab);
  }, [tabs][selectedTab]);

  const handleChange = useCallback((event, activeTab) => {
    localStorage.setItem("activeTab", JSON.stringify(activeTab));
    setActiveTab(activeTab);
  });

  const handleClose = useCallback(
    (tabToDelete) => {
      localStorage.setItem("activeTab", JSON.stringify(0));

      const tabToDeleteIndex = activetabs.findIndex((tab) => tab.id === tabToDelete.id);
      const updatedTabs = activetabs.filter((tab) => tab.id !== tabToDelete.id);
      const newStorageTabs = JSON.parse(localStorage.getItem("tabs"))?.filter((tab) => tab.id !== tabToDelete.id) || [];
      // const previousTab = activetabs[tabToDeleteIndex - 1] || activetabs[tabToDeleteIndex + 1] || {};

      setActiveTabs(updatedTabs);
      setActiveTab(0); // Pass the id of the first element of updatedTabs

      localStorage.setItem("tabs", JSON.stringify(newStorageTabs));
    },
    [activetabs]
  );

  return (
    <>
      <div>
        <Tabs value={activeTab} onChange={handleChange}>
          {activetabs.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={
                typeof tab.label === "string" ? (
                  <span>
                    {tab.label}
                    {tab.closeable && (
                      // <IconButton onClick={() => handleClose(tab.id)}>
                      //   <CloseIcon />
                      // </IconButton>
                      <a className="closeTab" title={"Close tab"} onClick={() => handleClose(tab)}>
                        <CloseIcon />
                      </a>
                    )}
                  </span>
                ) : (
                  tab.label
                )
              }
            />
          ))}
        </Tabs>
        {activetabs.map((tab) =>
          activeTab === tab.id ? <TabContainer key={tab.id}>{tab.component}</TabContainer> : null
        )}
      </div>
    </>
  );
};

TabsDemo.propTypes = {
  classes: PropTypes.object.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
      id: PropTypes.number.isRequired,
      component: PropTypes.object.isRequired,
      closeable: PropTypes.bool.isRequired,
    }).isRequired
  ).isRequired,
};

export default withStyles(styles)(TabsDemo);
