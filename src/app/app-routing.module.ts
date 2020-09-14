import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BalanceComponent } from './components/balance/balance.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobRegisterComponent } from './components/job-register/job-register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SetbackComponent } from './components/setback/setback.component';


const routes: Routes = [
  { path: '', redirectTo: 'balance', 'pathMatch': 'full' },
  { path: 'balance', component: BalanceComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'job-register', component: JobRegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'setback', component: SetbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
