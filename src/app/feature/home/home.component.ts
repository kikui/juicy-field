import {Component, OnInit} from '@angular/core';
import { InvestParams, InvestType, PartialReinvest } from 'src/app/core/models/invest-type';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxChart } from 'src/app/core/models/ngx-chart';
import { investTypeData } from '../../core/models/invest-type';
import { Mounth, oneYear } from 'src/app/core/models/year';
import { NgxChartClass } from 'src/app/core/services/ngx-chart';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // input
  investParams: InvestParams = {
    investLoanning: 0,
    loanningTimeRefund: 0,
    investStarter: 0,
    investByMounth: 50,
    investTypeId: "0"
  }
  partialReinvest: PartialReinvest = {
    percent: 100,
    maxRentDrop: 0,
    minimalTimeBeforeDrop: 0,
    frequency: 1
  }
  displayTotalInvest: boolean = true

  // Enum && Data declaration
  investTypeData = investTypeData
  oneYear = oneYear

  // ngx-chart data default
  ngxArrayData: Array<NgxChart> = [
    {name: "Dépenses", series: [{name: "default", value: 0}]},
    {name: "Rentrées", series: [{name: "default", value: 0}]}
  ]

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

  // calcul option
  yearsGeneration = 1

  // ngxChartClass
  currentCalcul: any;

  constructor() {
    this.currentCalcul = new NgxChartClass(this.yearsGeneration, this.investParams, this.partialReinvest)
  }

  ngOnInit(): void {
    this.currentCalcul.calculateNgxArrayData()
    this.ngxArrayData = this.currentCalcul.ngxArrayData
  }

  recalculate() {
    this.currentCalcul.setParams(this.yearsGeneration, this.investParams, this.partialReinvest)
    this.currentCalcul.recalculate()
    if(!this.displayTotalInvest) {
      this.currentCalcul.ngxArrayDataWithoutTotalInvest()
    } 
    this.ngxArrayData = [...this.currentCalcul.ngxArrayData]
    console.log(this.ngxArrayData)
  }

}