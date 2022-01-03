import { DisplayPanel, InvestParams, PartialReinvest } from "./invest-type";

export interface Profile {
  name: string;
  pseudo: string;
  imageUrl: string;
  investParams: InvestParams;
  partialReinvest: PartialReinvest;
  displayPanel: DisplayPanel;
}