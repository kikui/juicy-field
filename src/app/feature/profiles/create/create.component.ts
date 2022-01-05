import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Profile } from 'src/app/core/models/profile';
import { oneYear } from 'src/app/core/models/year';
import { FirestoreService } from 'src/app/core/services/firestore.service';

@Component({
  selector: 'dialog-profiles-create',
  templateUrl: 'create.component.html',
})
export class DialogProfilesCreate {
  profile: Profile = {
    name: "",
    pseudo: "",
    imageUrl: "",
    myEstimate: {
      investParams: {
        investLoanning: 0,
        loanningTimeRefund: 0,
        investStarter: 0,
        investByMounth: 0,
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
        realProfit: false,
        currentPlantPaid: true,
        totalPlantInGrowing: false,
        currentRent: false,
        totalSelfInvest: true,
        benefit: true
      }
    },
    myInvestisment: [{year: 2022, mounth: oneYear[0].name, mounthInvest: 0, restMounth: 0, reinvest: 0, gain: 0}]
  }
  constructor(private firestoreService: FirestoreService, public dialogRef: MatDialogRef<DialogProfilesCreate>) {}

  createProfile() {
    if (this.profile.pseudo == "" && this.profile.name == "") return
    this.firestoreService.createProfile(this.profile)
    this.dialogRef.close()
  }
}