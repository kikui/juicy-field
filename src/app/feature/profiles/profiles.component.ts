import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentData } from '@firebase/firestore';
import { Profile } from 'src/app/core/models/profile';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { DialogProfilesCreate } from './create/create.component';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {
  profiles: Array<Profile | DocumentData> = []

  constructor(public firestoreService: FirestoreService, public dialog: MatDialog) {
    
  }

  ngOnInit(): void {
    this.firestoreService.profiles.subscribe((profilesData) => {
      this.profiles = profilesData
    })
  }

  openDialog() {
    this.dialog.open(DialogProfilesCreate);
  }

}