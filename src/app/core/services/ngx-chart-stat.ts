import { InvestType, investTypeData } from "../models/invest-type";
import { NgxChart, NgxChartSeries, NgxDataType, NgxDataTypeInvest, NgxDataTypeStat } from "../models/ngx-chart";
import { Investisment } from "../models/profile";
import { oneYear } from "../models/year";
import { NgxChartCore } from "./ngx-chart-core";

export class NgxChartStatClass extends NgxChartCore {
  // variables
  myInvestisment: Array<Investisment>
  investType: InvestType

  constructor(myInvestisment: Array<Investisment>, investType: InvestType) {
    super()
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

  recalculate(myInvestisment: Array<Investisment>, investType: InvestType) {
    this.resetData()
    this.setParams(myInvestisment, investType)
    this.calculMyInvest()
  }

  calculMyInvest() {
    this.myInvestisment.forEach((investisment: Investisment, index: number) => {
      let name = `${investisment.mounth} ${investisment.year}`
      let targetMounth = this.getTargetMounthIndex(this.investType, index)
      if (targetMounth < 0) return

      let targetMounthPay = this.myInvestisment[targetMounth].mounthInvest + this.myInvestisment[targetMounth].reinvest
      let currentRentability = 100 * investisment.currentRent / targetMounthPay - 100

      this.ngxArrayPush(name, currentRentability, NgxDataTypeStat.currentRentability)
    })
  }
}


