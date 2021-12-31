import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Observable } from 'rxjs';
import { Profile } from 'src/app/core/models/profile';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  profiles: Observable<Array<Profile | DocumentData>>

  constructor(private firestore: Firestore) {
    const profilesCollection = collection(this.firestore, 'profiles');
    this.profiles = collectionData(profilesCollection);
  }

}