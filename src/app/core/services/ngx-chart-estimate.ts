import { DisplayPanel, InvestParams, InvestType, investTypeData, PonctualDrop, PonctualInvest, RecurrentDrop, RecurrentInvest } from "../models/invest-type";
import { GrowingPlant, NgxDataTypeEstimate } from "../models/ngx-chart";
import { Mounth, oneYear } from "../models/year";
import { NgxChartCore } from "./ngx-chart-core";

export class NgxChartEstimateClass extends NgxChartCore {
  // variables
  investParams: InvestParams;
  displayPanel: DisplayPanel;

  // options
  years: Array<Mounth>;
  taxe = 0.3;

  constructor(investParams: InvestParams, displayPanel: DisplayPanel) {
    super()
    // options
    this.years = []
    this.displayPanel = displayPanel

    // variables
    this.investParams = investParams

    this.calculateYear()
  }

  override initNgxArray() {
    this.ngxArrayData[NgxDataTypeEstimate.totalInvest] = { name: "Total investi", series: [] }
    this.ngxArrayData[NgxDataTypeEstimate.totalSelfInvest] = { name: "Total investi soi meme", series: [] }
    this.ngxArrayData[NgxDataTypeEstimate.totalPlantInGrowing] = { name: "Total plante en croissance", series: [] }
    this.ngxArrayData[NgxDataTypeEstimate.benefit] = { name: "Bénéfice", series: [] }
    this.ngxArrayData[NgxDataTypeEstimate.finalBenefit] = { name: "Bénéfice final", series: [] }
    this.ngxArrayData[NgxDataTypeEstimate.currentInvest] = { name: "Investissement courant", series: [] }
    this.ngxArrayData[NgxDataTypeEstimate.currentRent] = { name: "Rentrée courante", series: [] }
    this.ngxArrayData[NgxDataTypeEstimate.currentPlantPaid] = { name: "Plante courante payé", series: [] }
    this.ngxArrayData[NgxDataTypeEstimate.drop] = { name: "Retrait", series: [] }
  }

  setParams(investParams: InvestParams, displayPanel: DisplayPanel) {
    this.investParams = investParams
    this.displayPanel = displayPanel
  }

  calculateYear() {
    this.years = []

    for (let i = 0; i < this.investParams.yearsGeneration; i++) {
      oneYear.forEach((mount: Mounth) => {
        this.years.push(mount)
      })
    }
  }

  recalculate() {
    this.resetData()
    this.calculateYear()
    this.calculateNgxArrayData()
  }

  applyFilter() {
    if (!this.displayPanel.totalInvest) this.ngxArrayData[NgxDataTypeEstimate.totalInvest].series = []
    if (!this.displayPanel.drop) this.ngxArrayData[NgxDataTypeEstimate.drop].series = []
    if (!this.displayPanel.currentPlantPaid) this.ngxArrayData[NgxDataTypeEstimate.currentPlantPaid].series = []
    if (!this.displayPanel.totalPlantInGrowing) this.ngxArrayData[NgxDataTypeEstimate.totalPlantInGrowing].series = []
    if (!this.displayPanel.currentRent) this.ngxArrayData[NgxDataTypeEstimate.currentRent].series = []
    if (!this.displayPanel.totalSelfInvest) this.ngxArrayData[NgxDataTypeEstimate.totalSelfInvest].series = []
    if (!this.displayPanel.benefit) this.ngxArrayData[NgxDataTypeEstimate.benefit].series = []
    if (!this.displayPanel.finalBenefit) this.ngxArrayData[NgxDataTypeEstimate.finalBenefit].series = []
  }

