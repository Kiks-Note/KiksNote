import React, { useState, useEffect } from "react";
import "./CardBoard.css";

const CardBoard = ({ title, startingDate, endingDate, id, dashboardId }) => {
  const moveToOverView = () => {
    console.log(id);

    var x = JSON.parse(localStorage.getItem("tabs")) || [];

    var tabsIndex = localStorage.getItem("tabsIndex");

    if (tabsIndex === null) {
      tabsIndex = 0;
    }

    var newIndex = parseInt(tabsIndex) + 1;

    var tabsIndex = localStorage.setItem("tabsIndex", newIndex);

    x.push({ id: newIndex, idDb: id, type: "board", label: title, dashboardId: dashboardId });
    localStorage.setItem("tabs", JSON.stringify(x));

    localStorage.setItem("activeTab", JSON.stringify(newIndex));
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  function getTimeLeft() {
    const now = Date.now();
    const startDate = new Date(startingDate * 1000);
    const endDate = new Date(endingDate * 1000);

    const totalDuration = endDate.getTime() - startDate.getTime();
    const remainingDuration = endDate.getTime() - now;
    const elapsedTime = totalDuration - remainingDuration;

    const progress = Math.min(Math.max(elapsedTime / totalDuration, 0), 1);
    const timeLeft = {
      days: Math.floor(remainingDuration / (1000 * 60 * 60 * 24)),
      hours: Math.floor((remainingDuration / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((remainingDuration / (1000 * 60)) % 60),
      seconds: Math.floor((remainingDuration / 1000) % 60),
    };

    return {
      progress,
      timeLeft,
    };
  }

  const progressPercentage = Math.round(timeLeft.progress * 100);

  return (
    <div className="card" onClick={moveToOverView}>
      <h2 className="title">{title}</h2>
      <div className="progress-bar-container" style={{ textAlign: "center" }}>
        {progressPercentage == 0 && <p style={{ color: "black" }}>Sprint non commencé</p>}
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
          {progressPercentage == 100 && <p>sprint finis</p>}
          {progressPercentage != 100 && progressPercentage != 0 && <p>Sprint en cours</p>}
        </div>
      </div>
    </div>
  );
};

export default CardBoard;
