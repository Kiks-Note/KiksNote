import React, { useState } from "react";
import "./TabManager.css";
import Dashboard from "../Dashboard";

const TabManager = ({}) => {
  const addTab = (tab) => {
    setTabs((prevTabs) => [...prevTabs, tab]);
  };

  const tabsDictionary = [
    {
      id: 0,
      title: "Dashboard",
      content: <Dashboard addTab={addTab}/>,
      closable: false,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabsDictionary[0]);
  const [tabs, setTabs] = useState(tabsDictionary);

  const closeTab = (tab) => {
    if (tab.closable) {
      const newTabs = tabs.filter((t) => t.id !== tab.id);
      setTabs(newTabs);
      setActiveTab(newTabs[0] || {});
    }
  };

  return (
    <div className="tab-manager">
      <div className="tab-header">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab.id === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.title}
            {tab.closable && (
              <button className="close-tab" onClick={() => closeTab(tab)}>
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="tab-content">{activeTab.content}</div>
    </div>
  );
};

export default TabManager;
