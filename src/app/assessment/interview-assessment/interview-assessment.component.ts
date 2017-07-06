import { NewQuestionEvent } from './../../domains/events/web-socket-event';
import { AssessmentWebSocketService } from './../../services/assessment-web-socket/assessment-web-socket.service';
import { AlertService } from './../../services/alert/alert.service';
import { QuestionInfoDialogComponent } from './../../question-info-dialog/question-info-dialog.component';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Question } from './../../domains/question';
import { QuestionService } from './../../services/question/question.service';

import { Assessment, AssessmentStates } from './../../domains/assessment';
import { AssessmentService } from './../../services/assessment/assessment.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-interview-assessment',
  templateUrl: './interview-assessment.component.html',
  styleUrls: ['./interview-assessment.component.scss']
})
export class InterviewAssessmentComponent implements OnInit {

  assessment: Assessment;
  dialogRef: MdDialogRef<QuestionInfoDialogComponent>;
  selectedQuestion: Question;
  sentQuestion: Question;
  questions: Question[];
  currentlyAwaitingAnswer = false;
  assessmentStates: any = AssessmentStates;

  constructor(
    public dialog: MdDialog,
    private assessmentService: AssessmentService,
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private assessmentWebSocketService: AssessmentWebSocketService
  ) { }

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions(): void {
    this.questionService.getQuestions().subscribe(questions => {
      this.route.params.switchMap((params: Params) =>
        this.assessmentService.getAssessmentByGuid(params['guid'])).subscribe(assessment => {
          this.assessment = assessment;
          this.assessmentWebSocketService.getAnsweredQuestion(this.assessment.interviewGuid).subscribe(event => {
            this.alertService.info('Candidate submitted answer');
            this.currentlyAwaitingAnswer = true;
          });
        });
      this.questions = questions;
    },
      error => {
        this.alertService.error('Could not get questions');
      }
    );
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
        this.assessment.state = AssessmentStates.NOTES;
        this.assessmentService.updateAssessment(this.assessment).subscribe(
          res => {
            this.alertService.info('Assessment ended!');
          }, error => {
            this.alertService.error('Unable to end assessment');
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
    if (this.currentlyAwaitingAnswer) {
      this.alertService.error('Candidate is currently answering question');
      return;
    }
    const newQuestionEvent: NewQuestionEvent = {
      timestamp: new Date(),
      title: this.selectedQuestion.title,
      body: this.selectedQuestion.body,
      questionResponseId: null
    };
    this.currentlyAwaitingAnswer = true;
    this.assessmentWebSocketService.sendNewQuestion(this.assessment.interviewGuid, newQuestionEvent);
    this.sentQuestion = this.selectedQuestion;
  }
}
