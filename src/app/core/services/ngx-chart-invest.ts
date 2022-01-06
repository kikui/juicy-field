import { investTypeData } from "../models/invest-type";
import { NgxChart, NgxChartSeries, NgxDataType, NgxDataTypeInvest } from "../models/ngx-chart";
import { Investisment } from "../models/profile";
import { NgxChartCore } from "./ngx-chart-core";

export class NgxChartInvestClass extends NgxChartCore {
  // variables
  myInvestisment: Array<Investisment>

  constructor(myInvestisment: Array<Investisment>) {
    super()
    this.myInvestisment = myInvestisment
    this.ngxArrayData = [
      { name: "Total investi", series: [] },
      { name: "Total investi soi meme", series: [] },
      { name: "Bénéfice", series: [] },
      { name: "Investissement courant", series: [] },
      { name: "Total retrait", series: [] },
    ]
  }

  setParams(myInvestisment: Array<Investisment>) {
    this.myInvestisment = myInvestisment
  }

  recalculate(myInvestisment: Array<Investisment>) {
    this.resetData()
    this.setParams(myInvestisment)
    this.calculMyInvest()
    return this.ngxArrayData
  }

  calculMyInvest() {
    let totalInvest = 0
    let totalSelfInvest = 0
    let totalGain = 0

    this.myInvestisment.forEach((investisment: Investisment) => {
      let name = `${investisment.mounth} ${investisment.year}`
      // current invest
      let currentInvest = investisment.mounthInvest + investisment.reinvest
      this.ngxArrayPush(
        name,
        currentInvest,
        NgxDataTypeInvest.currentInvest
      )

      // total invest
      totalInvest += investisment.mounthInvest + investisment.reinvest
      this.ngxArrayPush(
        name,
        totalInvest,
        NgxDataTypeInvest.totalInvest
      )

      //total self invest
      totalSelfInvest += investisment.mounthInvest
      this.ngxArrayPush(
        name,
        totalSelfInvest,
        NgxDataTypeInvest.totalSelfInvest
      )

      // benefit 
      let benefit = totalInvest - totalSelfInvest
      this.ngxArrayPush(
        name,
        benefit,
        NgxDataTypeInvest.benefit
      )

      // total gain
      totalGain += investisment.gain
      this.ngxArrayPush(
        name,
        totalGain,
        NgxDataTypeInvest.totalGain
      )
    })
  }
}


