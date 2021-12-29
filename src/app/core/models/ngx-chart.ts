export interface NgxChart {
  name: string,
  series: Array<NgxChartSeries>
}

export interface NgxChartSeries {
  name: string;
  value: number;
  meta?: NgxChartMeta
}

export interface NgxChartMeta {
  nbPlantPaid?: number;
  resteInvest?: number;
  growingPlantHistory?: Array<GrowingPlant>;
  gain?: number
}

export interface GrowingPlant {
  nbPlant: number;
  age: number;
}