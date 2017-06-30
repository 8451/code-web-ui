import { AlertService } from './../services/alert/alert.service';
import { ActivatedRoute, Params } from '@angular/router';
import { QuestionAnswer } from './../domains/question-answer';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-candidate-assessment',
  templateUrl: './candidate-assessment.component.html',
  styleUrls: ['./candidate-assessment.component.scss']
})

export class CandidateAssessmentComponent implements OnInit, OnDestroy {
  form: FormGroup;
  assessmentId: string;
  sub: Subscription;
  questionAnswer: QuestionAnswer;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', []],
      body: ['', [
      ]],
      answer: ['', []],
      questionResponseId: ['', []]
    });

    this.sub = this.route.params.subscribe((params: Params) => {
      this.assessmentId = params['id'];
    });

    this.form.controls['answer'].setValue('This is a test answer.');

    // TODO subscribe to the websocket endpoint to get the QuestionAnswer
    // TODO initialize the form with the QuestionAnswer
  }

  submitAnswer() {
    if (!this.form.valid) {
      return;
    }
    const questionAnswer: QuestionAnswer = this.form.value as QuestionAnswer;

    // TODO submit the question to the websocket
    this.alertService.info('Question Submitted');
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
