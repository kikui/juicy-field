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

export interface InvestParams {
  yearsGeneration: number;
  investTypeId: string;
  plantRentabity: string;
  ponctualInvests: Array<PonctualInvest>;
  recurrentInvests: Array<RecurrentInvest>;
  ponctualDrops: Array<PonctualDrop>
}

export interface PonctualDrop {
  index: number;
  amount: number;
  isActive: boolean;
}

export interface RecurrentInvest {
  startIndex: number;
  amount: number;
  frequency: number;
  isActive: boolean;
}

export interface PonctualInvest {
  amount: number;
  index: number;
  indexRefund: number;
  isActive: boolean;
}

export enum EnumInvestType {
  recurrentInvest,
  ponctualInvest,
  ponctualDrop
}

export interface DisplayPanel {
  totalInvest: boolean;
  drop: boolean;
  currentPlantPaid: boolean;
  totalPlantInGrowing: boolean;
  currentRent: boolean;
  totalSelfInvest: boolean;
  benefit: boolean;
  finalBenefit: boolean;
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
