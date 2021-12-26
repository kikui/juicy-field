import { InvestParams, InvestType, investTypeData, PartialReinvest } from "../models/invest-type";
import { NgxChart, NgxChartSeries } from "../models/ngx-chart";
import { Mounth, oneYear } from "../models/year";

export class NgxChartClass {
  // variables
  investParams: InvestParams;
  partialReinvest: PartialReinvest;
  // options
  years: Array<Mounth>;
  yearsGeneration: number;
  ngxArrayData: Array<NgxChart>;

  constructor(yearsGeneration: number, investParams: InvestParams, partialReinvest: PartialReinvest) {
    // options
    this.years = []
    this.yearsGeneration = yearsGeneration
    this.investParams = investParams

    // variables
    this.partialReinvest = partialReinvest
    this.ngxArrayData = [
      {name: "Total investi", series: []},
      {name: "Total investi soi meme", series: []},
      {name: "Rentrée courante", series: []},
      {name: "Bénéfice retiré", series: []}
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
    this.ngxArrayData[0].series = []
    this.ngxArrayData[1].series = []
    this.ngxArrayData[2].series = []
    this.ngxArrayData[3].series = []
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
        nbPlantToRentWithMounth = this.ngxArrayData[0].series[targetMounthIndex].meta?.nbPlantPaid || 0
        let reinvestAndGain = this.calculateRent(index, investTypeTarget, nbPlantToRentWithMounth, targetMounthIndex)
        reinvest = reinvestAndGain.reinvest
        gain = reinvestAndGain.gain
      }
      
      // benefit
      let benefice: NgxChartSeries = {
        name: currentYear + mounth.name,
        value: gain,
      }
      this.ngxArrayData[3].series.push(benefice)

      // current rent
      let currentRent: NgxChartSeries = {
        name: currentYear + mounth.name,
        value: reinvest,
      }
      this.ngxArrayData[2].series.push(currentRent)
      
      let totalReinvest = 0
      if(index == 0 && (this.investParams.investStarter > 0 || this.investParams.investLoanning)) {
        totalReinvest += this.investParams.investStarter + this.investParams.investLoanning
        totalInvest += this.investParams.investStarter + this.investParams.investLoanning
        totalMySelfInvest += this.investParams.investStarter + this.investParams.investLoanning
        if(index == this.investParams.loanningTimeRefund) {
          totalInvest -= this.investParams.investLoanning
          totalReinvest -= this.investParams.investLoanning
          totalMySelfInvest -= this.investParams.investLoanning
        }
      } else {
        if(index == this.investParams.loanningTimeRefund) {
          totalReinvest -= this.investParams.investLoanning
          totalMySelfInvest -= this.investParams.investLoanning
        }
        totalReinvest += this.investParams.investByMounth + reinvest
        totalInvest += totalReinvest
        totalMySelfInvest += this.investParams.investByMounth
      }

      // total myslef invest
      let daySpentMySelf: NgxChartSeries = {
        name: currentYear + mounth.name,
        value: totalMySelfInvest,
      }
      this.ngxArrayData[1].series.push(daySpentMySelf)

      // total invest
      let daySpent: NgxChartSeries = {
        name: currentYear + mounth.name,
        value: totalInvest,
        meta: {
          nbPlantPaid: Math.trunc(totalReinvest / investTypeTarget.price), 
          resteInvest: totalReinvest - investTypeTarget.price * Math.trunc(totalReinvest / investTypeTarget.price)
        }
      }
      this.ngxArrayData[0].series.push(daySpent)
    })
  }

  calculateRent(index: number, investTypeTarget: InvestType, nbPlantToRentWithMounth: number, targetMounthIndex: number) {
    let reinvest = this.ngxArrayData[0].series[targetMounthIndex].meta?.resteInvest || 0
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

  calculateNgxArrayDataByDay() {
    let currentYear = 1
    let currentDay = 1
    let investTypeTarget = this.getInvestTypeData(parseInt(this.investParams.investTypeId))

    if (!investTypeTarget.growingPeriod) {
      investTypeTarget.growingPeriod = this.calculateGrowingPeriod(investTypeTarget)
    }
    let totalInvest = 0
    let totalRent = 0

    this.years.forEach((mounth: Mounth, index: number) =>  {
      let reinvest = 0
      let nbPlantToRentWithMounth = 0
      if ((index+1) % 13 == 0) currentYear++
      
      for(let i = 0; i < mounth.nbDay; i++) {
        let indexRent = currentDay - investTypeTarget.growingPeriod!
        let targetIndexMounthRent = this.getIndexMounthToRent(indexRent)
        
        nbPlantToRentWithMounth = this.ngxArrayData[0].series[targetIndexMounthRent]?.meta?.nbPlantPaid || 0
        reinvest = this.ngxArrayData[0].series[targetIndexMounthRent]?.meta?.resteInvest || 0
        reinvest += nbPlantToRentWithMounth * investTypeTarget.revenue.minimal
        
        currentDay++
      }
      
      console.log("final mounth nbPlantToRen", nbPlantToRentWithMounth)
      totalRent += nbPlantToRentWithMounth * investTypeTarget.revenue.minimal
      let dayRent: NgxChartSeries = {
        name: currentYear + mounth.name,
        value: totalRent,
      }
      this.ngxArrayData[1].series.push(dayRent)
      
      let totalReinvest = 0
      if(index == 0 && this.investParams.investStarter > 0) {
        totalInvest += this.investParams.investStarter
        totalReinvest += this.investParams.investStarter
      } else {
        totalInvest += this.investParams.investByMounth + reinvest
        totalReinvest += this.investParams.investByMounth + reinvest
      }

      console.log(Math.trunc(totalReinvest / investTypeTarget.price))
      let daySpent: NgxChartSeries = {
        name: currentYear + mounth.name,
        value: totalInvest,
        meta: {
          nbPlantPaid: Math.trunc(totalReinvest / investTypeTarget.price), 
          resteInvest: totalReinvest - investTypeTarget.price * Math.trunc(totalReinvest / investTypeTarget.price)
        }
      }
      this.ngxArrayData[0].series.push(daySpent)
    })
  }

  getIndexMounthToRent(indexRent: number): number {
    let currentDay = 0
    let targetIndexMounth: number
    this.years.forEach((mounth: Mounth, index: number) =>  {
      for (let i = 0; i < mounth.nbDay; i++) {
        if(currentDay == indexRent) {
          targetIndexMounth = index
          console.log(mounth.name)
        } 
        currentDay++;
      }
    })
    return targetIndexMounth!
  }

  getInvestTypeData(id: number): InvestType {
    return investTypeData.find((e: InvestType) => e.id == id )!
  }

  calculateGrowingPeriod(investTypeTarget: InvestType): number  {
    return 365 / investTypeTarget.harvestPerYear
  }

}