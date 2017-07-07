import { AssessmentService } from './../services/assessment/assessment.service';
import { AnswerQuestionEvent } from './../domains/events/web-socket-event';
import { AssessmentWebSocketService } from './../services/assessment-web-socket/assessment-web-socket.service';
import { AlertService } from './../services/alert/alert.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AssessmentStates } from 'app/domains/assessment';

@Component({
  selector: 'app-candidate-assessment',
  templateUrl: './candidate-assessment.component.html',
  styleUrls: ['./candidate-assessment.component.scss']
})

export class CandidateAssessmentComponent implements OnInit, OnDestroy {
  form: FormGroup;
  assessmentId: string;
  sub: Subscription;
  questionAnswer: AnswerQuestionEvent;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private assessmentWebSocketService: AssessmentWebSocketService,
    private assessmentService: AssessmentService,
    private router: Router,
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
      this.assessmentService.getAssessmentStateByGuid(this.assessmentId).subscribe(state => {
        if (state.state !== AssessmentStates.IN_PROGRESS) {
          this.router.navigate(['/candidate/thank-you']);
          return;
        }
        this.assessmentWebSocketService.getNewQuestion(this.assessmentId).subscribe(data => {
          this.form.setValue({
            title: data.title,
            body: data.body,
            answer: data.body,
            questionResponseId: data.questionResponseId
          });
        });
        this.assessmentWebSocketService.sendConnectEvent(this.assessmentId);
      });
      this.assessmentWebSocketService.getEndAssessment(this.assessmentId).subscribe(end => {
        this.router.navigate(['/candidate/thank-you']);
      });
    });
  }

  submitAnswer() {
    if (!this.form.valid) {
      return;
    }
    const questionAnswer: AnswerQuestionEvent = this.form.value as AnswerQuestionEvent;

    this.assessmentWebSocketService.answerQuestion(this.assessmentId, questionAnswer);
    this.alertService.info('Question Submitted');
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
