export interface InvestType {
  id: number;
  name: string;
  growingPeriod?: number;
  harvestPerYear: number;
  businessPlan: number;
  revenue: Revenue;
  price: number
}

export interface Revenue {
  minimal: number;
  maximal: number
}

export interface PartialReinvest {
  percent: number;
  maxRentDrop: number;
  minimalTimeBeforeDrop: number;
  frequency: number
}


export interface InvestParams {
  yearsGeneration: number;
  investTypeId: string;
  plantRentabity: string;
  ponctualInvests: Array<PonctualInvest>;
  recurrentInvests: Array<RecurrentInvest>;
  ponctualDrops: Array<RentDrop>
}

export interface RentDrop {
  index: number;
  percent: number;
}

export interface RecurrentInvest {
  startIndex: number;
  amount: number;
  frequency: number;
}

export interface PonctualInvest {
  amount: number;
  index: number;
  indexRefund: number;
}

export enum EnumInvestType {
  recurrentInvest,
  ponctualInvest,
  ponctualDrop
}

export interface DisplayPanel {
  totalInvest: boolean;
  realProfit: boolean;
  currentPlantPaid: boolean;
  totalPlantInGrowing: boolean;
  currentRent: boolean;
  totalSelfInvest: boolean;
  benefit: boolean;
}

export var investTypeData: Array<InvestType> = [
  { 
    id: 0,
    name: "JuicyFlash",
    growingPeriod: 108,
    harvestPerYear: 0,
    businessPlan: 0,
    price: 50,
    revenue: {minimal: 68, maximal: 83}
  },
  { 
    id: 1,
    name: "JuicyMist",
    harvestPerYear: 4,
    businessPlan: 3,
    price: 2000,
    revenue: {minimal: 300, maximal: 400}
  },
  { 
    id: 2,
    name: "JuicyKush",
    harvestPerYear: 3,
    businessPlan: 4,
    price: 2000,
    revenue: {minimal: 500, maximal: 750}
  },
  { 
    id: 3,
    name: "JuicyHaze",
    harvestPerYear: 2,
    businessPlan: 5,
    price: 2000,
    revenue: {minimal: 900, maximal: 1200}
  }
]
