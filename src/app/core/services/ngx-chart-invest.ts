import { investTypeData } from "../models/invest-type";
import { NgxChart, NgxChartSeries, NgxDataType, NgxDataTypeInvest } from "../models/ngx-chart";
import { Investisment } from "../models/profile";

export class NgxChartInvestClass {
  // variables
  myInvestisment: Array<Investisment>

  // options
  ngxArrayData: Array<NgxChart>;

  constructor(myInvestisment: Array<Investisment>) {
    this.myInvestisment = myInvestisment
    this.ngxArrayData = [
      {name: "Total investi", series: []},
      {name: "Total investi soi meme", series: []},
      {name: "Investissement courant", series: []},
      {name: "Total retrait", series: []},
    ]
  }

  setParams(myInvestisment: Array<Investisment>) {
    this.myInvestisment = myInvestisment
  }

  resetData() {
    this.ngxArrayData.forEach((e) => {
      e.series = []
    })
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
      // current invest
      let currentInvest = investisment.mounthInvest + investisment.reinvest
      let ngxCurrentInvest: NgxChartSeries = {
        name: `${investisment.mounth} ${investisment.year}`,
        value: currentInvest,
      }
      this.ngxArrayData[NgxDataTypeInvest.currentInvest].series.push(ngxCurrentInvest)

      // total invest
      totalInvest += investisment.mounthInvest + investisment.reinvest
      let ngxTotalInvest: NgxChartSeries = {
        name: `${investisment.mounth} ${investisment.year}`,
        value: totalInvest,
      }
      this.ngxArrayData[NgxDataTypeInvest.totalInvest].series.push(ngxTotalInvest)

      //total self invest
      totalSelfInvest += investisment.mounthInvest
      let ngxTotalSelfInvest: NgxChartSeries = {
        name: `${investisment.mounth} ${investisment.year}`,
        value: totalSelfInvest,
      }
      this.ngxArrayData[NgxDataTypeInvest.totalSelfInvest].series.push(ngxTotalSelfInvest)

      // total gain
      totalGain += investisment.gain
      let ngxTotalGain: NgxChartSeries = {
        name: `${investisment.mounth} ${investisment.year}`,
        value: totalGain,
      }
      this.ngxArrayData[NgxDataTypeInvest.totalGain].series.push(ngxTotalGain)
    })
  }
}


