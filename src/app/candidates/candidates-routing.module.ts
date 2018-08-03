import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CandidateAssessmentComponent} from './candidate-assessment/candidate-assessment.component';
import {ThankYouComponent} from './thank-you/thank-you.component';
import {CandidateComponent} from './candidate/candidate.component';

const routes: Routes = [
  {
    path: '',
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidatesRoutingModule { }
