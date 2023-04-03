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

export const TabsDemo = ({
  tabs,
  selectedTab,
  onClose,
  handleChange,
  handleClose,
  tabsProps = { indicatorColor: "black" },
  ...rest
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activetabs, setActiveTabs] = useState([]);

  useEffect(() => {
    setActiveTabs(tabs);
    setActiveTab(selectedTab);
  }, [tabs][selectedTab]);

  return (
    <>
      <div>
        <Tabs value={activeTab} onChange={handleChange}>
          {activetabs.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={
                typeof tab.tab === "string" ? (
                  <span>
                    {tab.tab}
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
                  tab.tab
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
