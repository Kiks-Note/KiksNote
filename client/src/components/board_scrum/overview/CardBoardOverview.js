import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./CardBoard.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { setActiveTab, addTab } from "../../../redux/slices/tabBoardSlice";
import PropTypes from "prop-types";

CardBoardOverview.propTypes = {
  title: PropTypes.string.isRequired,
  startingDate: PropTypes.number.isRequired,
  endingDate: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  dashboardId: PropTypes.string.isRequired,
};
export default function CardBoardOverview({
  title,
  startingDate,
  endingDate,
  id,
  dashboardId,
}) {
  const dispatch = useDispatch();
  const moveToOverView = () => {
    const boardTab = {
      id: id,
      label: `Board ${title}`,
      closeable: true,
      component: "Board",
      data: { boardId: id, dashboardId: dashboardId },
    };
    dispatch(addTab(boardTab));
    dispatch(setActiveTab(boardTab.id));
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
    <Box className="card" onClick={moveToOverView}>
      <Typography variant="h6" className="title">
        {title}
      </Typography>
      <Box sx={{ textAlign: "center" }}>
        {progressPercentage === 0 && (
          <Typography>Sprint non commencé</Typography>
        )}
        <LinearProgress variant="determinate" value={progressPercentage} />
        {progressPercentage === 100 && <Typography>Sprint terminé</Typography>}
        {progressPercentage !== 100 && progressPercentage !== 0 && (
          <Typography>Sprint en cours</Typography>
        )}
      </Box>
    </Box>
  );
}
