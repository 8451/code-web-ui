import { InterviewerComponent } from './interviewer/interviewer.component';
import { CanActivateAuthguard } from './services/auth/can-activate.authguard';
import { LoginComponent } from './login/login.component';
import { InterviewAssessmentComponent } from './assessment/interview-assessment/interview-assessment.component';
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
    pathMatch: 'full',
    redirectTo: '/interview/assessments'
  },
  {
    path: 'interview',
    component: InterviewerComponent,
    canActivate: [CanActivateAuthguard],
    children: [
      {
        path: '',
        redirectTo: 'assessments',
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
        path: 'interviewAssessment/:guid',
        component: InterviewAssessmentComponent
      },
      {
        path: 'assessments',
        component: AssessmentListComponent
      },
    ]
  },
  {
    path: 'register',
    pathMatch: 'full',
    component: RegisterComponent
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
