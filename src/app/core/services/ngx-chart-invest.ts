import { NgxDataTypeInvest } from "../models/ngx-chart";
import { Investisment } from "../models/profile";
import { NgxChartCore } from "./ngx-chart-core";

export class NgxChartInvestClass extends NgxChartCore {
  // variables
  myInvestisment: Array<Investisment>

  constructor(myInvestisment: Array<Investisment>) {
    super()
    this.myInvestisment = myInvestisment
  }

  override initNgxArray() {
    this.ngxArrayData[NgxDataTypeInvest.totalInvest] = { name: "Total investi", series: [] }
    this.ngxArrayData[NgxDataTypeInvest.totalSelfInvest] = { name: "Total investi soi meme", series: [] }
    this.ngxArrayData[NgxDataTypeInvest.benefit] = { name: "Bénéfice", series: [] }
    this.ngxArrayData[NgxDataTypeInvest.currentInvest] = { name: "Investissement courant", series: [] }
    this.ngxArrayData[NgxDataTypeInvest.totalDrop] = { name: "Total retrait", series: [] }
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
    let totalDrop = 0

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
      totalDrop += investisment.gain
      this.ngxArrayPush(
        name,
        totalDrop,
        NgxDataTypeInvest.totalDrop
      )
    })
  }
}


