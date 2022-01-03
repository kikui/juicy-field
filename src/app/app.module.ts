import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EstimateComponent } from './feature/estimate/estimate.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ProfilesComponent } from './feature/profiles/profiles.component';
import { ProfilesDetailComponent } from './feature/profiles/detail/detail.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogProfilesCreate } from './feature/profiles/create/create.component';
import { InvestismentComponent } from './feature/investisment/investisment.component';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';  

@NgModule({
  declarations: [
    AppComponent,
    EstimateComponent,
    ProfilesComponent,
    ProfilesDetailComponent,
    NavbarComponent,
    DialogProfilesCreate,
    InvestismentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyAi-jb9u_JJKkvTRQUi0KdGTMCl0KHor_A",
      authDomain: "juicy-field.firebaseapp.com",
      projectId: "juicy-field",
      storageBucket: "juicy-field.appspot.com",
      messagingSenderId: "1047884244545",
      appId: "1:1047884244545:web:85c75921407fa1f4b148c0"
    })),
    provideFirestore(() => getFirestore()),
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
