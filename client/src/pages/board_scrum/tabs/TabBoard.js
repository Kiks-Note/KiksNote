import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tab from "./Tabs";
import {
  setActiveTab,
  addTab,
  removeTab,
} from "../../../redux/slices/tabBoardSlice";

export default function TabBoard() {
  const dispatch = useDispatch();
  const tabs = useSelector((state) => state.tabBoard.tabs);
  const activeTab = useSelector((state) => state.tabBoard.activeTab);

  const checkIfActiveTabExists = (tabs, activeTab) => {
    return tabs.includes(activeTab);
  }
  
  const handleChange = useCallback(
    (event, activeTab) => {
      if (checkIfActiveTabExists(tabs, activeTab)) {
        console.log('activeTab existe dans tabs');
        dispatch(setActiveTab(activeTab));
      } else {
        console.log('activeTab n\'existe pas dans tabs');
        dispatch(setActiveTab(tabs[0].id));
      }
    },
    [tabs, dispatch]
  );

  const handleClose = useCallback(
    (tabToDelete) => {
      const updatedTabs = tabs.filter((tab) => tab.id !== tabToDelete.id);
      dispatch(removeTab(tabToDelete));

      const newActiveTab = updatedTabs[0].id;
      dispatch(setActiveTab(newActiveTab));
    },
    [tabs, activeTab, dispatch]
  );

  useEffect(() => {
    if (tabs.length === 0) {
      const initialTab = {
        id: "Dashboard",
        label: "Dashboard",
        closeable: false,
        component: "Dashboard",
        data: {},
      };
      dispatch(addTab(initialTab));
      dispatch(setActiveTab(initialTab.id));
    }
  }, [tabs, dispatch, activeTab]);

  return (
    <Tab
      handleClose={handleClose}
      handleChange={handleChange}
      tabs={tabs}
      selectedTab={activeTab}
    />
  );
}
