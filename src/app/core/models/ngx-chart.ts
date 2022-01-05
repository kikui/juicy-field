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
}

export interface GrowingPlant {
  nbPlant: number;
  age: number;
}

export enum NgxDataType {
  totalInvest,
  totalSelfInvest,
  currentInvest,
  currentRent,
  benefit,
  realBenefit,
  currentPlantPaid,
  totalPlantInGrowing
}

export enum NgxDataTypeInvest {
  totalInvest,
  totalSelfInvest,
  currentInvest,
  totalGain,
}