import { DisplayPanel, InvestParams } from "./invest-type";
import { Mounth } from "./year";

export interface Profile {
  name: string;
  pseudo: string;
  imageUrl: string;
  myEstimate: Estimate;
  myInvestisment: Array<Investisment>;
}

export interface Estimate {
  investParams: InvestParams;
  displayPanel: DisplayPanel;
}

export interface Investisment {
  year: number;
  mounth: string;
  mounthInvest: number;
  currentRent: number;
  reinvest: number;
  gain: number;
}

export enum EnumSortType {
  ASC,
  DESC
}