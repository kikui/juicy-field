import { DisplayPanel, InvestParams, PartialReinvest } from "./invest-type";

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
  mounthTarget: string;
  mounthInvest: number;
  rentMounth: number;
  reinvest: number;
  gain: number;
}