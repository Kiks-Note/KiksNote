import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";

export default function Timer({ startingDate, endingDate, countdown }) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const totalDuration = endingDate - startingDate;
      const remainingTime = Math.max(0, endingDate - now);
      const elapsedTime = Math.max(0, now - endingDate);

      if (countdown) {
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        setTime({ days, hours, minutes, seconds });

        if (now >= endingDate) {
          clearInterval(interval);
        }
      } else {
        const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (elapsedTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

        setTime({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startingDate, endingDate, countdown]);

  return (
    <Typography
      variant="body2"
      sx={{
        fontWeight: "bold",
        display: "flex",
        width: "100%",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {countdown
        ? `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`
        : `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`}
    </Typography>
  );
}
