import React, { useState, useEffect } from "react";
import TabsDemo from "./Tabs";
import Board from "../Board";
import Dashboard from "../Dashboard";

export default function TabBoard() {
  var [activeTab, setActiveTab] = useState(0);

  var [tabs, setData] = useState([
    {
      id: 0,
      label: "Dashboard",
      component: <Dashboard />,
      closeable: false,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  function fetchData() {
    const storageTab = JSON.parse(localStorage.getItem("tabs")) || false;
    //localStorage.setItem("tabs", JSON.stringify([]));
    //localStorage.setItem("activeTab", JSON.stringify(0));
    var newActiveTab = JSON.parse(localStorage.getItem("activeTab"));
    console.log(localStorage.getItem("activeTab", JSON.stringify(0)));

    const newTabs = [];
    newTabs.push({
      id: 0,
      label: "Dashboard",
      component: <Dashboard />,
      closeable: false,
    });

    for (var i = 0; i < storageTab.length; i++) {
      var exists = false;
      var component;
      switch (storageTab[i].type) {
        case "board":
          component = <Board></Board>;
          break;
        case "overView":
          component = <p>overview</p>;
          break;
        default:
          component = <p>default</p>;
          break;
      }
      for (var j = 0; j < newTabs.length; j++) {
        if (newTabs[j].id === storageTab[i].id) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        newTabs.push({
          id: storageTab[i].id,
          label: storageTab[i].label,
          component: component,
          closeable: true,
        });
      }
    }

    setData(newTabs);
    for (var tab of storageTab) {
      if (tab.id == newActiveTab) {
        console.log(tab.label);
        setActiveTab(newActiveTab);
        localStorage.setItem("activeTab", newActiveTab);
        break;
      } else {
        setActiveTab(0);
        localStorage.setItem("activeTab", JSON.stringify(0));
      }
    }
    if (storageTab.length == 0) {
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
