import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatListModule,
  MatToolbarModule,
  MatGridListModule,
  MatPaginatorModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatChipsModule,
  MatTooltipModule,
  MatIconModule, MatSidenavModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StarRatingModule } from 'angular-star-rating';
import { AceEditorModule } from 'ng2-ace-editor';
import { AlertModule } from '../alert/alert.module';
import { ServicesModule } from '../services/services.module';
import { AccountComponent } from './account/account.component';
import { AssessmentDetailsComponent } from './assessment-details/assessment-details.component';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { InterviewAssessmentComponent } from './interview-assessment/interview-assessment.component';

import { InterviewerRoutingModule } from './interviewer-routing.module';
import { InterviewerComponent } from './interviewer/interviewer.component';
import { LanguageChipComponent } from './language-chip/language-chip.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { NewAssessmentDialogComponent } from './new-assessment-dialog/new-assessment-dialog.component';
import { QuestionDashboardComponent } from './question-dashboard/question-dashboard.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import { QuestionInfoDialogComponent } from './question-info-dialog/question-info-dialog.component';
import { QuestionListItemComponent } from './question-list-item/question-list-item.component';

@NgModule({
  imports: [
    AlertModule,
    CommonModule,
    InterviewerRoutingModule,
    ServicesModule,
    AceEditorModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatGridListModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatChipsModule,
    MatInputModule,
    MatTooltipModule,
    MatSidenavModule,
    StarRatingModule.forRoot(),
  ],
  declarations: [
    AccountComponent,
    AssessmentDetailsComponent,
    AssessmentListComponent,
    InterviewAssessmentComponent,
    InterviewerComponent,
    LanguageChipComponent,
    ManageUsersComponent,
    NewAssessmentDialogComponent,
    QuestionDashboardComponent,
    QuestionDetailsComponent,
    QuestionInfoDialogComponent,
    QuestionListItemComponent,
  ],
  entryComponents: [
    NewAssessmentDialogComponent,
    QuestionInfoDialogComponent,
  ]
})
export class InterviewerModule { }
