import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatSlideToggleModule, MatToolbarModule } from '@angular/material';
import { AceEditorModule } from 'ng2-ace-editor';
import { AlertModule } from '../alert/alert.module';
import { ServicesModule } from '../services/services.module';

import { CandidatesRoutingModule } from './candidates-routing.module';
import { CandidateComponent } from './candidate/candidate.component';
import { CandidateAssessmentComponent } from './candidate-assessment/candidate-assessment.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

@NgModule({
  imports: [
    CommonModule,
    CandidatesRoutingModule,
    ServicesModule,
    AceEditorModule,
    MatSlideToggleModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
  ],
  declarations: [
    CandidateComponent,
    CandidateAssessmentComponent,
    ThankYouComponent,
  ]
})

export class CandidatesModule { }
