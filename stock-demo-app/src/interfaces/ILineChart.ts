export interface ILineChart {
    chartData?: IChartData;
}


export interface IChartData {
    labels: string[];
    datasets: IChartDataset[];
}

export interface IChartDataset {
    label:string;
    data: number[];
    backgroundColor?: string[];
    borderWidth?: 1;
}