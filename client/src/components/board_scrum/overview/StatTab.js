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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

StatTab.propTypes = {
  boards: PropTypes.array.isRequired,
};
export default function StatTab({ boards }) {
  // useEffect(() => {

  // }, [props]);


  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
  );
  const optionsBurnDown = {
    responsive: true,
    title: {
      display: true,
      text: "Burndown Chart",
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            unit: "day",
            displayFormats: {
              day: "MMM DD",
            },
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    legend: {
      display: true,
      position: "bottom",
    },
  };
  const dataBurnDown = {
    labels: [
      "Jour1",
      "Jour 2",
      "Jour 3",
      "Jour 4",
      "Jour 5",
      "Jour 6",
      "Jour 7",
    ],
    datasets: [
      {
        label: "Estimation",
        data: [0, 7.5, 15, 22.5, 30, 37.5, 45],
        fill: true,
        borderColor: "orange",
      },
      {
        label: "Réalisé",
        data: [0, 10, 14, 18, 24, 29, 45],
        fill: false,
        borderColor: "green",
      },
    ],
  };
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  var index = -1;
  var indexTab = -1;
  return (
    <Box
      style={{
        minHeight: "80vh",
        maxHeight: "80vh",
      }}
    >
      {boards.map((board) => {
        index += 1;
        const toDoCount = board["data"]["toDo"]["count"];
        const inProgressCount = board["data"]["inProgress"]["count"];
        const doneCount = board["data"]["done"]["count"];

        if (toDoCount === 0 && inProgressCount === 0 && doneCount === 0) {
          return (
            <TabPanel
              key={index}
              value={value}
              index={index}
            >
              <Typography variant="h4">{board["name"]}</Typography>
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
            </TabPanel>
          );
        } else {
          return (
            <TabPanel key={index} value={value} index={index}>
              <Typography variant="h4">{board["name"]}</Typography>
              <Box
              >
                <Doughnut
                  data={{
                    labels: ["To Do", "In Progress", "Done"],
                    datasets: [
                      {
                        label: "nombre de tâches",
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
            </TabPanel>
          );
        }
      })}

      {boards.map((board) => {
        index += 1;
        return (
          <TabPanel
            key={index}
            value={value}
            index={index}
            // style={{
            //   height: "75vh",
            //   maxHeight: "80vh",
            // }}
          >
            <Typography variant="h4">Burndown {board["name"]}</Typography>
            <Line data={dataBurnDown} options={optionsBurnDown} />
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
          {boards.map((board, item) => {
            indexTab += 1;
            return (
              <Tab key={item} label={board["name"]} {...a11yProps(indexTab)} />
            );
          })}
          {boards.map((board, item) => {
            indexTab += 1;
            return (
              <Tab
                key={item}
                label={"Burdown " + board["name"]}
                {...a11yProps(indexTab)}
              />
            );
          })}
        </Tabs>
      </Box>
    </Box>
  );
}
