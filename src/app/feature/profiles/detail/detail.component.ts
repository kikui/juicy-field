import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Observable } from 'rxjs';
import { NgxChart } from 'src/app/core/models/ngx-chart';
import { Investisment, Profile } from 'src/app/core/models/profile';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { NgxChartClass } from 'src/app/core/services/ngx-chart';
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

  constructor(private firestore: FirestoreService, private route: ActivatedRoute) {
    this.currentInvestCalcul = new NgxChartClass()
  }

  ngOnInit(): void {
    this.firestore.getProfile(this.route.snapshot.params['pseudo']).subscribe((data) => {
      this.profile = data
      this.profile.myInvestisment.sort((a: Investisment, b: Investisment) => this.sortMyInvestisment(a, b))
      // this.myInvestismentGraph = [...this.currentInvestCalcul.calculMyInvest(this.profile.myInvestisment)]
      console.log(this.profile)
      setTimeout(() => this.estimateComponent?.recalculate(), 100);
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

  sortMyInvestisment(a: Investisment, b: Investisment) {
    let x = a.mounthTarget.toLowerCase();
    let y = b.mounthTarget.toLowerCase();

    if(x<y){return 1;} 
    if(x>y){return -1;}
    return 0;
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