import {Component, OnInit} from '@angular/core';
//import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Observable } from 'rxjs';
import { Profile } from 'src/app/core/models/profile';

@Component({
  selector: 'app-profiles-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class ProfilesDetailComponent implements OnInit {
  //private profileDoc: AngularFirestoreDocument<Profile>;
  //profile: Observable<Profile | undefined>

  constructor(private route: ActivatedRoute, /* afs: AngularFirestore */) {
    let pseudo = this.route.snapshot.params['pseudo'];
    console.log(pseudo)
    //this.profileDoc = afs.doc<Profile>(`profiles/${pseudo}`);
    //this.profile = this.profileDoc.valueChanges();
  }

  ngOnInit(): void {
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