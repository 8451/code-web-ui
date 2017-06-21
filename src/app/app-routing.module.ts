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
    pathMatch: 'full'
  },
  {
    path: 'questions',
    component: QuestionDashboardComponent
  },
  {
    path: 'question/new',
    pathMatch: 'full',
    component: QuestionDetailsComponent
  },
  {
    path: 'question/:id',
    component: QuestionDetailsComponent
  },
  {
    path: 'register',
    pathMatch: 'full',
    component: RegisterComponent
  },
  {
    path: 'assessments',
    component: AssessmentListComponent
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
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
