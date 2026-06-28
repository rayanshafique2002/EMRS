import React, { Component } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

class Viz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {
        labels: ["a", "b", "c", "d"],
        datasets: [
          {
            label: "Count",
            data: [1, 2, 3, 4],
            backgroundColor: ["rgba(21,101,168,0.75)"],
            borderWidth: 0,
          },
        ],
      },
      loading: true,
    };
  }

  componentDidMount() {
    axios.get("/doctor/visualization").then((data) => {
      const diseases = {};
      data.data.diseases.forEach((x) => {
        diseases[x.disease] = parseInt(x.count);
      });
      const key = Object.keys(diseases);
      const values = Object.values(diseases);
      const color = key.map(() => "rgba(21,101,168,0.75)");

      const chart = {
        labels: key,
        datasets: [
          {
            label: "Count",
            data: values,
            backgroundColor: color,
            borderWidth: 0,
            borderRadius: 4,
          },
        ],
      };

      this.setState({
        chartData: chart,
        loading: false,
      });
    });
  }

  render() {
    if (this.state.loading) {
      return null;
    }
    return (
      <div className="viz-wrapper">
        <div className="viz-chart-card">
          <Bar
            data={this.state.chartData}
            options={{
              title: {
                display: true,
                text: "Top 5 Disease Cases — Past Week",
                fontSize: 16,
              },
              legend: {
                display: true,
                position: "top",
              },
              responsive: true,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      autoSkip: true,
                      beginAtZero: true,
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "Number of cases",
                    },
                  },
                ],
                xAxes: [
                  {
                    gridLines: {
                      display: false,
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "Disease",
                    },
                  },
                ],
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default Viz;
