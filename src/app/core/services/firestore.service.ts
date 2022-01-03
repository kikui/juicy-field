import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData, collection, doc, setDoc, updateDoc, query, where, getDocs, onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Observable } from 'rxjs';
import { Profile } from 'src/app/core/models/profile';


@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  profiles: Observable<Array<Profile | DocumentData>>

  constructor(private db: Firestore) {
    const profilesCollection = collection(this.db, 'profiles');
    this.profiles = collectionData(profilesCollection);
  }

  getProfile(pseudo: string): Observable<Profile | DocumentData> {
    const profileDoc = doc(this.db, 'profiles', pseudo)
    return docData(profileDoc)
  }

  createProfile(profile: Profile) {
    setDoc(doc(this.db, "profiles", profile.pseudo), profile)
  }

  updateProfile(profile: Profile) {
    updateDoc(doc(this.db, "profiles", profile.pseudo), {
      name: profile.name,
      imageUrl: profile.imageUrl
    })
  }

  updateEstimate(data: any) {
    updateDoc(doc(this.db, "profiles", data.pseudo), {
      investParams: data.investParams,
      partialReinvest: data.partialReinvest,
      displayPanel: data.displayPanel
    })
  }

}