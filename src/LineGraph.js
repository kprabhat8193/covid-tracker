import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const LineGraph = ({ casesType = "cases" }) => {
  const [data, setData] = useState({});

  const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: (tooltipItem, data) => {
          return numeral(tooltipItem.value).format("+0.0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            callback: (value, index, values) => numeral(value).format("0a"),
          },
        },
      ],
    },
  };

  useEffect(() => {
    const getData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };

    getData();
  }, [casesType]);

  const buildChartData = (data, casesType = "cases") => {
    let chartData = [];
    let lastDataPoint;

    Object.entries(data[casesType]).forEach(([key, value]) => {
      if (lastDataPoint) {
        const newDataPoint = {
          x: key,
          y: data[casesType][key] - lastDataPoint,
        };
        lastDataPoint = data[casesType][key];
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][key];
    });

    return chartData;
  };

  console.log("CHART DATA: ", data);
  return (
    <div className="lineGraph">
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default LineGraph;
