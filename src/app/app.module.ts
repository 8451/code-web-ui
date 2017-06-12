import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCardModule, MdListModule, MdToolbarModule, MdGridListModule, MdInputModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionDashboardComponent } from './question-dashboard/question-dashboard.component';
import { QuestionListItemComponent } from './question-list-item/question-list-item.component';
import { QuestionService } from './services/question/question.service';
import { MockQuestionService } from './services/question/mockQuestion.service';
import { QuestionDetailsComponent } from './question-details/question-details.component';


@NgModule({
  declarations: [
    AppComponent,
    QuestionDashboardComponent,
    QuestionListItemComponent,
    QuestionDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCardModule,
    MdListModule,
    MdToolbarModule,
    MdGridListModule,
    MdInputModule
  ],
  providers: [QuestionService, MockQuestionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
