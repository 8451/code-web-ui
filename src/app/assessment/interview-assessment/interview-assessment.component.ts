import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AceEditorComponent } from 'ng2-ace-editor/ng2-ace-editor';
import { NewQuestionEvent, AnswerQuestionEvent, EndAssessmentEvent } from './../../domains/events/web-socket-event';
import { AssessmentWebSocketService } from './../../services/assessment-web-socket/assessment-web-socket.service';
import { AlertService } from './../../services/alert/alert.service';
import { QuestionInfoDialogComponent } from './../../question-info-dialog/question-info-dialog.component';
import { MdDialogRef, MdDialog, MdSidenav } from '@angular/material';
import { Question } from './../../domains/question';
import { QuestionService, editorTranslator } from './../../services/question/question.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Assessment, AssessmentStates } from './../../domains/assessment';
import { AssessmentService } from './../../services/assessment/assessment.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-interview-assessment',
  templateUrl: './interview-assessment.component.html',
  styleUrls: ['./interview-assessment.component.scss']
})
export class InterviewAssessmentComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MdSidenav;
  @ViewChild(AceEditorComponent) aceEditor;
  form: FormGroup;
  assessment: Assessment;
  dialogRef: MdDialogRef<any>;
  selectedQuestion: Question;
  sentQuestion: Question;
  languages: string[];
  language: string;
  filteredQuestions = new Subject<Question[]>();
  filteredLanguages: Observable<string[]>;
  questions: Question[];
  questionBody: string;
  mode = 'java';
  editorOptions: any = { showPrintMargin: false, wrap: true };

  assessmentStates: any = AssessmentStates;

  constructor(
    public dialog: MdDialog,
    private formBuilder: FormBuilder,
    private assessmentService: AssessmentService,
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private assessmentWebSocketService: AssessmentWebSocketService
  ) { }

  ngOnInit() {
    this.initializeWebSocket();
    this.questionService.getLanguages().subscribe(languages => {
      this.languages = languages
      this.initForm();
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      language: ['', []],
    });

    this.filteredLanguages = this.form.get('language').valueChanges.startWith(null).map(language => {
      return this.filterLanguages(language);
    });
  }

  initializeWebSocket(): void {
    this.route.params
      .switchMap((params: Params) => {
        return this.assessmentService.getAssessmentByGuid(params['guid']);
      }).subscribe(assessment => {
        this.assessment = assessment;
        if (this.assessment.state === AssessmentStates.CLOSED) {
          this.router.navigate(['/interview/assessments']);
          return;
        }
        if (this.assessment.state !== AssessmentStates.NOTES) {
          document.getElementById('sidenavID').setAttribute('style', 'display: flex');
        }
        this.getQuestions();
        this.getConnectEvent(this.assessment.interviewGuid);
        this.getAnsweredQuestion(this.assessment.interviewGuid);
        this.sendConnectEvent(this.assessment.interviewGuid);
      });
  }

  getAnsweredQuestion(guid: string): void {
    this.assessmentWebSocketService.getAnsweredQuestion(this.assessment.interviewGuid)
      .subscribe(event => {
        this.candidateAnsweredQuestion(event);
      });
  }

  getConnectEvent(guid: string) {
    this.assessmentWebSocketService.getConnectEvent(guid).subscribe(event => {
      this.alertService.info('New user connected');
    });
  }

  sendConnectEvent(guid: string) {
    this.assessmentWebSocketService.sendConnectEvent(guid);
  }

  getQuestions(): void {
    this.questionService.getQuestions().subscribe(questions => {
      this.questions = questions;
      this.filteredQuestions.next(questions);
    },
      error => {
        this.alertService.error('Could not get questions');
      });
  }

  selectQuestion(question: Question): void {
    this.selectedQuestion = question;
  }

  endAssessment(): void {
    const subs = this.alertService.confirmation('Are you sure you want to end the assessment?').subscribe(result => {
      if (subs) {
        subs.unsubscribe();
      }

      if (result) {

        const endEvent = new EndAssessmentEvent();
        endEvent.timestamp = new Date();

        this.assessmentWebSocketService.sendEndAssessment(this.assessment.interviewGuid, endEvent);

        // refresh the current assessment before saving to get all their answers.
        this.assessmentService.getAssessmentByGuid(this.assessment.interviewGuid).subscribe(assessment => {
          this.assessment = assessment;
          this.assessment.state = AssessmentStates.NOTES;
          this.assessmentService.updateAssessment(this.assessment).subscribe(
            res => {
              this.alertService.info('Assessment ended!');
              this.sidenav.close();
            }, error => {
              this.alertService.error('Unable to end assessment');
            });
        });
      }
    });
  }

  saveNotes(notes: string): void {
    this.assessment.notes = notes;
    this.assessment.state = AssessmentStates.CLOSED;
    this.assessmentService.updateAssessment(this.assessment).subscribe(
      res => {
        this.alertService.info('Notes Saved!');
        this.router.navigate(['../interview/assessments'], );
      }, error => {
        this.alertService.error('Unable to save notes');
      });
  }

  previewQuestion(): void {
    this.dialogRef = this.dialog.open(QuestionInfoDialogComponent);
    this.dialogRef.componentInstance.question = this.selectedQuestion;
  }

  sendQuestion(): void {
    const newQuestionEvent: NewQuestionEvent = {
      timestamp: new Date(),
      title: this.selectedQuestion.title,
      language: this.selectedQuestion.language,
      body: this.selectedQuestion.body,
      questionResponseId: null
    };
    this.assessmentWebSocketService.sendNewQuestion(this.assessment.interviewGuid, newQuestionEvent);
    this.sentQuestion = this.selectedQuestion;
    this.questionBody = this.sentQuestion.body;
    this.mode = editorTranslator(this.selectedQuestion.language);
  }

  candidateAnsweredQuestion(event: AnswerQuestionEvent): void {
    this.questionBody = event.answer;
  }

  filterLanguages(val: string): string[] {
    if (this.questions) {
      this.filteredQuestions.next(this.questions.filter(q => {
        return q.language.toLowerCase().indexOf(val.toLowerCase()) === 0 || !val;
      }));
    }

    return val ? this.languages.filter(s => {
      return s.toLowerCase().indexOf(val.toLowerCase()) === 0 || !val;
    }) : this.languages;
  }
}
