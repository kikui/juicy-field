import {Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit} from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { DocumentData } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Profile } from 'src/app/core/models/profile';
import { FirestoreService } from 'src/app/core/services/firestore.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('navbarRef') private navbarRef?: ElementRef<HTMLElement>;
  @Output() ref = new EventEmitter();
  profiles: Array<Profile | DocumentData> = []

  constructor(firestoreService: FirestoreService) {
    firestoreService.profiles.subscribe((profilesData) => {
      this.profiles = profilesData
    })
  }

  ngAfterViewInit() {
    
    this.ref.emit(this.navbarRef);
  }

}