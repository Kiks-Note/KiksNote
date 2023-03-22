import React, { useState, useEffect } from "react";
import TabsDemo from "./Tabs";
import Board from "../Board";
import Dashboard from "../Dashboard";
import OverView from "../overview/OverView";

export default function TabBoard() {
  var [activeTab, setActiveTab] = useState(0);
  var [storedTabs, setStoredTabs] = useState([]);

  var [tabs, setData] = useState([
    {
      id: 0,
      label: "Dashboard",
      component: <Dashboard />,
      closeable: false,
    },
  ]);

  useEffect(() => {
    var interval = setInterval(() => {
      fetchData();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  function fetchData() {
    //[storageTab] is variable to get tabs on localStorage
    const storageTab = JSON.parse(localStorage.getItem("tabs")) || [];
    var tabsIndex = localStorage.getItem("tabsIndex");

    if (storageTab.length == 0) {
      localStorage.setItem("tabsIndex", 0);
    }

    if (storedTabs.length != storageTab.length) {
      storedTabs = storageTab;
      setStoredTabs(storageTab);
      //localStorage.setItem("tabs", JSON.stringify([]));
      //localStorage.setItem("tabsIndex", JSON.stringify(null));
      //localStorage.setItem("activeTab", JSON.stringify(0));

      const newTabs = [];
      newTabs.push({
        id: 0,
        idDb: 0,
        label: "Dashboard",
        component: <Dashboard />,
        closeable: false,
      });

      for (var i = 0; i < storageTab.length; i++) {
        var exists = false;
        var component;
        switch (storageTab[i].type) {
          case "board":
            component = <Board />;
            break;
          case "overView":
            component = <OverView />;
            break;
          case "pdf":
            component = <p>pdf</p>;
            break;
          case "settings":
            component = <p>settings</p>;
            break;

          default:
            component = <p>default</p>;
            break;
        }
        //Check if the new element is already exist
        for (var j = 0; j < newTabs.length; j++) {
          if (newTabs[j].id === storageTab[i].id) {
            exists = true;
            break;
          }
        }
        // If the element not exist push
        if (!exists) {
          newTabs.push({
            id: storageTab[i].id,
            idDb: storageTab[i].idDb,
            label: storageTab[i].label,
            component: component,
            closeable: true,
          });
        }
      }
      setData(newTabs);
    }
    var newActiveTab = JSON.parse(localStorage.getItem("activeTab"));
    for (var tab of storageTab) {
      if (tab.id == newActiveTab) {
        //Define Active tab for Tabbar with the new element
        setActiveTab(newActiveTab);
        localStorage.setItem("activeTab", newActiveTab);
        break;
      } else {
        //Define Active tab for Tabbar with Dashboard
        setActiveTab(0);
        localStorage.setItem("activeTab", JSON.stringify(0));
      }
    }
    if (storageTab.length == 0 && activeTab != 0) {
      setActiveTab(0);
      localStorage.setItem("activeTab", JSON.stringify(0));
    }
  }

  return (
    <div>
      <TabsDemo tabs={tabs} selectedTab={activeTab} />
    </div>
  );
}
