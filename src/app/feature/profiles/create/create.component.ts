import {Component, OnInit} from '@angular/core';
//import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Observable } from 'rxjs';
import { Profile } from 'src/app/core/models/profile';

@Component({
  selector: 'app-profiles-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class ProfilesCreateComponent implements OnInit {

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    
  }

}