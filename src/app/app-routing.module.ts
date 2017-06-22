import { CanActivateAuthguard } from './services/auth/can-activate.authguard';
import { LoginComponent } from './login/login.component';
import { ActivateComponent } from './register/activate/activate.component';
import { RegisterComponent } from './register/register/register.component';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionDashboardComponent } from './question-dashboard/question-dashboard.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/questions',
    pathMatch: 'full',
    canActivate: [CanActivateAuthguard]
  },
  {
    path: 'questions',
    component: QuestionDashboardComponent,
    canActivate: [CanActivateAuthguard]
  },
  {
    path: 'question/new',
    pathMatch: 'full',
    component: QuestionDetailsComponent,
    canActivate: [CanActivateAuthguard]
  },
  {
    path: 'question/:id',
    component: QuestionDetailsComponent,
    canActivate: [CanActivateAuthguard]
  },
  {
    path: 'register',
    pathMatch: 'full',
    component: RegisterComponent,
    canActivate: [CanActivateAuthguard]
  },
  {
    path: 'assessments',
    component: AssessmentListComponent,
    canActivate: [CanActivateAuthguard]
  },
  {
    path: 'activate',
    component: ActivateComponent,
    pathMatch: 'full',
    canActivate: [CanActivateAuthguard]
  },
  {
    path: 'activate/:guid',
    component: ActivateComponent,
    canActivate: [CanActivateAuthguard]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
