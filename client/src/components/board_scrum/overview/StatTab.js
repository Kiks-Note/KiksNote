import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Title,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import TabPanel from "./TabPanel";

StatTab.propTypes = {
  boards: PropTypes.array.isRequired,
};

ChartJS.register(
  ArcElement,
  Title,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
);
export default function StatTab({ boards }) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  return (
    <Box
      style={{
        minHeight: "70vh",
        maxHeight: "70vh",
      }}
    >
      {boards.map((board, index) => {
        const toDoCount = board.data.toDo.count;
        const inProgressCount = board.data.inProgress.count;
        const doneCount = board.data.done.count;

        const hasTasks =
          toDoCount !== 0 || inProgressCount !== 0 || doneCount !== 0;

        return (
          <TabPanel key={index} value={value} index={index}>
            <Typography variant="h4">{board.name}</Typography>
            {hasTasks ? (
              <Box style={{ width: "200px", height: "200px" }}>
                <Doughnut
                  width={200}
                  height={200}
                  data={{
                    labels: ["To Do", "In Progress", "Done"],
                    datasets: [
                      {
                        label: "Nombre de tâches",
                        data: [toDoCount, inProgressCount, doneCount],
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                          "rgba(75, 192, 192, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </Box>
            ) : (
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  height: "54vh",
                }}
              >
                <Typography variant="h6">
                  Pas de tâche pour le moment
                </Typography>
              </Box>
            )}
          </TabPanel>
        );
      })}

      {boards.map((board, index) => {
        const startingDate = new Date(board.starting_date);
        const endingDate = new Date(board.ending_date);
        // Calculer la durée totale du sprint en jours
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

        // Estimation Data
        const estimationData = [
          ...toDoEstimationData,
          ...inProgressEstimationData,
          ...doneEstimationData,
        ];

        // Calculer la somme totale des estimations
        const totalEstimation = estimationData.reduce(
          (acc, value) => acc + value,
          0
        );

        // Calculer le coefficient
        const coefficient = totalEstimation / totalDays;

        // Générer le tableau d'estimation finale
        const finalEstimationData = Array.from(
          { length: totalDays },
          (_, i) => coefficient * i
        );
        // Realisation Data
        const realisationData = Array.from({ length: totalDays }, (_, i) => {
          const day = `Jour ${i}`;

          // Somme des avancements pour le jour `day` dans la colonne "toDo"
          const toDoSum = board.data.toDo.items.reduce((acc, item) => {
            const advancements = item.advancement.filter(
              (adv) => adv.day === day
            );
            if (advancements.length > 0) {
              const sum = advancements.reduce(
                (total, adv) => total + adv.advance,
                0
              );
              return acc + sum;
            }
            return acc;
          }, 0);

          // Somme des avancements pour le jour `day` dans la colonne "inProgress"
          const inProgressSum = board.data.inProgress.items.reduce(
            (acc, item) => {
              const advancements = item.advancement.filter(
                (adv) => adv.day === day
              );
              if (advancements.length > 0) {
                const sum = advancements.reduce(
                  (total, adv) => total + adv.advance,
                  0
                );
                return acc + sum;
              }
              return acc;
            },
            0
          );

          // Somme des avancements pour le jour `day` dans la colonne "done"
          const doneSum = board.data.done.items.reduce((acc, item) => {
            const advancements = item.advancement.filter(
              (adv) => adv.day === day
            );
            if (advancements.length > 0) {
              const sum = advancements.reduce(
                (total, adv) => total + adv.advance,
                0
              );
              return acc + sum;
            }
            return acc;
          }, 0);

          // Somme totale des avancements pour le jour `day`
          return toDoSum + inProgressSum + doneSum;
        });

        console.log(realisationData);

        return (
          <TabPanel key={index} value={value} index={index}>
            <Typography variant="h4">Burndown {board.name}</Typography>
            {/* Remplacez les données de réalisation ci-dessous par les réalisations réelles du sprint */}
            <Box>
              <Line
                data={{
                  labels: Array.from(
                    { length: totalDays },
                    (_, i) => `Jour ${i}`
                  ),
                  datasets: [
                    {
                      label: "Estimation",
                      data: finalEstimationData.reverse(), // Remplacez les données d'estimation par les valeurs réelles du sprint
                      fill: true,
                      borderColor: "orange",
                    },
                    {
                      label: "Réalisé",
                      data: realisationData, // Remplacez ces données par les réalisations réelles du sprint
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
            </Box>
          </TabPanel>
        );
      })}

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
        >
          {boards.map((board, index) => (
            <Tab key={index} label={board.name} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
}
