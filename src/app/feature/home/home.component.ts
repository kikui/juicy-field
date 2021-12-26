import {Component, OnInit} from '@angular/core';
import { InvestType, PartialReinvest } from 'src/app/core/models/invest-type';
import { NgxChartsModule } from '@swimlane/ngx-charts';
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
  investLoanning: number = 0
  investStarter: number = 0
  investByMounth: number = 50
  investTypeId: string = "0"
  partialReinvest: PartialReinvest = {
    percent: 100,
    maxRentDrop: 0,
    minimalTimeBeforeDrop: 0
  }

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
  displayType = DisplayType.byMouth

  // ngxChartClass
  currentCalcul: any;

  constructor() {
    this.currentCalcul = new NgxChartClass(
      this.yearsGeneration, this.displayType, this.investByMounth, 
      parseInt(this.investTypeId), this.partialReinvest, this.investStarter
    )
  }

  ngOnInit(): void {
    this.currentCalcul.calculateNgxArrayDataByDisplayType()
    this.ngxArrayData = this.currentCalcul.ngxArrayData
  }

  recalculate() {
    this.currentCalcul.setParams(this.investByMounth, this.yearsGeneration, 
      this.investTypeId, this.partialReinvest, this.investStarter)
    this.currentCalcul.recalculate()
    this.ngxArrayData = [...this.currentCalcul.ngxArrayData]
    console.log(this.ngxArrayData)
  }

}

export enum DisplayType {
  byDay,
  byMouth,
  byYear
}