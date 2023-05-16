import React, { useState, useEffect } from "react";
import Board from "../../../pages/board_scrum/Board";
import "./CardBoard.css";

const CardBoard = ({
  title,
  startingDate,
  endingDate,
  id,
  dashboardId,
  addTab,
}) => {
  const moveToOverView = () => {
    var x = JSON.parse(localStorage.getItem("tabs")) || [];
    x.push({ id: id, type: "board", label: title, dashboardId: dashboardId });
    localStorage.setItem("tabs", JSON.stringify(x));

    addTab({
      id: id,
      tab: "Board" + title,
      component: <Board boardId={id} dashboardId={dashboardId} />,
      closeable: true,
    });
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
        {progressPercentage == 0 && (
          <p style={{ color: "black" }}>Sprint non commencé</p>
        )}
        <div
          className="progress-bar"
          style={{ width: `${progressPercentage}%` }}
        >
          {progressPercentage == 100 && <p>sprint finis</p>}
          {progressPercentage != 100 && progressPercentage != 0 && (
            <p>Sprint en cours</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardBoard;
