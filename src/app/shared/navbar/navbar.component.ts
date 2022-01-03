import { Component } from '@angular/core';
import { DocumentData } from '@firebase/firestore';
import { Profile } from 'src/app/core/models/profile';
import { FirestoreService } from 'src/app/core/services/firestore.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  profiles: Array<Profile | DocumentData> = []

  constructor(firestoreService: FirestoreService) {
    firestoreService.profiles.subscribe((profilesData) => {
      this.profiles = profilesData
    })
  }

}