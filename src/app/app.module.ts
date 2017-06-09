import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionDashboardComponent } from './question-dashboard/question-dashboard.component';
import { QuestionListItemComponent } from './question-list-item/question-list-item.component';
import { QuestionService } from './services/question.service';


@NgModule({
  declarations: [
    AppComponent,
    QuestionDashboardComponent,
    QuestionListItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [QuestionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
