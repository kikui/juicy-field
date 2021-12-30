import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstimateComponent } from './feature/estimate/estimate.component';
import { ProfilesDetailComponent } from './feature/profiles/detail/detail.component';
import { ProfilesComponent } from './feature/profiles/profiles.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'estimation' },
  { path: 'estimation', component: EstimateComponent },
  { path: 'profiles', component: ProfilesComponent },
  { path: 'profiles/:pseudo', component: ProfilesDetailComponent },
  { path: '**', pathMatch: 'full', redirectTo: '/estimation' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
