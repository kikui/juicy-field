import {Component, OnInit} from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Observable } from 'rxjs';
import { Profile } from 'src/app/core/models/profile';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {
  profiles: Observable<Array<Profile | DocumentData>>

  constructor(firestore: Firestore) {
    const profilesCollection = collection(firestore, 'profiles');
    this.profiles = collectionData(profilesCollection);
    console.log(this.profiles)
  }

  ngOnInit(): void {
  }

}