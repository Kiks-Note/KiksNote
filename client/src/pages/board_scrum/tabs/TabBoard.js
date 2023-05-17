import React, { useState, useCallback, useEffect } from "react";
import Tab from "./Tabs";
import Dashboard from "../Dashboard";

export default function TabBoard() {
  const [data, setData] = useState([]);

  const [activeIndex, setActiveIndex] = useState("Dashboard");

  const handleChange = useCallback((event, activeTab) => {
    localStorage.setItem("activeTab", JSON.stringify(activeTab));
    setActiveIndex(activeTab);
  }, []);

  const handleClose = useCallback(
    (tabToDelete) => {
      console.log("on ferme");

      const updatedTabs = data.filter((tab) => tab.id !== tabToDelete.id);
      setActiveIndex(updatedTabs[0]?.id || "Dashboard");
      localStorage.setItem("activeTab", JSON.stringify(activeIndex));
      console.log(activeIndex);
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

  useEffect(() => {
    let activeTab = JSON.parse(localStorage.getItem("activeTab"));
    let tabs = JSON.parse(localStorage.getItem("tabs"));
    let filteredTabs = [];

    if (tabs && tabs.length === 0) {
      setActiveIndex("Dashboard");
      filteredTabs.push({
        id: "Dashboard",
        label: "Dashboard",
        closeable: false,
        tab: "Dashboard",
        component: (
          <Dashboard
            addTab={(item) => {
              setData((prevData) => {
                const existingTab = prevData.find((tab) => tab.id === item.id);

                if (existingTab) {
                  setActiveIndex(existingTab.id);
                  return prevData;
                } else {
                  const newData = [...prevData, item];
                  setActiveIndex(newData[newData.length - 1].id);
                  return newData;
                }
              });
            }}
          />
        ),
      });
    } else {
      setActiveIndex(activeTab);
      filteredTabs = tabs
        ? tabs.filter((tab, index, self) => {
            return self.findIndex((t) => t.id === tab.id) === index;
          })
        : [];
      if (!filteredTabs.find((tab) => tab.id === "Dashboard")) {
        // Add the Dashboard tab if it's not already present
        filteredTabs.push({
          id: "Dashboard",
          label: "Dashboard",
          closeable: false,
          tab: "Dashboard",
          component: (
            <Dashboard
              addTab={(item) => {
                setData((prevData) => {
                  const existingTab = prevData.find(
                    (tab) => tab.id === item.id
                  );

                  if (existingTab) {
                    setActiveIndex(existingTab.id);
                    return prevData;
                  } else {
                    const newData = [...prevData, item];
                    setActiveIndex(newData[newData.length - 1].id);
                    return newData;
                  }
                });
              }}
            />
          ),
        });
      }
    }

    localStorage.setItem("tabs", JSON.stringify(filteredTabs));
    console.log(filteredTabs);

    setData(filteredTabs);
  }, []);

  return (
    <Tab
      handleClose={handleClose}
      handleChange={handleChange}
      tabs={data}
      selectedTab={activeIndex}
    />
  );
}
