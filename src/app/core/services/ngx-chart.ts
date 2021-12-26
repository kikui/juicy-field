import { DisplayType } from "src/app/feature/home/home.component";
import { InvestType, investTypeData, PartialReinvest } from "../models/invest-type";
import { NgxChart, NgxChartSeries } from "../models/ngx-chart";
import { Mounth, oneYear } from "../models/year";

export class NgxChartClass {
  // variables
  investStarter: number;
  investByMounth: number;
  investTypeId: number;
  partialReinvest: PartialReinvest;
  // options
  years: Array<Mounth>;
  yearsGeneration: number;
  displayType: DisplayType;
  ngxArrayData: Array<NgxChart>;

  constructor(yearsGeneration: number, displayType: DisplayType, investByMounth: number, 
    InvestTypeId: number, partialReinvest: PartialReinvest, investStarter: number) {
    // options
    this.years = []
    this.yearsGeneration = yearsGeneration
    this.displayType = displayType
    this.investStarter = investStarter

    // variables
    this.investByMounth = investByMounth
    this.investTypeId = InvestTypeId
    this.partialReinvest = partialReinvest
    this.ngxArrayData = [
      {name: "Total investi", series: []},
      {name: "Total investi soi meme", series: []},
      {name: "Rentrée courante", series: []},
      {name: "Bénéfice retiré", series: []}
    ]
    
    this.calculateYear()
  }

  setParams(investByMounth: number, yearsGeneration: number, 
    investTypeId: number, partialReinvest: PartialReinvest, investStarter: number) {
    this.investByMounth = investByMounth
    this.yearsGeneration = yearsGeneration
    this.investTypeId = investTypeId
    this.partialReinvest = partialReinvest
    this.investStarter = investStarter
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
    this.calculateNgxArrayDataByDisplayType()
  }

  resetData() {
    this.ngxArrayData[0].series = []
    this.ngxArrayData[1].series = []
    this.ngxArrayData[2].series = []
    this.ngxArrayData[3].series = []
  }

  calculateNgxArrayDataByDisplayType() {
    switch (this.displayType) {
      case DisplayType.byDay:
        this.calculateNgxArrayDataByDay()
        break;
      case DisplayType.byMouth:
        this.calculateNgxArrayDataByMounth()
        break;
      case DisplayType.byYear:
        break;
      default:
        break;
    }
  }

  calculateNgxArrayDataByMounth() {
    let investTypeTarget = this.getInvestTypeData(this.investTypeId)
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
      if(index == 0 && this.investStarter > 0) {
        totalReinvest += this.investStarter
        totalInvest += this.investStarter
        totalMySelfInvest += this.investStarter
      } else {
        totalReinvest += this.investByMounth + reinvest
        totalInvest += totalReinvest
        totalMySelfInvest += this.investByMounth
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
    if (index+1 >= this.partialReinvest.minimalTimeBeforeDrop) {
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
    let investTypeTarget = this.getInvestTypeData(this.investTypeId)

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
      if(index == 0 && this.investStarter > 0) {
        totalInvest += this.investStarter
        totalReinvest += this.investStarter
      } else {
        totalInvest += this.investByMounth + reinvest
        totalReinvest += this.investByMounth + reinvest
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