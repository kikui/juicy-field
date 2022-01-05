import { DisplayPanel, InvestParams, PartialReinvest } from "./invest-type";
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
  partialReinvest: PartialReinvest;
  displayPanel: DisplayPanel;
}

export interface Investisment {
  year: number;
  mounth: string;
  mounthInvest: number;
  restMounth: number;
  reinvest: number;
  gain: number;
}

export enum EnumSortType {
  ASC,
  DESC
}