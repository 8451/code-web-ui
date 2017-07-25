import { Subject } from 'rxjs/Subject';
import { AssessmentService } from './../services/assessment/assessment.service';
import { AnswerQuestionEvent } from './../domains/events/web-socket-event';
import { AssessmentWebSocketService } from './../services/assessment-web-socket/assessment-web-socket.service';
import { AlertService } from './../services/alert/alert.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { AssessmentStates } from 'app/domains/assessment';
import { AceEditorComponent } from 'ng2-ace-editor/ng2-ace-editor';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { editorTranslator } from 'app/services/question/question.service';

@Component({
  selector: 'app-candidate-assessment',
  templateUrl: './candidate-assessment.component.html',
  styleUrls: ['./candidate-assessment.component.scss']
})

export class CandidateAssessmentComponent implements OnInit, OnDestroy, AfterViewInit {
  form: FormGroup;
  assessmentId: string;
  sub: Subscription;
  questionAnswer: AnswerQuestionEvent;
  mode = 'java';
  theme = {
    toggle: false,
    name: 'monokai'
  };

  @ViewChild(AceEditorComponent) aceEditor;
  private updatedAnswers: Subject<AnswerQuestionEvent> = new Subject<AnswerQuestionEvent>();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private assessmentWebSocketService: AssessmentWebSocketService,
    private assessmentService: AssessmentService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initForm();
    this.sub = this.route.params.subscribe((params: Params) => {
      this.assessmentId = params['id'];
      this.assessmentService.getAssessmentStateByGuid(this.assessmentId).subscribe(state => {
        if (state.state !== AssessmentStates.IN_PROGRESS) {
          this.router.navigate(['/candidate/thank-you']);
          return;
        }
        this.subscribeToQuestion();
        this.assessmentWebSocketService.sendConnectEvent(this.assessmentId);
      });
      this.assessmentWebSocketService.getEndAssessment(this.assessmentId).subscribe(end => {
        this.router.navigate(['/candidate/thank-you']);
      });
    });

    this.initiateRealtime();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      title: ['', []],
      body: ['', []],
      language: ['', []],
      answer: ['', []],
      questionResponseId: ['', []]
    });
  }

  private subscribeToQuestion() {
    this.assessmentWebSocketService.getNewQuestion(this.assessmentId).subscribe(data => {
      this.form.setValue({
        title: data.title,
        body: data.body,
        language: data.language,
        answer: data.body,
        questionResponseId: data.questionResponseId
      });
      this.mode = editorTranslator(data.language);
    });
  }

  private initiateRealtime() {
    this.updatedAnswers.debounceTime(125)
      .distinctUntilChanged()
      .subscribe(answer => this.sendAnswer());
  }

  answerKeystroke() {
    this.updatedAnswers.next(this.form.value as AnswerQuestionEvent);
  }

  ngAfterViewInit() {
    this.aceEditor.getEditor().setOptions({
      showPrintMargin: false,
      wrap: true
    });
  }

  submitAnswer() {
    this.sendAnswer();
    this.alertService.info('Question Submitted');
  }

  sendAnswer() {
    if (!this.form.valid) {
      console.log('form invalid');
      return;
    }
    const questionAnswer: AnswerQuestionEvent = this.form.value as AnswerQuestionEvent;

    this.assessmentWebSocketService.answerQuestion(this.assessmentId, questionAnswer);
  }

  sendPasteEvent() {
    this.assessmentWebSocketService.sendPasteEvent(this.assessmentId);
  }

  setTheme() {
    this.theme.name = this.theme.toggle ? 'sqlserver' : 'monokai';
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
