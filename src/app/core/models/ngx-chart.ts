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

export enum NgxDataTypeEstimate {
  totalInvest,
  totalSelfInvest,
  currentInvest,
  currentRent,
  benefit,
  finalBenefit,
  drop,
  currentPlantPaid,
  totalPlantInGrowing,
}

export enum NgxDataTypeInvest {
  totalInvest,
  totalSelfInvest,
  benefit,
  currentInvest,
  totalDrop,
}

export enum NgxDataTypeStat {
  currentRentability
}