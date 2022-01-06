import { InvestType } from "../models/invest-type";
import { NgxChart, NgxChartSeries } from "../models/ngx-chart"
import { oneYear } from "../models/year";

export class NgxChartCore {
  ngxArrayData: Array<NgxChart>;

  constructor() {
    this.ngxArrayData = []
  }

  resetData() {
    this.ngxArrayData.forEach((e) => {
      e.series = []
    })
  }

  ngxArrayPush(name: string, value: number, index: number, meta: any = null) {
    let ngxChartSeries: NgxChartSeries = {
      name: name,
      value: value,
      meta: meta
    }
    this.ngxArrayData[index].series.push(ngxChartSeries)
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