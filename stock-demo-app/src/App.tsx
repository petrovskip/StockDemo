import './App.css';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ILineChart } from './interfaces/ILineChart';
import { ICompanyData } from './interfaces/ICompanyData';
import { useState, useEffect } from 'react';
import { getCompanies, getCompanyTS } from './services/financeService'
import LineChart from './components/LineChart';

function App() {
  const [companiesData, setCompaniesData] = useState<ICompanyData[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<ICompanyData>({});
  const [lineChart, setChartData] = useState<ILineChart>({});

  useEffect(() => {
    getCompanies().then(data => {
      setSelectedCompany(data[0])
      setCompaniesData(data)
    })
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
 });
  
 }

  return (
    <div className="App">
      <header className="App-header">
        {companiesData && companiesData.length > 0 ? <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Company</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Company"
              value={selectedCompany.dataset_code}
              onChange={handleChange}
            >
              {
                companiesData.map((company) => {
                  return(
                    <MenuItem value={company.dataset_code}>{company.dataset_name}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl> :
          <p>Loading...</p>}
      </header>
      <div className="body">
        <LineChart chartData={ lineChart.chartData }/>
      </div>
    </div>
  );
}

export default App;
