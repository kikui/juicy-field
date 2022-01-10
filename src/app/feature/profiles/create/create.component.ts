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
        investTypeId: "0",
        yearsGeneration: 1,
        plantRentabity: "68",
        ponctualInvests: [{amount: 0, index: 0, indexRefund: 0, isActive: true}],
        recurrentInvests: [{amount: 0, frequency: 0, startIndex: 0, isActive: true}],
        ponctualDrops: [{index: 0, amount: 0, isActive: true}]
      },
      displayPanel: {
        totalInvest: true,
        drop: true,
        currentPlantPaid: true,
        totalPlantInGrowing: false,
        currentRent: false,
        totalSelfInvest: true,
        benefit: true,
        finalBenefit: true
      }
    },
    myInvestisment: [{year: 2022, mounth: oneYear[0].name, mounthInvest: 0, currentRent: 0, reinvest: 0, gain: 0}]
  }
  constructor(private firestoreService: FirestoreService, public dialogRef: MatDialogRef<DialogProfilesCreate>) {}

  createProfile() {
    if (this.profile.pseudo == "" && this.profile.name == "") return
    this.firestoreService.createProfile(this.profile)
    this.dialogRef.close()
  }
}