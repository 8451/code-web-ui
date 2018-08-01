import { NotFoundComponent } from './public/not-found/not-found.component';
import { GatewayComponent } from './public/gateway/gateway.component';
import { ActivateComponent } from './public/register/activate/activate.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './public/forgot-password/forgot-password.component';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'candidate',
    loadChildren: './candidates/candidates.module#CandidatesModule'
  },
  {
    path: 'interview',
    loadChildren: './interviewer/interviewer.module#InterviewerModule'
  },
  {
    path: 'activate',
    component: ActivateComponent,
    pathMatch: 'full'
  },
  {
    path: 'activate/:guid',
    component: ActivateComponent
  },
  {
    path: 'forgot-password',
    pathMatch: 'full',
    component: ForgotPasswordComponent
  },
  {
    path: 'forgot-password/:guid',
    component: ForgotPasswordComponent
  },
  {
    path: 'login',
    component: GatewayComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
