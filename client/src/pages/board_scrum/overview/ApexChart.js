import React from "react";
import ReactApexChart from "react-apexcharts";

export default class ApexChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        chart: {
          height: 20,
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: "22px",
              },
              value: {
                fontSize: "16px",
              },
            },
          },
        },
        labels: this.props.labels,
      },
      series: this.props.series,
    };
  }

  render() {
    return (
      <div id="chart" className="chart-container">
        <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={250} />
      </div>
    );
  }
}
