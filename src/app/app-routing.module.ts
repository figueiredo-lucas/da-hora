import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { BalanceComponent } from './components/balance/balance.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobRegisterComponent } from './components/job-register/job-register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SetbackComponent } from './components/setback/setback.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserComponent } from './components/user/user.component';
import { PrivateComponent } from './components/private/private.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';

const redirectUnauth = () => redirectUnauthorizedTo(['/login']);
const redirectAuth = () => redirectLoggedInTo(['/p/balance']);

const routes: Routes = [
  { path: '', redirectTo: 'login', 'pathMatch': 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectAuth } },
  { path: 'register', component: RegisterComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectAuth } },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectAuth } },
  {
    path: 'p',
    component: PrivateComponent,
    children: [
      { path: 'user', component: UserComponent },
      { path: 'balance', component: BalanceComponent },
      { path: 'jobs', component: JobListComponent },
      { path: 'job-detail/:key', component: JobDetailsComponent },
      { path: 'job-register', component: JobRegisterComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'setback', component: SetbackComponent }
    ],
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauth }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
