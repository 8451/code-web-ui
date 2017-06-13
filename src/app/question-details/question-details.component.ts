import { NgForm } from '@angular/forms';
import { MockQuestionService } from './../services/question/mockQuestion.service';
import { Question } from './../domains/question';
import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { QuestionService } from '../services/question/question.service';
import { AlertService } from '../services/alert/alert.service';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.css']
})

export class QuestionDetailsComponent implements OnInit {

  question: Question;
  private id: string;
  isNew: boolean;
  @ViewChild('questionForm') questionForm: NgForm;


  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private alertService: AlertService,
    ) {}

  ngOnInit(): void {

    this.isNew = this.route.snapshot.url[this.route.snapshot.url.length-1].path === 'new';
        
    if(this.isNew) {
      this.question = new Question();
    }
    else {
      this.route.params
        .switchMap((params: Params) => this.questionService.getQuestion(params['id']))
        .subscribe(question => this.question = question);
    }
  }

  navigateBack(): void {
    console.log('navigating back');
    this.router.navigate(['/questions']);
  }

  submitQuestion(): void {
    console.log("Question formatting: ", this.question);
    this.alertService.info('saved!');
    if(this.isNew) {
      this.questionService.createQuestion(this.question).subscribe(res => {
        console.log(res);
        this.router.navigate(['/questions']);
      });
    }
    else {
      this.questionService.updateQuestion(this.question).subscribe(res => {
        console.log(res);
        this.router.navigate(['/questions']);
      });
    }
  }

  deleteQuestion(questionId: string): void {
    console.log('attempting to delete');
    this.questionService.deleteQuestion(this.question.id).subscribe(res => {
      this.router.navigate(['/questions']);
    });
  }

}
