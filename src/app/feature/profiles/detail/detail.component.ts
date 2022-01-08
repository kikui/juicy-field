import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Observable } from 'rxjs';
import { NgxChart } from 'src/app/core/models/ngx-chart';
import { EnumSortType, Investisment, Profile } from 'src/app/core/models/profile';
import { Mounth, oneYear } from 'src/app/core/models/year';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { NgxChartClass } from 'src/app/core/services/ngx-chart';
import { NgxChartInvestClass } from 'src/app/core/services/ngx-chart-invest';
import { NgxChartStatClass } from 'src/app/core/services/ngx-chart-stat';
import { EstimateComponent } from '../../estimate/estimate.component';

@Component({
  selector: 'app-profiles-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ProfilesDetailComponent implements OnInit {
  profile: Profile | DocumentData = {
    pseudo: "",
    name: "",
    myEstimate: {
      investParams: {
        investLoanning: 0,
        loanningTimeRefund: 0,
        investStarter: 0,
        investByMounth: 50,
        investTypeId: "0",
        yearsGeneration: 1,
        ponctualInvest: ""
      },
      partialReinvest: {
        percent: 100,
        maxRentDrop: 0,
        minimalTimeBeforeDrop: 0,
        frequency: 1
      },
      displayPanel: {
        totalInvest: true,
        realBenefit: false,
        currentPlantPaid: true,
        totalPlantInGrowing: false,
        currentRent: false,
        totalSelfInvest: true
      }
    },
    myInvestisment: []
  }

  @ViewChild('estimateComponent') estimateComponent?: EstimateComponent;
  currentInvestCalcul: any;
  myInvestismentGraph: Array<NgxChart> = [];
  myInvestisment: Array<Investisment> = []

  constructor(private firestore: FirestoreService, private route: ActivatedRoute) {
    this.currentInvestCalcul = new NgxChartInvestClass(this.profile.myInvestisment)
  }

  ngOnInit(): void {
    this.firestore.getProfile(this.route.snapshot.params['pseudo']).subscribe((data) => {
      this.profile = data

      // invest calcul
      this.myInvestisment = [...this.profile.myInvestisment.sort((a: Investisment, b: Investisment) => this.sortMyInvestisment(a, b, EnumSortType.ASC))]
      this.myInvestismentGraph = [...this.currentInvestCalcul.recalculate(this.myInvestisment)]
      
      // invest table order
      this.profile.myInvestisment.sort((a: Investisment, b: Investisment) => this.sortMyInvestisment(a, b, EnumSortType.DESC))

      // estimate recalcul
      this.estimateComponent?.checkRecalculRevenu()
      setTimeout(() => this.estimateComponent?.recalculate(), 100);
      console.log(this.profile)
    })
  }

  setParamsFromEstimate(event: any) {
    this.firestore.updateEstimate({
      pseudo: this.profile.pseudo, 
      myEstimate: event
    })
  }

  setMyInvestisment(event: Array<Investisment>) {
    this.firestore.updateInvestisment({
      pseudo: this.profile.pseudo, 
      myInvestisment: event
    })
  }

  sortMyInvestisment(a: Investisment, b: Investisment, type: EnumSortType) {
    let aMounth = this.getMounth(a.mounth)
    let bMounth = this.getMounth(b.mounth)
    if(type == EnumSortType.DESC) {
      if (a.year == b.year) {
        return aMounth.position < bMounth.position ? 1 : -1
      } 
      return a.year < b.year ? 1 : -1
    } else if (type == EnumSortType.ASC) {
      if (a.year == b.year) {
        return aMounth.position > bMounth.position ? 1 : -1
      } 
      return a.year > b.year ? 1 : -1
    } else {
      return 0
    }
  }

  getMounth(mounthName: string): Mounth {
    let mounthTarget = null
    for(let i = 0; i < oneYear.length; i++) {
      if (oneYear[i].name == mounthName) mounthTarget = oneYear[i]
    }
    return mounthTarget!
  }

  /* 
    Tabs : 
  - Mon investissement
    - tableau d'input
      - mounthInvest
      - rentMounth
      - Reinvest (hors mounthInvest)
      - gain
    - graph relatif aux datax du tableau
      - totalInvest
      - currentInvest (avec mounthInvest)
      - totalSelfInvest
  - Mes statistiques
  */

}