import { AlertModule } from './alert/alert.module';
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
import { AlertComponent } from './alert/alert.component';
import { DialogComponent } from './alert/dialog/dialog.component';
import { RegisterComponent } from './register/register/register.component';
import { NewAssessmentDialogComponent } from './interviewer/new-assessment-dialog/new-assessment-dialog.component';
import { ActivateComponent } from './register/activate/activate.component';
import { LoginComponent } from './login/login.component';
import { QuestionInfoDialogComponent } from './interviewer/question-info-dialog/question-info-dialog.component';
import { GatewayComponent } from './gateway/gateway.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { StarRatingModule } from 'angular-star-rating'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ActivateComponent,
    LoginComponent,
    GatewayComponent,
    NotFoundComponent,
    ForgotPasswordComponent
  ],
  imports: [
    AlertModule,
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
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
