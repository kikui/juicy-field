import { Component, ElementRef, Input, OnInit, Output, EventEmitter, DoCheck } from '@angular/core';
import { DisplayPanel, EnumInvestType, InvestParams, InvestType, RecurrentDrop } from 'src/app/core/models/invest-type';
import { LegendPosition } from '@swimlane/ngx-charts';
import { NgxChart } from 'src/app/core/models/ngx-chart';
import { investTypeData } from '../../core/models/invest-type';
import { oneYear } from 'src/app/core/models/year';
import { NgxChartEstimateClass } from 'src/app/core/services/ngx-chart-estimate';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.scss']
})
export class EstimateComponent implements OnInit, DoCheck {
  // output
  @Output() submit = new EventEmitter();

  // input
  @Input() investParams: InvestParams = {
    investTypeId: "0",
    yearsGeneration: 1,
    plantRentabity: "68",
    ponctualInvests: [],
    recurrentInvests: [],
    ponctualDrops: [],
    recurrentDrops: []
  }
  @Input() displayPanel: DisplayPanel = {
    totalInvest: true,
    drop: false,
    currentPlantPaid: true,
    totalPlantInGrowing: false,
    currentRent: false,
    totalSelfInvest: true,
    benefit: true,
    finalBenefit: true
  }

  currentInvestType: InvestType = investTypeData[0]
  arrayInvestTypeRevenu: Array<number> = []

  // table params
  recurrentInvestDisplayedColumns = ["amount", "frequency", "startIndex", "endIndex", "isActive", "action"]
  ponctualInvestDisplayedColumns = ["amount", "index", "indexRefund", "isActive", "action"]
  ponctualDropDisplayedColumns = ["amount", "index", "isActive", "action"]

  // Enum && Data declaration
  investTypeData = investTypeData
  oneYear = oneYear
  EnumInvestType = EnumInvestType

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
  yAxisLabel: string = 'Argent (???)';

  // ngxChartClass
  currentCalcul: any;

  constructor() {
    this.currentCalcul = new NgxChartEstimateClass(this.investParams, this.displayPanel)
  }

  ngOnInit(): void {
    let currentInvestType = this.currentCalcul.getInvestTypeData(parseInt(this.investParams.investTypeId))
    this.calculateRevenu(currentInvestType)
  }

  ngDoCheck(): void {
    if (this.currentInvestType.id != parseInt(this.investParams.investTypeId)) {
      this.checkRecalculRevenu()
    }
  }

  save() {
    let myEstimate = {
      investParams: this.investParams,
      displayPanel: this.displayPanel
    }
    this.submit.emit(myEstimate)
  }

  addEntrie(enumInvestType: EnumInvestType) {
    switch (enumInvestType) {
      case EnumInvestType.recurrentInvest:
        this.investParams.recurrentInvests.unshift({ amount: 0, frequency: 0, startIndex: 0, endIndex: 0, isActive: true })
        this.investParams.recurrentInvests = [...this.investParams.recurrentInvests]
        break;
      case EnumInvestType.ponctualInvest:
        this.investParams.ponctualInvests.unshift({ amount: 0, index: 0, indexRefund: 0, isActive: true })
        this.investParams.ponctualInvests = [...this.investParams.ponctualInvests]
        break;
      case EnumInvestType.ponctualDrop:
        this.investParams.ponctualDrops.unshift({ amount: 0, index: 0, isActive: true })
        this.investParams.ponctualDrops = [...this.investParams.ponctualDrops]
        break;
      case EnumInvestType.recurrentDrops:
        this.investParams.recurrentDrops.unshift({ amount: 0, frequency: 0, startIndex: 0, endIndex: 0, isActive: true })
        this.investParams.recurrentDrops = [...this.investParams.recurrentDrops]
        break;
      default:
        break;
    }
  }

  deleteEntrie(enumInvestType: EnumInvestType, index: number) {
    switch (enumInvestType) {
      case EnumInvestType.recurrentInvest:
        this.investParams.recurrentInvests.splice(index, 1)
        this.investParams.recurrentInvests = [...this.investParams.recurrentInvests]
        break;
      case EnumInvestType.ponctualInvest:
        this.investParams.ponctualInvests.splice(index, 1)
        this.investParams.ponctualInvests = [...this.investParams.ponctualInvests]
        break;
      case EnumInvestType.ponctualDrop:
        this.investParams.ponctualDrops.splice(index, 1)
        this.investParams.ponctualDrops = [...this.investParams.ponctualDrops]
        break;
      case EnumInvestType.recurrentDrops:
        this.investParams.recurrentDrops.splice(index, 1)
        this.investParams.recurrentDrops = [...this.investParams.recurrentDrops]
        break;
      default:
        break;
    }
  }

  recalculate() {
    this.checkDataPresence()
    this.currentCalcul.setParams(this.investParams, this.displayPanel)
    this.currentCalcul.recalculate()
    this.currentCalcul.applyFilter()
    this.ngxArrayData = [...this.currentCalcul.ngxArrayData]
    console.log(this.ngxArrayData)
  }

  window(): any {
    return window;
  }

  calculateRevenu(currentInvestType: InvestType) {
    this.arrayInvestTypeRevenu = []
    for (let i = currentInvestType.revenue.minimal; i <= currentInvestType.revenue.maximal; i++) {
      this.arrayInvestTypeRevenu.push(i)
    }
  }

  checkRecalculRevenu() {
    this.currentInvestType = this.currentCalcul.getInvestTypeData(parseInt(this.investParams.investTypeId))
    this.calculateRevenu(this.currentInvestType)
  }

  checkDataPresence() {
    // global params present
    if(!this.investParams.recurrentDrops || this.investParams.recurrentDrops.length == 0) {
      this.investParams.recurrentDrops  =  [{ amount: 0, frequency: 0, startIndex: 0, endIndex: 0, isActive: true }]
    }

    // iter params present
    this.investParams.recurrentDrops.forEach((recurrentDrop: RecurrentDrop) => {
      if(!recurrentDrop.endIndex) recurrentDrop.endIndex = 0
    })
    this.investParams.recurrentInvests.forEach((recurrentInvests: RecurrentDrop) => {
      if(!recurrentInvests.endIndex) recurrentInvests.endIndex = 0
    })
  }

}