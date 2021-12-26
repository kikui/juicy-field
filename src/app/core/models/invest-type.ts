import { Revenue } from "./revenue";

export interface InvestType {
  id: number;
  name: string;
  growingPeriod?: number;
  harvestPerYear: number;
  businessPlan: number;
  revenue: Revenue;
  price: number
}

export interface PartialReinvest {
  percent: number;
  maxRentDrop: number;
  minimalTimeBeforeDrop: number;
}

export var investTypeData: Array<InvestType> = [
  { 
    id: 0,
    name: "JuicyFlash",
    growingPeriod: 108,
    harvestPerYear: 1,
    businessPlan: 1,
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
