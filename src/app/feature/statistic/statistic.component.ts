import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { investTypeData } from 'src/app/core/models/invest-type';
import { NgxChart, NgxChartSeries, NgxDataTypeStat } from 'src/app/core/models/ngx-chart';
import { Investisment } from 'src/app/core/models/profile';
import { NgxChartStatClass } from 'src/app/core/services/ngx-chart-stat';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit, OnChanges {
  // input
  @Input() myInvestisment: Array<Investisment> = []

  // ngx-chart options
  legend: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Below
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Temps';
  yAxisLabel: string = 'Argent (€)';

  currentStatCalcul: any;
  myStatGraph: any = []

  constructor() {
    this.currentStatCalcul = new NgxChartStatClass(this.myInvestisment, investTypeData[0])
  }

  ngOnInit(): void {
    this.currentStatCalcul.calculMyInvest()
    this.myStatGraph = [...this.currentStatCalcul.ngxArrayData]
  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentStatCalcul.recalculate(changes['myInvestisment'].currentValue, investTypeData[0])
    this.myStatGraph = [...this.currentStatCalcul.ngxArrayData]
    if (this.myStatGraph[NgxDataTypeStat.currentRentability].series.length == 0) {
      this.setDefaultData()
    }
  }

  setDefaultData() {
    this.currentStatCalcul.ngxArrayPush("défaut", 0, NgxDataTypeStat.currentRentability)
  }

  window(): any {
    return window;
  }

}