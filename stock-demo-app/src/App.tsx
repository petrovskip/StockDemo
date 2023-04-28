import './App.css';
import { Alert, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ILineChart } from './interfaces/ILineChart';
import { ICompanyData } from './interfaces/ICompanyData';
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
  
 
  useEffect(() => {
    getCompanies().then(data => {
      setSelectedCompany(data[0])
      setCompaniesData(data)
    })
    if(selectedCompany.dataset_code)
      getCompanyTS(selectedCompany.dataset_code).then(data => {
        const lineChartData = {
          chartData:{
            labels: ['Blue'],
            datasets: [
              {
                label: `Stock time series for ${selectedCompany.dataset_code}`,
                data: data
              }
            ]
          }
        };
        setChartData(lineChartData)
    }).catch(err =>
        setIsError(true)
      );
  })

 const  handleChange = (event: SelectChangeEvent) => {
  const {
    target: { value },
  } = event;
  const newCompany = companiesData.find(company => company.dataset_code === value)
  if(newCompany)
    setSelectedCompany(newCompany);
    getCompanyTS(value).then(data => {
    const lineChartData = {
      chartData:{
        labels: ['Blue'],
        datasets: [
          {
            label: `Stock time series for ${value}`,
            data: data
          }
        ]
      }
    };
    setChartData(lineChartData)
 }).catch(err => setIsError(true));
  
 }

  return (
    <div className="App">
      {companiesData && companiesData.length > 0 ? 
      <>
        <header className="App-header"><FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Company</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Company"
                value={selectedCompany.dataset_code}
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
        <div className="body">
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