  calculateNgxArrayData() {
    let investTypeTarget = this.getInvestTypeData(parseInt(this.investParams.investTypeId))
    let growingPlantHistory: Array<GrowingPlant> = []
    let currentYear = 1
    let totalInvest = 0
    let totalMySelfInvest = 0

    this.years.forEach((mounth: Mounth, index: number) => {
      if (index % 12 == 0 && index != 0) currentYear++
      let name = `${currentYear}${mounth.name} (${index})`
      let targetMounthIndex = this.getTargetMounthIndex(investTypeTarget, index)
      let reinvest = 0
      let nbPlantToRentWithMounth = 0
      let drop = 0

      if (targetMounthIndex >= 0) {
        nbPlantToRentWithMounth = this.ngxArrayData[NgxDataTypeEstimate.totalInvest].series[targetMounthIndex].meta?.nbPlantPaid || 0
        let reinvestAndGain = this.calculateRent(index, nbPlantToRentWithMounth)
        reinvest = reinvestAndGain.reinvest
        drop = reinvestAndGain.drop
      }

      // current rent
      this.ngxArrayPush(name, reinvest, NgxDataTypeEstimate.currentRent)

      // current drop
      this.ngxArrayPush(name, drop, NgxDataTypeEstimate.drop)

      // calcul total
      let totalsObject = this.calculateTotals(index, totalInvest, totalMySelfInvest, reinvest)
      let totalReinvest = totalsObject.totalReinvest
      totalInvest = totalsObject.totalInvest
      totalMySelfInvest = totalsObject.totalMySelfInvest

      // total myslef invest
      this.ngxArrayPush(name, totalMySelfInvest, NgxDataTypeEstimate.totalSelfInvest)

      // calculate repot && age
      let nbRepotPlant = this.repotCalcul(investTypeTarget, growingPlantHistory)
      growingPlantHistory = this.clearGrowingHistory(investTypeTarget, growingPlantHistory)

      // feed growingPlant
      let nbPlantPaid = Math.trunc(totalReinvest / investTypeTarget.price)
      let totalNbPlantPaid = nbPlantPaid + nbRepotPlant
      let resteInvest = totalReinvest - investTypeTarget.price * nbPlantPaid
      if (nbPlantPaid > 0) growingPlantHistory.push({ nbPlant: nbPlantPaid, age: 0 })

      // total growing plant
      let totalPlantInGrowing = this.calculateTotalPlantInGrowing(growingPlantHistory)
      this.ngxArrayPush(name, totalPlantInGrowing, NgxDataTypeEstimate.totalPlantInGrowing)

      // total invest
      let meta = { nbPlantPaid: totalNbPlantPaid, resteInvest: resteInvest }
      this.ngxArrayPush(name, totalInvest, NgxDataTypeEstimate.totalInvest, meta)

      // benefit
      let benefice = totalInvest - totalMySelfInvest
      this.ngxArrayPush(name, benefice, NgxDataTypeEstimate.benefit)

      // final benefit
      let finalBenefice = benefice * (1 - this.taxe)
      this.ngxArrayPush(name, finalBenefice, NgxDataTypeEstimate.finalBenefit)

      // current invest
      this.ngxArrayPush(name, totalReinvest, NgxDataTypeEstimate.currentInvest)

      // currentPlantPaid
      this.ngxArrayPush(name, totalNbPlantPaid, NgxDataTypeEstimate.currentPlantPaid)
    })
  }

  calculateTotalPlantInGrowing(growingPlantHistory: Array<GrowingPlant>): number {
    let totalPlantInGrowing = 0
    growingPlantHistory.forEach((e: GrowingPlant) => {
      totalPlantInGrowing += e.nbPlant
    })
    return totalPlantInGrowing
  }

