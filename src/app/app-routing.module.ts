import { NotFoundComponent } from './not-found/not-found.component';
import { GatewayComponent } from './gateway/gateway.component';
import { AccountComponent } from './account/account.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AssessmentDetailsComponent } from './assessment/assessment-details/assessment-details.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { CandidateAssessmentComponent } from './candidate-assessment/candidate-assessment.component';
import { CandidateComponent } from './candidate/candidate.component';
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
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'candidate',
    component: CandidateComponent,
    children: [
      {
        path: 'thank-you',
        component: ThankYouComponent,
      },
      {
        path: ':id',
        component: CandidateAssessmentComponent
      },
    ]
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
        path: 'interview-assessment/:guid',
        component: InterviewAssessmentComponent
      },
      {
        path: 'assessments',
        component: AssessmentListComponent
      },
      {
        path: 'assessment/:guid',
        component: AssessmentDetailsComponent
      },
      {
        path: 'account',
        component: AccountComponent
      },
      {
        path: 'users',
        component: ManageUsersComponent
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
