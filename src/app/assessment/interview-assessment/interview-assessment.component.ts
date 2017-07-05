import { NewQuestionEvent } from './../../domains/events/web-socket-event';
import { AssessmentWebSocketService } from './../../services/assessment-web-socket/assessment-web-socket.service';
import { AlertService } from './../../services/alert/alert.service';
import { QuestionInfoDialogComponent } from './../../question-info-dialog/question-info-dialog.component';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Question } from './../../domains/question';
import { QuestionService } from './../../services/question/question.service';

import { Assessment } from './../../domains/assessment';
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

  constructor(
    public dialog: MdDialog,
    private assessmentService: AssessmentService,
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    // private assessmentWebSocketSerivce: AssessmentWebSocketService
  ) { }

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions(): void {
    this.questionService.getQuestions().subscribe(questions => {
      this.route.params
        .switchMap((params: Params) => this.assessmentService.getAssessmentByGuid(params['guid']))
        .subscribe(assessment => {
          this.assessment = assessment;
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
        // TODO
        // Change state to NOTES
        this.assessment.active = false;
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
    // this.assessment.notes = notes;
    // TODO
    // Change state to CLOSED
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
    // const newQuestionEvent: NewQuestionEvent = {
    //   timestamp: new Date(),
    //   title: this.selectedQuestion.title,
    //   body: this.selectedQuestion.body,
    //   questionResponseId: null
    // }
    // this.assessmentWebSocketSerivce.sendNewQueston(this.assessment.interviewGuid, newQuestionEvent);
    this.sentQuestion = this.selectedQuestion;
  }
}
