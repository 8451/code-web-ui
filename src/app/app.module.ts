import { ServicesModule } from './services/services.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatListModule,
  MatToolbarModule,
  MatGridListModule,
  MatInputModule,
  MatSnackBarModule,
  MatDialogModule,
  MatIconModule,
  MatSidenavModule,
  MatAutocompleteModule,
  MatPaginatorModule,
  MatExpansionModule,
  MatChipsModule,
  MatSlideToggleModule,
  MatTooltipModule,
} from '@angular/material';
import { AceEditorModule } from 'ng2-ace-editor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionDashboardComponent } from './question-dashboard/question-dashboard.component';
import { QuestionListItemComponent } from './question-list-item/question-list-item.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import { AlertComponent } from './alert/alert.component';
import { DialogComponent } from './alert/dialog/dialog.component';
import { RegisterComponent } from './register/register/register.component';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { NewAssessmentDialogComponent } from './new-assessment-dialog/new-assessment-dialog.component';
import { ActivateComponent } from './register/activate/activate.component';
import { LoginComponent } from './login/login.component';
import { InterviewAssessmentComponent } from './assessment/interview-assessment/interview-assessment.component';
import { InterviewerComponent } from './interviewer/interviewer.component';
import { QuestionInfoDialogComponent } from './question-info-dialog/question-info-dialog.component';
import { AccountComponent } from './account/account.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AssessmentDetailsComponent } from './assessment/assessment-details/assessment-details.component';
import { LanguageChipComponent } from './language-chip/language-chip.component';
import { GatewayComponent } from './gateway/gateway.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { StarRatingModule } from 'angular-star-rating'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    AssessmentListComponent,
    NewAssessmentDialogComponent,
    QuestionDashboardComponent,
    QuestionListItemComponent,
    QuestionDetailsComponent,
    AlertComponent,
    DialogComponent,
    RegisterComponent,
    ActivateComponent,
    LoginComponent,
    InterviewAssessmentComponent,
    InterviewerComponent,
    QuestionInfoDialogComponent,
    AccountComponent,
    ManageUsersComponent,
    AssessmentDetailsComponent,
    LanguageChipComponent,
    GatewayComponent,
    NotFoundComponent,
    ForgotPasswordComponent
  ],
  imports: [
    ServicesModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    MatGridListModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSidenavModule,
    AceEditorModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    StarRatingModule.forRoot(),
  ],
  entryComponents: [
    DialogComponent,
    AlertComponent,
    NewAssessmentDialogComponent,
    QuestionInfoDialogComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
