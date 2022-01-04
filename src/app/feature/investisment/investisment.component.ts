import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { NgxChart } from 'src/app/core/models/ngx-chart';
import { Investisment } from 'src/app/core/models/profile';
import { NgxChartClass } from 'src/app/core/services/ngx-chart';

@Component({
  selector: 'app-investisment',
  templateUrl: './investisment.component.html',
  styleUrls: ['./investisment.component.scss']
})
export class InvestismentComponent implements OnInit {
  // output
  @Output() submit = new EventEmitter();

  // input
  @Input() myInvestismentGraph: Array<NgxChart> = []
  @Input() myInvestisment: Array<Investisment> = []
  displayedColumns = ["mounthTarget", "mounthInvest", "rentMounth", "reinvest", "gain", "action"]

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

  constructor() {}

  updateData() {
    this.submit.emit([...this.myInvestisment])
  }

  deleteEntrie(index: number) {
    this.myInvestisment.splice(index, 1)
    this.myInvestisment = [...this.myInvestisment]
  }

  addEntrie() {
    this.myInvestisment.unshift({mounthTarget: "", mounthInvest: 0, rentMounth: 0, reinvest: 0, gain: 0})
    this.myInvestisment = [...this.myInvestisment]
  }

  ngOnInit(): void {
  }

  window(): any {
    return window;
  }

}