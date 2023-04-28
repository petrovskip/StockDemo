// components/LineChart.js
import { Line } from "react-chartjs-2";
import { ILineChart } from "../interfaces/ILineChart";




function LineChart( { chartData }: ILineChart) {
  const redraw = true
  
  return (
    <>
    {chartData &&
    <div className="chart-container" style={{position: 'relative', height:'80vh', width:'100vw'}}>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: false
            },
            legend: {
              display: true
            }
          },
          responsive: true
        }}
        
        redraw={redraw}
      />
    </div>
    }
    </>
  );
}
export default LineChart;