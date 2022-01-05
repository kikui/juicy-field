import { InvestType, investTypeData } from "../models/invest-type";
import { NgxChart, NgxChartSeries, NgxDataType, NgxDataTypeInvest, NgxDataTypeStat } from "../models/ngx-chart";
import { Investisment } from "../models/profile";
import { oneYear } from "../models/year";

export class NgxChartStatClass {
  // variables
  myInvestisment: Array<Investisment>
  investType: InvestType

  // options
  ngxArrayData: Array<NgxChart>;

  constructor(myInvestisment: Array<Investisment>, investType: InvestType) {
    this.myInvestisment = myInvestisment
    this.investType = investType
    this.ngxArrayData = [
      {name: "Rentabilité moyenne courante", series: []}
    ]
  }

  setParams(myInvestisment: Array<Investisment>, investType: InvestType) {
    this.myInvestisment = myInvestisment
    this.investType = investType
  }

  resetData() {
    this.ngxArrayData.forEach((e) => {
      e.series = []
    })
  }

  recalculate(myInvestisment: Array<Investisment>, investType: InvestType) {
    this.resetData()
    this.setParams(myInvestisment, investType)
    this.calculMyInvest()
  }

  calculMyInvest() {
    this.myInvestisment.forEach((investisment: Investisment, index: number) => {
      let targetMounth = this.getTargetMounthIndex(this.investType, index)
      if (targetMounth < 0) return

      let targetMounthPay =  this.myInvestisment[targetMounth].mounthInvest + this.myInvestisment[targetMounth].reinvest
      let currentRentability = 100 * investisment.rentMounth / targetMounthPay - 100
      let ngxCurrentInvest: NgxChartSeries = {
        name: `${investisment.mounth} ${investisment.year}`,
        value: currentRentability,
      }
      this.ngxArrayData[NgxDataTypeStat.currentRentability].series.push(ngxCurrentInvest)
    })
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


