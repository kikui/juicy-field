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
      {name: "Total gain", series: []}
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
      // total invest
      totalInvest += investisment.mounthInvest + investisment.reinvest
      let ngxTotalInvest: NgxChartSeries = {
        name: `${investisment.mounth.name} ${investisment.year}`,
        value: totalInvest,
      }
      this.ngxArrayData[NgxDataTypeInvest.totalInvest].series.push(ngxTotalInvest)

      //total self invest
      totalSelfInvest += investisment.mounthInvest
      let ngxTotalSelfInvest: NgxChartSeries = {
        name: `${investisment.mounth.name} ${investisment.year}`,
        value: totalSelfInvest,
      }
      this.ngxArrayData[NgxDataTypeInvest.totalSelfInvest].series.push(ngxTotalSelfInvest)

      // total gain
      totalGain += investisment.gain
      let ngxTotalGain: NgxChartSeries = {
        name: `${investisment.mounth.name} ${investisment.year}`,
        value: totalGain,
      }
      this.ngxArrayData[NgxDataTypeInvest.totalGain].series.push(ngxTotalGain)
    })
  }
}


