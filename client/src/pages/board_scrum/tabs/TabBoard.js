import React, { useState, useCallback, useEffect } from "react";
import Tab from "./Tabs";
import Dashboard from "../Dashboard";
import tabsConverter from "../../../functions/TabsConverter";

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
      setActiveIndex(updatedTabs[0]?.id || "Dashbaord");
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
  const handleAddTab = (item) => {
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
  };

  useEffect(() => {
    console.log(<Dashboard addTab={handleAddTab} />);
    const result = tabsConverter.extractProps(
      <Dashboard addTab={handleAddTab} />
    );
    console.log(result);
    console.log(<Dashboard addTab={handleAddTab} />);
    let tabs = JSON.parse(localStorage.getItem("tabs"));
    let filteredTabs = [];
    if (tabs == null) {
      filteredTabs.push({
        id: "Dashboard",
        label: "Dashboard",
        closeable: false,
        component: result,
      });
    } else {
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
          component: result,
        });
      }
    }
    const updatedTabs = filteredTabs.map((tab) => {
      const newComponent = tabsConverter.applyProps(tab.component);
      return { ...tab, component: newComponent };
    });

    console.log(updatedTabs);
    localStorage.setItem("activeTab", JSON.stringify(activeIndex));
    localStorage.setItem("tabs", JSON.stringify(filteredTabs));
    setData(updatedTabs);
  }, []);

  return (
    <Tab
      tabs={data}
      selectedTab={activeIndex}
      handleClose={handleClose}
      handleChange={handleChange}
    />
  );
}
