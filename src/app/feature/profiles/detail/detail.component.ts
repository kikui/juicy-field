import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Observable } from 'rxjs';
import { Profile } from 'src/app/core/models/profile';
import { FirestoreService } from 'src/app/core/services/firestore.service';
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
  }

  @ViewChild('estimateComponent') estimateComponent?: EstimateComponent;

  constructor(private firestore: FirestoreService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.firestore.getProfile(this.route.snapshot.params['pseudo']).subscribe((data) => {
      this.profile = data
      console.log(this.profile)
      setTimeout(() => this.estimateComponent?.recalculate(), 100);
    })
  }

  setParamsFromEstimate(event: any) {
    this.firestore.updateEstimate({
      pseudo: this.profile.pseudo, 
      investParams: event.investParams, 
      partialReinvest: event.partialReinvest, 
      displayPanel: event.displayPanel
    })
  }

  /* 
    Tabs : 
  - Mon estimation
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