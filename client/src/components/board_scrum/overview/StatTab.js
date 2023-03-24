import * as React from "react";
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


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function StatTab() {
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
const optionsBurnUp = {
  responsive: true,
  title: {
    display: true,
    text: "Burn-Up Chart",
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
      "2023-03-01",
      "2023-03-02",
      "2023-03-03",
      "2023-03-04",
      "2023-03-05",
      "2023-03-06",
      "2023-03-07",
    ],
    datasets: [
      {
        label: "Estimation",
        data: [6, 12, 18, 24, 30, 36, 42],
        fill: false,
        borderColor: "orange",
      },
      {
        label: "Réalisé",
        data: [6, 10, 14, 18, 24, 29, 35],
        fill: false,
        borderColor: "green",
      },
    ],
  };
const dataBurnUp = {
  labels: [
    "2023-03-01",
    "2023-03-02",
    "2023-03-03",
    "2023-03-04",
    "2023-03-05",
    "2023-03-06",
    "2023-03-07",
  ],
  datasets: [
    {
      label: "Réalisé",
      data: [6, 10, 14, 18, 24, 29, 35],
      fill: false,
      borderColor: "green",
    },
    {
      label: "Total",
      data: [6, 12, 18, 24, 30, 36, 42],
      fill: false,
      borderColor: "red",
    },
  ],
};

  const dataDoughnut = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        label: "nombre de tâches",
        data: [12, 19, 3],
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
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      style={{
        minHeight: "75vh",
        maxHeight: "80vh",
      }}
    >
      <TabPanel
        value={value}
        index={0}
        style={{
          height: "75vh",
          maxHeight: "80vh",
        }}
      >
        <Typography variant="h4">Statistique Globale</Typography>
        <Doughnut data={dataDoughnut} />
      </TabPanel>
      <TabPanel
        value={value}
        index={1}
        style={{
          height: "75vh",
          maxHeight: "80vh",
        }}
      >
        <Typography variant="h4">Statistique Sprint 1</Typography>
        <Doughnut data={dataDoughnut} />
      </TabPanel>
      <TabPanel
        value={value}
        index={2}
        style={{
          height: "75vh",
          maxHeight: "80vh",
        }}
      >
        <Typography variant="h4">BurnDown</Typography>
        <Line data={dataBurnDown} options={optionsBurnDown} />
      </TabPanel>
      <TabPanel
        value={value}
        index={3}
        style={{
          height: "75vh",
          maxHeight: "80vh",
        }}
      >
        <Typography variant="h4">BurnUp</Typography>
        <Line data={dataBurnUp} options={optionsBurnUp} />
      </TabPanel>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
        >
          <Tab label="Statistique globale" {...a11yProps(0)} />
          <Tab label="Statistique Sprint 1" {...a11yProps(1)} />
          <Tab label="BurnDown" {...a11yProps(2)} />
          <Tab label="BurnUp" {...a11yProps(2)} />
        </Tabs>
      </Box>
    </Box>
  );
}
