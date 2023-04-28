import './App.css';
import { Alert, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ILineChart } from './interfaces/ILineChart';
import { ICompanyData, ITimeSeriesData } from './interfaces/ICompanyData';
import {  useState, useEffect } from 'react';
import { getCompanies, getCompanyTS } from './services/financeService'
import LineChart from './components/LineChart';
import { LineElement, PointElement, LinearScale, CategoryScale, Chart } from "chart.js";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);

function App() {
  const [companiesData, setCompaniesData] = useState<ICompanyData[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<ICompanyData>({});
  const [lineChart, setChartData] = useState<ILineChart>({});
  const [isError, setIsError] = useState(false);

  const getTimeSeries = (code: string) => {
    getCompanyTS(code).then(data => {
      const lineChartData = {
        chartData:{
          labels: data.map((instance: ITimeSeriesData) => instance.date),
          datasets: [
            {
              label: `Stock time series for ${selectedCompany.dataset_code}`,
              data: data.map((instance: ITimeSeriesData) => instance.close)
            }
          ]
        }
      };
      setChartData(lineChartData)
      }).catch(err =>
          setIsError(true)
      );
  }
  
 
  useEffect(() => {
    if(companiesData.length === 0)
    {
      getCompanies().then(data => {
        setCompaniesData(data)
      })
    }
  })

 const  handleChange = (event: SelectChangeEvent) => {
  const {
    target: { value },
  } = event;
  const newCompany = companiesData.find(company => company.dataset_code === value)
  if(newCompany){
    setSelectedCompany(newCompany);
    getTimeSeries(value);
  }
 }

  return (
    <div className="App">
      {companiesData && companiesData.length > 0 ? 
      <>
        <header className="App-header">
          <FormControl>
            <InputLabel id="demo-simple-select-label">Company</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Company"
                value={selectedCompany.dataset_code ? selectedCompany.dataset_code : ''}
                onChange={handleChange}
              >
                {
                  companiesData.map((company, index) => {
                    return(
                      <MenuItem key={index} value={company.dataset_code}>{company.dataset_name}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl> 
        </header>
        <div className="App-body">
          {isError ?
            <Alert severity="error">Could not download Time series!</Alert> :
            <LineChart chartData={ lineChart.chartData }/>
          }
        </div>
      </>:
      <p>Loading...</p>}
    </div>
  );
}

export default App;
