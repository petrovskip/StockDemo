// components/LineChart.js
import { Line } from "react-chartjs-2";
import { ILineChart } from "../interfaces/ILineChart";




function LineChart( { chartData }: ILineChart) {
  const redraw = true
  
  return (
    <>
    {chartData &&
    <div className="chart-container">
      <Line
        data={chartData}
        redraw={redraw}
      />
    </div>
    }
    </>
  );
}
export default LineChart;