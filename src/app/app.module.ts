import { AssessmentWebSocketService } from './services/assessment-web-socket/assessment-web-socket.service';
import { CanActivateAuthguard } from './services/auth/can-activate.authguard';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { AssessmentService } from './services/assessment/assessment.service';
import { StompService } from 'ng2-stomp-service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule,
  MdCardModule,
  MdListModule,
  MdToolbarModule,
  MdGridListModule,
  MdInputModule,
  MdSnackBarModule,
  MdDialogModule,
  MdIconModule,
  MdSidenavModule,
  MdAutocompleteModule,
  MdPaginatorModule,
  MdExpansionModule,
  MdChipsModule
} from '@angular/material';
import { AceEditorModule } from 'ng2-ace-editor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionDashboardComponent } from './question-dashboard/question-dashboard.component';
import { QuestionListItemComponent } from './question-list-item/question-list-item.component';
import { QuestionService } from './services/question/question.service';
import { AlertService } from './services/alert/alert.service';
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
import { CandidateComponent } from './candidate/candidate.component';
import { CandidateAssessmentComponent } from './candidate-assessment/candidate-assessment.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { AccountComponent } from './account/account.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AssessmentDetailsComponent } from './assessment/assessment-details/assessment-details.component';
import { LanguageChipComponent } from './language-chip/language-chip.component';

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
    CandidateComponent,
    CandidateAssessmentComponent,
    ThankYouComponent,
    AccountComponent,
    ManageUsersComponent,
    AssessmentDetailsComponent,
    LanguageChipComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCardModule,
    MdListModule,
    MdToolbarModule,
    MdGridListModule,
    MdInputModule,
    MdSnackBarModule,
    MdDialogModule,
    ReactiveFormsModule,
    MdIconModule,
    MdSidenavModule,
    AceEditorModule,
    MdPaginatorModule,
    MdAutocompleteModule,
    MdExpansionModule,
    MdChipsModule
  ],
  entryComponents: [
    DialogComponent,
    AlertComponent,
    NewAssessmentDialogComponent,
    QuestionInfoDialogComponent,
  ],
  providers: [AlertService,
    QuestionService,
    AssessmentService,
    UserService,
    AuthService,
    AssessmentWebSocketService,
    CanActivateAuthguard,
    StompService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
