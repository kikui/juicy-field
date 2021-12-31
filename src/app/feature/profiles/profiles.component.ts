import {Component, OnInit} from '@angular/core';
import { DocumentData } from '@firebase/firestore';
import { Profile } from 'src/app/core/models/profile';
import { FirestoreService } from 'src/app/core/services/firestore.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {
  profiles: Array<Profile | DocumentData> = []

  constructor(public firestoreService: FirestoreService ) {
    
  }

  ngOnInit(): void {
    this.firestoreService.profiles.subscribe((profilesData) => {
      this.profiles = profilesData
    })
  }

}