import { DisplayPanel, InvestParams, InvestType, investTypeData, PartialReinvest } from "../models/invest-type";
import { GrowingPlant, NgxChart, NgxChartSeries, NgxDataType } from "../models/ngx-chart";
import { Mounth, oneYear } from "../models/year";

export class NgxChartClass {
  // variables
  investParams: InvestParams;
  partialReinvest: PartialReinvest;
  displayPanel: DisplayPanel;

  // options
  years: Array<Mounth>;
  yearsGeneration: number;
  ngxArrayData: Array<NgxChart>;

  constructor(yearsGeneration: number, investParams: InvestParams, partialReinvest: PartialReinvest, displayPanel: DisplayPanel) {
    // options
    this.years = []
    this.yearsGeneration = yearsGeneration
    this.displayPanel = displayPanel
    
    // variables
    this.investParams = investParams
    this.partialReinvest = partialReinvest
    this.ngxArrayData = [
      {name: "Total investi", series: []},
      {name: "Total investi soi meme", series: []},
      {name: "Investissement courant", series: []},
      {name: "Rentrée courante", series: []},
      {name: "Bénéfice retiré", series: []},
      {name: "Bénéfice réel", series: []},
      {name: "Plante courante payé", series: []},
      {name: "Total plante en croissance", series: []},
    ]
    
    this.calculateYear()
  }

  setParams(yearsGeneration: number, investParams: InvestParams, partialReinvest: PartialReinvest) {
    this.investParams = investParams
    this.yearsGeneration = yearsGeneration
    this.partialReinvest = partialReinvest
  }

