import { NewQuestionEvent } from './../../domains/events/web-socket-event';
import { AssessmentWebSocketService } from './../../services/assessment-web-socket/assessment-web-socket.service';
import { AlertService } from './../../services/alert/alert.service';
import { QuestionInfoDialogComponent } from './../../question-info-dialog/question-info-dialog.component';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Question } from './../../domains/question';
import { QuestionService } from './../../services/question/question.service';

import { Assessment } from './../../domains/assessment';
import { AssessmentService } from './../../services/assessment/assessment.service';
import { ActivatedRoute, Params } from '@angular/router';
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
    private route: ActivatedRoute,
    private alertService: AlertService,
    private assessmentWebSocketService: AssessmentWebSocketService
    ) { }

  ngOnInit() {
    this.getQuestions();

    this.route.params
      .switchMap((params: Params) => this.assessmentService.getAssessmentByGuid(params['guid']))
      .subscribe(assessment => {
        this.assessment = assessment;
      });
  }

  getQuestions(): void {
    this.questionService.getQuestions().subscribe(
      questions => this.questions = questions,
      error => {
        this.alertService.error('Could not get questions');
      }
    );
  }

  selectQuestion(question: Question): void {
    this.selectedQuestion = question;
  }

  previewQuestion(): void {
    this.dialogRef = this.dialog.open(QuestionInfoDialogComponent);
    this.dialogRef.componentInstance.question = this.selectedQuestion;
  }

  sendQuestion(): void {
    const newQuestionEvent: NewQuestionEvent = {
      timestamp: new Date(),
      title: this.selectedQuestion.title,
      body: this.selectedQuestion.body,
      questionResponseId: null
    }
    this.assessmentWebSocketService.sendNewQuestion(this.assessment.interviewGuid, newQuestionEvent);
    this.sentQuestion = this.selectedQuestion;
  }
}
