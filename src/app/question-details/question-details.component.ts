import { MockQuestionService } from './../services/question/mockQuestion.service';
import { Question } from './../domains/question';
import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Params} from '@angular/router';
import { QuestionService } from '../services/question/question.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.css']
})

export class QuestionDetailsComponent implements OnInit {

  question: Question;
  private id: string;

  constructor(
    private questionService: MockQuestionService,
    private route: ActivatedRoute,
    private _location: Location
    ) {}

  ngOnInit(): void {
    this.route.params
    .switchMap((params: Params) => this.questionService.getQuestion(params['id']))
    .subscribe(question => this.question = question);
  }

  navigateBack(): void {
    this._location.back();
  }

  questionSubmit(): void {
    this.questionService.updateQuestion(this.question);
  }

  deleteQuestion(questionId: string): void {
    this.questionService.deleteQuestion(this.question.id);
  }

}
