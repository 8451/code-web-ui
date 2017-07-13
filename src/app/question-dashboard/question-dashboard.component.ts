import { QuestionResponse } from './../domains/question-response';
import { PageEvent } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question/question.service';
import { Question } from '../domains/question';


@Component({
  selector: 'app-question-dashboard',
  templateUrl: './question-dashboard.component.html',
  styleUrls: ['./question-dashboard.component.scss']
})
export class QuestionDashboardComponent implements OnInit {

  questions: Question[];

  totalQuestions = 100;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];

  // MdPaginator Output
  _pageEvent: PageEvent;

  set pageEvent(pageEvent: PageEvent) {
    this._pageEvent = pageEvent;
    this.getQuestions();
  }

  get pageEvent(): PageEvent {
    return this._pageEvent;
  }

  constructor(private questionService: QuestionService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions(): void {
    let index = 0;
    let pageSize = 10;
    if (this._pageEvent) {
      index = this.pageEvent.pageIndex;
      pageSize = this.pageEvent.pageSize;
    }

    this.questionService.
        getPageableQuestions(index, pageSize, 'title')
        .subscribe(
          res => this.setQuestions(res),
          error => console.error('error getting questions.')
        );
  }

  setQuestions(questionResponse: QuestionResponse): void {
    this.questions = questionResponse.questions;
    this.totalQuestions = questionResponse.paginationTotalElements;
  }

  goToAddQuestion(): void {
    this.router.navigate(['../question/new'], { relativeTo: this.route });
  }

  goToQuestionDetails(question: Question): void {
    this.router.navigate(['../question', question.id], { relativeTo: this.route });
  }

}
