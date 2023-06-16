import React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Line } from "react-chartjs-2";
import TabPanel from "../../../components/board_scrum/overview/TabPanel";

import InsertChartIcon from "@mui/icons-material/InsertChart";

function BurndownChart({ board, value }) {
  const startingDate = new Date(board.starting_date);
  const endingDate = new Date(board.ending_date);
  const totalDays =
    Math.ceil((endingDate - startingDate) / (1000 * 60 * 60 * 24)) + 1;

  const toDoEstimationData = board.data.toDo.items.map(
    (item) => item.estimation
  );
  const inProgressEstimationData = board.data.inProgress.items.map(
    (item) => item.estimation
  );
  const doneEstimationData = board.data.done.items.map(
    (item) => item.estimation
  );

  const estimationData = [
    ...toDoEstimationData,
    ...inProgressEstimationData,
    ...doneEstimationData,
  ];
  const totalEstimation = estimationData.reduce((acc, value) => acc + value, 0);
  const coefficient = totalEstimation / totalDays;
  const finalEstimationData = Array.from(
    { length: totalDays },
    (_, i) => coefficient * i
  );

  const realisationData = Array.from({ length: totalDays }, (_, i) => {
    const day = `Jour ${i}`;
    const toDoSum = board.data.toDo.items.reduce((acc, item) => {
      const advancements = item.advancement.filter((adv) => adv.day === day);
      if (advancements.length > 0) {
        const sum = advancements.reduce((total, adv) => total + adv.advance, 0);
        return acc + sum;
      }
      return acc;
    }, 0);
    const inProgressSum = board.data.inProgress.items.reduce((acc, item) => {
      const advancements = item.advancement.filter((adv) => adv.day === day);
      if (advancements.length > 0) {
        const sum = advancements.reduce((total, adv) => total + adv.advance, 0);
        return acc + sum;
      }
      return acc;
    }, 0);
    const doneSum = board.data.done.items.reduce((acc, item) => {
      const advancements = item.advancement.filter((adv) => adv.day === day);
      if (advancements.length > 0) {
        const sum = advancements.reduce((total, adv) => total + adv.advance, 0);
        return acc + sum;
      }
      return acc;
    }, 0);
    return toDoSum + inProgressSum + doneSum;
  });

  return (
    <>
      <Box style={{ display: "flex", width: "100%" }}>
        <Typography
          varian="h5"
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            padding: "2vh",
          }}
        >
          <InsertChartIcon /> Burndown {board.name}
        </Typography>
      </Box>

      <Line
        data={{
          labels: Array.from({ length: totalDays }, (_, i) => `Jour ${i}`),
          datasets: [
            {
              label: "Estimation",
              data: finalEstimationData,
              fill: true,
              borderColor: "orange",
            },
            {
              label: "Réalisé",
              data: realisationData,
              fill: false,
              borderColor: "green",
            },
          ],
        }}
        options={{
          responsive: true,
          title: {
            display: true,
            text: "Burndown Chart",
          },
          legend: {
            display: true,
            position: "top",
          },
        }}
      />
    </>
  );
}

BurndownChart.propTypes = {
  board: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
};

export default BurndownChart;
