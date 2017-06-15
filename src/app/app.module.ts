import { AssessmentService } from './services/assessment/assessment.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { NewAssessmentDialogComponent } from './new-assessment-dialog/new-assessment-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AssessmentListComponent,
    NewAssessmentDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    NewAssessmentDialogComponent
  ],
  providers: [AssessmentService],
  bootstrap: [AssessmentListComponent]
})
export class AppModule { }
