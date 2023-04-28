// components/LineChart.js
import React from "react";
import { Line } from "react-chartjs-2";

import { ILineChart } from "../interfaces/ILineChart";


function LineChart( { chartData }: ILineChart) {
  
  return (
    <div className="chart-container">
      {chartData &&
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Users Gained between 2016-2020"
            },
            legend: {
              display: false
            }
          }
        }}
      />}
    </div>
  );
}
export default LineChart;