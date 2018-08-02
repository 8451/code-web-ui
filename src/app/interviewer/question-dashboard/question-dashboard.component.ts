import { AlertService } from '../../alert/alert-service/alert.service';
import { QuestionResponse } from '../../domains/question-response';
import { PageEvent, MatPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionService } from '../../services/question/question.service';
import { Question } from '../../domains/question';


@Component({
  selector: 'app-question-dashboard',
  templateUrl: './question-dashboard.component.html',
  styleUrls: ['./question-dashboard.component.scss']
})
export class QuestionDashboardComponent implements OnInit {

  questions: Question[];
  @ViewChild('questionPaginator') paginator: MatPaginator;

  totalQuestions = 100;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  searchString = '';

  _pageEvent: PageEvent;

  set pageEvent(pageEvent: PageEvent) {
    this._pageEvent = pageEvent;
    this.getQuestions();
  }

  get pageEvent(): PageEvent {
    return this._pageEvent;
  }

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService) { }

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

    this.questionService.searchQuestions(index, pageSize, 'title', this.searchString).subscribe(res => {
      this.setQuestions(res);
    }, error => {
      this.alertService.error('Error getting questions');
    });
  }

  searchQuestion(searchString: string): void {
    this.searchString = searchString;
    this.questionService.searchQuestions(0, this.pageSize, 'title', this.searchString).subscribe(res => {
      this.setQuestions(res);
      this.paginator.pageIndex = 0;
    }, error => {
      this.alertService.error('Error getting questions');
    });
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