  calculateYear(yearsGeneration?: number) {
    yearsGeneration ? this.yearsGeneration = yearsGeneration : null
    this.years = []

    for(let i = 0; i < this.yearsGeneration; i++) {
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

  resetData() {
    this.ngxArrayData.forEach((e) => {
      e.series = []
    })
  }

  applyFilter() {
    if(!this.displayPanel.totalInvest) this.ngxArrayData[NgxDataType.totalInvest].series = []
    if(!this.displayPanel.realBenefit) this.ngxArrayData[NgxDataType.realBenefit].series = []
    if(!this.displayPanel.currentPlantPaid) this.ngxArrayData[NgxDataType.currentPlantPaid].series = []
    if(!this.displayPanel.totalPlantInGrowing) this.ngxArrayData[NgxDataType.totalPlantInGrowing].series = []
    if(!this.displayPanel.currentRent) this.ngxArrayData[NgxDataType.currentRent].series = []
    if(!this.displayPanel.totalSelfInvest) this.ngxArrayData[NgxDataType.totalSelfInvest].series = []
  }

  calculateNgxArrayData() {
    let investTypeTarget = this.getInvestTypeData(parseInt(this.investParams.investTypeId))
    let currentYear = 1
    let totalInvest = 0
    let totalMySelfInvest = 0

    this.years.forEach((mounth: Mounth, index: number) =>  {
      if (index % 12 == 0 && index != 0) currentYear++
      let targetMounthIndex = this.getTargetMounthIndex(investTypeTarget, index)
      let reinvest = 0
      let nbPlantToRentWithMounth = 0
      let gain = 0

      if(targetMounthIndex >= 0) {
        nbPlantToRentWithMounth = this.ngxArrayData[NgxDataType.totalInvest].series[targetMounthIndex].meta?.nbPlantPaid || 0
        let reinvestAndGain = this.calculateRent(index, investTypeTarget, nbPlantToRentWithMounth, targetMounthIndex)
        reinvest = reinvestAndGain.reinvest
        gain = reinvestAndGain.gain
      }
      
      // benefit
      let ngxDataTypeBenefit: NgxChartSeries = {
        name: `${currentYear}${mounth.name} (${index+1})`,
        value: gain,
      }
      this.ngxArrayData[NgxDataType.benefit].series.push(ngxDataTypeBenefit)

      // real benefit
      let ngxDataTypeRealBenefit: NgxChartSeries = {
        name: `${currentYear}${mounth.name} (${index+1})`,
        value: gain * 0.7,
      }
      this.ngxArrayData[NgxDataType.realBenefit].series.push(ngxDataTypeRealBenefit)

      // current rent
      let ngxDataTypeCurrentRent: NgxChartSeries = {
        name: `${currentYear}${mounth.name} (${index+1})`,
        value: reinvest,
      }
      this.ngxArrayData[NgxDataType.currentRent].series.push(ngxDataTypeCurrentRent)
      
      let totalsObject = this.calculateTotals(index, totalInvest, totalMySelfInvest, reinvest, gain)

      let totalReinvest = totalsObject.totalReinvest
      let totalReinvestWithLastMounthRest = totalsObject.totalReinvestWithLastMounthRest
      totalInvest = totalsObject.totalInvest
      totalMySelfInvest = totalsObject.totalMySelfInvest

      // total myslef invest
      let ngxDataTypeTotalSelfInvest: NgxChartSeries = {
        name: `${currentYear}${mounth.name} (${index+1})`,
        value: totalMySelfInvest,
      }
      this.ngxArrayData[NgxDataType.totalSelfInvest].series.push(ngxDataTypeTotalSelfInvest)

      // calculate repot && age
      let growingPlantHistory: Array<GrowingPlant> = this.ngxArrayData[NgxDataType.totalInvest].series[targetMounthIndex]?.meta?.growingPlantHistory || []
      let nbRepotPlant = this.repotCalcul(investTypeTarget, growingPlantHistory)

      // feed growingPlant
      let nbPlantPaid = Math.trunc(totalReinvestWithLastMounthRest / investTypeTarget.price)
      let totalNbPlantPaid = nbPlantPaid + nbRepotPlant
      let resteInvest = totalReinvestWithLastMounthRest - investTypeTarget.price * nbPlantPaid
      if (nbPlantPaid > 0) growingPlantHistory.push({nbPlant: nbPlantPaid, age: 0})

      // total invest
      let ngxDataTypeTotalInvest: NgxChartSeries = {
        name: `${currentYear}${mounth.name} (${index+1})`,
        value: totalInvest,
        meta: {
          nbPlantPaid: totalNbPlantPaid, 
          growingPlantHistory: growingPlantHistory,
          resteInvest: resteInvest
        }
      }
      this.ngxArrayData[NgxDataType.totalInvest].series.push(ngxDataTypeTotalInvest)

      // current invest
      let ngxDataTypecurrentInvest: NgxChartSeries = {
        name: `${currentYear}${mounth.name} (${index+1})`,
        value: totalReinvest,
      }
      this.ngxArrayData[NgxDataType.currentInvest].series.push(ngxDataTypecurrentInvest)

      // currentPlantPaid
      let ngxDataTypeCurrentPlantPaid: NgxChartSeries = {
        name: `${currentYear}${mounth.name} (${index+1})`,
        value: totalNbPlantPaid,
      }
      this.ngxArrayData[NgxDataType.currentPlantPaid].series.push(ngxDataTypeCurrentPlantPaid)
    })
  }

  calculateTotals(index: number, totalInvest: number, totalMySelfInvest: number, reinvest: number, gain: number) {
    let totalReinvest = 0
    let totalReinvestWithLastMounthRest = 0
    if(index == 0 && (this.investParams.investStarter > 0 || this.investParams.investLoanning > 0)) {
      let firstInvest = this.investParams.investStarter + this.investParams.investLoanning
      totalReinvest += firstInvest
      totalInvest += firstInvest
      totalMySelfInvest += firstInvest
      if(index == this.investParams.loanningTimeRefund) {
        totalInvest -= this.investParams.investLoanning
        totalReinvest -= this.investParams.investLoanning
        totalMySelfInvest -= this.investParams.investLoanning
      }
    } else {
      if(index == this.investParams.loanningTimeRefund) {
        totalInvest -= this.investParams.investLoanning
        totalReinvest -= this.investParams.investLoanning
        totalMySelfInvest -= this.investParams.investLoanning
      }
      totalReinvest += this.investParams.investByMounth + reinvest
      totalInvest += totalReinvest
      totalMySelfInvest += this.investParams.investByMounth
    }
    totalReinvestWithLastMounthRest = totalReinvest 
    if (index > 0) totalReinvestWithLastMounthRest += this.ngxArrayData[NgxDataType.totalInvest].series[index-1].meta?.resteInvest || 0
    totalInvest -= gain
    return {
      totalReinvest: totalReinvest,
      totalReinvestWithLastMounthRest: totalReinvestWithLastMounthRest,
      totalInvest: totalInvest,
      totalMySelfInvest: totalMySelfInvest 
    }
  }

  repotCalcul(investTypeTarget: InvestType, growingPlantHistory: Array<GrowingPlant>): number {
    let nbRepotPlant = 0
    growingPlantHistory.forEach((e: GrowingPlant, index) => {
      if (investTypeTarget.harvestPerYear > 0) growingPlantHistory[index].age += (12 / investTypeTarget.harvestPerYear)
      if (this.itsTimeToRepot(investTypeTarget, e.age)) nbRepotPlant += e.nbPlant
    })
    return nbRepotPlant
  }

  itsTimeToRepot(investTypeTarget: InvestType, currentAge: number): boolean {
    let maxMounthReplot = investTypeTarget.businessPlan * 12
    if(currentAge < maxMounthReplot && currentAge % (12 / investTypeTarget.harvestPerYear) == 0 && currentAge != 0) {
      return true
    } else {
      return false
    }
  }

  getInvestTypeData(id: number): InvestType {
    return investTypeData.find((e: InvestType) => e.id == id )!
  }

  calculateRent(index: number, investTypeTarget: InvestType, nbPlantToRentWithMounth: number, targetMounthIndex: number) {
    let reinvest = 0
    let gain = 0
    if (index+1 > this.partialReinvest.minimalTimeBeforeDrop && index % this.partialReinvest.frequency == 0) {
      let potentialGain = nbPlantToRentWithMounth * investTypeTarget.revenue.minimal * ((100 - this.partialReinvest.percent) / 100)
      gain = potentialGain > this.partialReinvest.maxRentDrop && this.partialReinvest.maxRentDrop != 0 ? this.partialReinvest.maxRentDrop : potentialGain
      reinvest = nbPlantToRentWithMounth * investTypeTarget.revenue.minimal * (this.partialReinvest.percent / 100) + potentialGain - gain
    } else {
      reinvest = nbPlantToRentWithMounth * investTypeTarget.revenue.minimal
    }
    return {reinvest: reinvest, gain: gain}
  }

  getTargetMounthIndex(investType: InvestType, currentIndex: number): number {
    let growingPeriodInMonth = 0
    if (investType.growingPeriod) {
      growingPeriodInMonth = 12 / this.getMounthCountByGrowingPeriod(investType.growingPeriod)
    } else {
      growingPeriodInMonth = 12 / investType.harvestPerYear
    }
    return currentIndex - growingPeriodInMonth
  }

  getMounthCountByGrowingPeriod(growingPeriod: number): number {
    let count = 0
    let isFind = false
    let indexTarget = 0
    oneYear.forEach((mounth, index) => {
      if (count > growingPeriod && isFind == false) {
        indexTarget = index - 1
        isFind = true
      }
      count += mounth.nbDay
    })
    return indexTarget
  }

}