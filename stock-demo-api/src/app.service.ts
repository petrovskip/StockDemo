import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { map, catchError } from 'rxjs';

const baseUrl = 'https://data.nasdaq.com/api/v3/datasets/'
const databaseCode = 'WIKI'
const returnFormat = 'json'
const apiKey ='c2hHGy-DYviBXsfz-sYU'

@Injectable()
export class AppService {
  constructor(private http: HttpService) {}
  async getCompanies() {
    return this.http
      .get(`${baseUrl}?database_code=${databaseCode}&api_key=${apiKey}`,{
        responseType: 'json',
        headers: {'Accept':'application/json'}
      })
      .pipe(
        map((res) => res.data.datasets.map(dataset => {
          return{
            dataset_code: dataset.dataset_code,
            dataset_name: dataset.name
          }}).sort((a,b) => (a.dataset_name > b.dataset_name) ? 1 : ((b.dataset_name > a.dataset_name) ? -1 : 0))
        ),
      )
      .pipe(
        catchError((err) => {
          throw new HttpException(`Forbidden: API not available ${err}`, HttpStatus.FORBIDDEN);
        }),
      );
  }

  getTimeSeries(datasetCode:string) {
    return this.http
      .get(`${baseUrl}${databaseCode}/${datasetCode}/data.${returnFormat}?api_key=${apiKey}`)
      .pipe(
        map((res) => {
          const indexDate = res.data.dataset_data.column_names.indexOf("Date");
          const indexClose = res.data.dataset_data.column_names.indexOf("Close");
          return{ indexDate, indexClose, data: res.data.dataset_data.data };
        }),
        map(({ indexDate, indexClose, data }) => 
          data.map((instance) => {
            return {
              date: instance[indexDate],
              close: instance[indexClose]
            }
          })
      ))
      .pipe(
        catchError((err) => {
          throw new HttpException(`Forbidden: API not available ${err}`, HttpStatus.FORBIDDEN);
        }),
      );
  }
}
