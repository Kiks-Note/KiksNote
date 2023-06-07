import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Clear";
import TabContainer from "./TabContainer";
import Dashboard from "../Dashboard";
import Overview from "../overview/OverView";
import PdfView from "../overview/PdfView";
import Board from "../Board";
import Tooltip from "@material-ui/core/Tooltip";
import ImpactMapping from "../../agile/ImpactMapping";
import Personas from "../../agile/Personas";
import EmpathyMap from "../../agile/EmpathyMap";

import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../../redux/slices/tabBoardSlice";
import AgileHome from "../../agile/AgileHome";

TabDemo.propTypes = {
  actualTabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
      id: PropTypes.string.isRequired,
      component: PropTypes.string.isRequired,
      closeable: PropTypes.bool.isRequired,
      data: PropTypes.any,
    }).isRequired
  ).isRequired,
  selectedTab: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function TabDemo({ actualTabs, selectedTab, handleClose }) {
  const [activeTab, setActiveTabLocal] = useState("Dashboard");
  const [activeTabs, setActiveTabs] = useState([]);
  const dispatch = useDispatch();
  const tabs = useSelector((state) => state.tabBoard.tabs);

  useEffect(() => {
    setActiveTabs(actualTabs);
    setActiveTabLocal(selectedTab);
  }, [actualTabs, selectedTab]);

  const checkIfActiveTabExists = (tabs, activeTab) => {
    return tabs.some((tab) => tab.id === activeTab);
  };

  const handleChange = useCallback(
    (event, value) => {
      if (checkIfActiveTabExists(tabs, value)) {
        setActiveTabLocal(value);
        dispatch(setActiveTab(value));
      } else {
        setActiveTabLocal(tabs[0].id);
        dispatch(setActiveTab(tabs[0].id));
      }
    },
    [tabs, dispatch]
  );

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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose(tab);
                      }}
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
            {tab.component === "Impact" && <ImpactMapping data={tab.data} />}
            {tab.component === "Personas" && (
              <Personas
                dashboardId={tab.data.dashboardId}
                actorId={tab.data.actorId}
              />
            )}
            {tab.component === "Empathy" && (
              <EmpathyMap
                dashboardId={tab.data.dashboardId}
                actorId={tab.data.actorId}
              />
            )}
            {tab.component === "AgileHome" && (
              <AgileHome dashboardId={tab.data.dashboardId} />
            )}
          </TabContainer>
        ) : null
      )}
    </>
  );
}
