import { Question } from './../domains/question';
import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { QuestionService } from '../services/question/question.service';
import { AlertService } from '../services/alert/alert.service';
import { FormsModule, ReactiveFormsModule, Validators, NgForm, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.css']
})

export class QuestionDetailsComponent implements OnInit {

  private id: string;
  isNew: boolean;
  form: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private alertService: AlertService,
  ) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      id: [null, [
      ]],
      title: ['', [
        Validators.required,
      ]],
      body: ['', [
        Validators.required
      ]],
      suggestedAnswer: ['', [
      ]],
      difficulty: ['', [
        Validators.required,
        Validators.pattern('^[1-5]$')
      ]],
      createdBy: ['', []],
      createdDate: ['', []],
      modifiedBy: ['', []],
      modifiedDate: ['', []],
    });


    this.route.url.subscribe(segments => this.isNew = segments[segments.length - 1].path === 'new');
    if (!this.isNew) {
      this.route.params
        .switchMap((params: Params) => this.questionService.getQuestion(params['id']))
        .subscribe(question => {
          this.form.setValue({
            id: question.id,
            title: question.title,
            body: question.body,
            suggestedAnswer: question.suggestedAnswer,
            difficulty: question.difficulty,
            createdBy: question.createdBy,
            createdDate: question.createdDate,
            modifiedBy: question.modifiedBy,
            modifiedDate: question.modifiedDate
          });
        });
    }
  }

  navigateBack(): void {
    this.router.navigate(['/questions']);
  }

  submitQuestion(): void {
    if (!this.form.valid) {
      return;
    }
    const question = this.form.value as Question;
    if (this.isNew) {
      this.questionService.createQuestion(question).subscribe(res => {
        this.alertService.info('Question Created!');
        this.router.navigate(['/questions']);
      });
    } else {
      this.questionService.updateQuestion(question).subscribe(res => {
        this.alertService.info('Question Saved!');
        this.router.navigate(['/questions']);
      });
    }
  }

  deleteQuestion(): void {
    const subs = this.alertService.confirmation('Are you sure you want to delete?').subscribe(result => {
      if (subs) {
        subs.unsubscribe();
      }

      if (result) {
        this.questionService.deleteQuestion(this.form.controls['id'].value).subscribe(res => {
            this.router.navigate(['/questions']);
        });
      }
    });
  }

}