  calculateTotals(index: number, totalInvest: number, totalMySelfInvest: number, reinvest: number) {
    let totalReinvest = 0
    // loop on recurrentInvest
    this.investParams.recurrentInvests.forEach((rencurrentInvest: RecurrentInvest) => {
      if (index < rencurrentInvest.startIndex) return
      if (!rencurrentInvest.isActive) return
      if (index > rencurrentInvest.endIndex && rencurrentInvest.endIndex != 0) return
      let exactIndex = index - rencurrentInvest.startIndex
      if (exactIndex % rencurrentInvest.frequency != 0) return
      totalReinvest += rencurrentInvest.amount
      totalInvest += rencurrentInvest.amount
      totalMySelfInvest += rencurrentInvest.amount
    })
    // loop on ponctualInvest
    this.investParams.ponctualInvests.forEach((ponctualInvest: PonctualInvest) => {
      if (!ponctualInvest.isActive) return
      if (ponctualInvest.indexRefund == index && index > 0) {
        totalMySelfInvest -= ponctualInvest.amount
      } else if (ponctualInvest.index == index) {
        totalReinvest += ponctualInvest.amount
        totalInvest += ponctualInvest.amount
        totalMySelfInvest += ponctualInvest.amount
      }
    })
    totalInvest += reinvest
    totalReinvest += reinvest
    if (index > 0) totalReinvest += this.ngxArrayData[NgxDataTypeEstimate.totalInvest].series[index - 1].meta?.resteInvest || 0
    return {
      totalReinvest: totalReinvest,
      totalInvest: totalInvest,
      totalMySelfInvest: totalMySelfInvest
    }
  }

  repotCalcul(investTypeTarget: InvestType, growingPlantHistory: Array<GrowingPlant>): number {
    let nbRepotPlant = 0
    growingPlantHistory.forEach((e: GrowingPlant, index) => {
      growingPlantHistory[index].age++
      if (this.itsTimeToRepot(investTypeTarget, e.age)) nbRepotPlant += e.nbPlant
    })
    return nbRepotPlant
  }

  clearGrowingHistory(investTypeTarget: InvestType, growingPlantHistory: Array<GrowingPlant>): Array<GrowingPlant> {
    return growingPlantHistory.filter((e: GrowingPlant) => !this.isOverTimeGrowing(investTypeTarget, e.age))
  }

  isOverTimeGrowing(investTypeTarget: InvestType, currentAge: number) {
    let maxMounthReplot = investTypeTarget.growingPeriod ? this.getMounthCountByGrowingPeriod(investTypeTarget.growingPeriod) + 1 : investTypeTarget.businessPlan * 12
    if (currentAge == maxMounthReplot && currentAge != 0) {
      return true
    } else {
      return false
    }
  }

  itsTimeToRepot(investTypeTarget: InvestType, currentAge: number): boolean {
    let maxMounthReplot = investTypeTarget.businessPlan * 12
    if (currentAge < maxMounthReplot && currentAge % (12 / investTypeTarget.harvestPerYear) == 0 && currentAge != 0) {
      return true
    } else {
      return false
    }
  }

  getInvestTypeData(id: number): InvestType {
    return investTypeData.find((e: InvestType) => e.id == id)!
  }

  calculateRent(index: number, nbPlantToRentWithMounth: number) {
    let rentAmount = parseInt(this.investParams.plantRentabity)
    let reinvest = nbPlantToRentWithMounth * rentAmount
    let drop = 0
    this.investParams.ponctualInvests.forEach((ponctualInvest: PonctualInvest) => {
      if (!ponctualInvest.isActive) return
      if (ponctualInvest.indexRefund == index && index > 0) {
        drop += ponctualInvest.amount * (1 + this.taxe)
      }
    })
    this.investParams.ponctualDrops.forEach((ponctualDrop: PonctualDrop) => {
      if (!ponctualDrop.isActive) return
      if (ponctualDrop.index == index && index > 0) {
        drop += ponctualDrop.amount * (1 + this.taxe)
      }
    })
    this.investParams.recurrentDrops.forEach((recurrentDrop: RecurrentDrop) => {
      if (index < recurrentDrop.startIndex) return
      if (!recurrentDrop.isActive) return
      if (index > recurrentDrop.endIndex && recurrentDrop.endIndex != 0) return
      let exactIndex = index - recurrentDrop.startIndex
      if (exactIndex % recurrentDrop.frequency != 0) return
      drop += recurrentDrop.amount * (1 + this.taxe)
    })
    reinvest -= drop
    return { reinvest: reinvest, drop: drop }
  }

}