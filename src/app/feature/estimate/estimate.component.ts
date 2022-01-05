import { Component, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DisplayPanel, InvestParams, PartialReinvest } from 'src/app/core/models/invest-type';
import { LegendPosition } from '@swimlane/ngx-charts';
import { NgxChart } from 'src/app/core/models/ngx-chart';
import { investTypeData } from '../../core/models/invest-type';
import { oneYear } from 'src/app/core/models/year';
import { NgxChartClass } from 'src/app/core/services/ngx-chart';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.scss']
})
export class EstimateComponent implements OnInit {
  // output
  @Output() submit = new EventEmitter();

  // input
  @Input() investParams: InvestParams = {
    investLoanning: 0,
    loanningTimeRefund: 0,
    investStarter: 0,
    investByMounth: 50,
    investTypeId: "0",
    yearsGeneration: 1,
    ponctualInvest: ""
  }
  @Input() partialReinvest: PartialReinvest = {
    percent: 100,
    maxRentDrop: 0,
    minimalTimeBeforeDrop: 0,
    frequency: 1
  }
  @Input() displayPanel: DisplayPanel = {
    totalInvest: true,
    realProfit: false,
    currentPlantPaid: true,
    totalPlantInGrowing: false,
    currentRent: false,
    totalSelfInvest: true,
    benefit: true
  }

  // Enum && Data declaration
  investTypeData = investTypeData
  oneYear = oneYear

  // ngx-chart data default
  ngxArrayData: Array<NgxChart> = []

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

  // ngxChartClass
  currentCalcul: any;

  constructor() {
    this.currentCalcul = new NgxChartClass(this.investParams, this.partialReinvest, this.displayPanel)
  }

  ngOnInit(): void { }

  save() {
    let myEstimate = {
      investParams: this.investParams,
      partialReinvest: this.partialReinvest,
      displayPanel: this.displayPanel
    }
    this.submit.emit(myEstimate)
  }

  recalculate() {
    this.currentCalcul.setParams(this.investParams, this.partialReinvest, this.displayPanel)
    this.currentCalcul.recalculate()
    this.currentCalcul.applyFilter()
    this.ngxArrayData = [...this.currentCalcul.ngxArrayData]
    console.log(this.ngxArrayData)
  }

  window(): any {
    return window;
  }

}