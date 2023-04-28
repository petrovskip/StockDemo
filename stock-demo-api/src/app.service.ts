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
          const index = res.data.dataset_data.column_names.indexOf("Close")
          return{index, data: res.data.dataset_data.data}
        }),
        map(({index, data}) => data.map(instance => instance[index]))
      )
      .pipe(
        catchError((err) => {
          throw new HttpException(`Forbidden: API not available ${err}`, HttpStatus.FORBIDDEN);
        }),
      );
  }
}
