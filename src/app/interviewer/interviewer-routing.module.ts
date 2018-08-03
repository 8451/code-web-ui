import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { AssessmentDetailsComponent } from './assessment-details/assessment-details.component';
import { InterviewAssessmentComponent } from './interview-assessment/interview-assessment.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { QuestionDashboardComponent } from './question-dashboard/question-dashboard.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import { CanActivateAuthguard } from '../services/auth/can-activate.authguard';
import { ServicesModule } from '../services/services.module';
import { InterviewerComponent } from './interviewer/interviewer.component';

const routes: Routes = [
  {
    path: '',
    component: InterviewerComponent,
    canActivate: [CanActivateAuthguard],
    children: [
      {
        path: '',
        redirectTo : 'assessments',
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
      }
    ]
  }
];

@NgModule({
  imports: [
    ServicesModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class InterviewerRoutingModule { }
