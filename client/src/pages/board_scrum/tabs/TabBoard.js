import React, { useState, useCallback } from "react";
import TabsDemo from "./Tabs";

import Dashboard from "../Dashboard";
const TabBoard = () => {
  const [data, setData] = useState([
    {
      id: 0,
      label: "",
      closeable: false,
      tab: "Dashboard",
      component: (
        <Dashboard
          addTab={(item) => {
            setData((prevData) => {
              let isExist = false;
              const newData = prevData.map((tab) => {
                if (tab.id === item.id) {
                  isExist = true;
                  setActiveIndex(tab.id);
                  return tab;
                }
                return tab;
              });
              if (!isExist) {
                newData.push(item);
                setActiveIndex(newData[newData.length - 1].id);
              }
              return newData;
            });
          }}
        ></Dashboard>
      ),
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleChange = useCallback((event, activeTab) => {
    localStorage.setItem("activeTab", JSON.stringify(activeTab));
    setActiveIndex(activeTab);
  });

  const handleClose = useCallback(
    (tabToDelete) => {
      localStorage.setItem("activeTab", JSON.stringify(0));

      const tabToDeleteIndex = data.findIndex(
        (tab) => tab.id === tabToDelete.id
      );
      const updatedTabs = data.filter((tab) => tab.id !== tabToDelete.id);
      setActiveIndex(updatedTabs[0].id); // Doesn't work...

      const newStorageTabs =
        JSON.parse(localStorage.getItem("tabs"))?.filter(
          (tab) => tab.id !== tabToDelete.id
        ) || [];

      setData(updatedTabs);

      updatedTabs.forEach((tab, index) => {
        tab.tabIndex = index;
      });
      localStorage.setItem("tabs", JSON.stringify(newStorageTabs));
    },
    [data]
  );

  return (
    <TabsDemo
      handleClose={handleClose}
      handleChange={handleChange}
      tabs={data}
      selectedTab={activeIndex}
    />
  );
};

export default TabBoard;
