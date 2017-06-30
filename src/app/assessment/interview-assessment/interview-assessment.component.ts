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

  private assessment: Assessment;
  dialogRef: MdDialogRef<QuestionInfoDialogComponent>;
  private selectedQuestion: Question;
  private sentQuestion: Question;
  private questions: Question[];

  constructor(
    public dialog: MdDialog,
    private assessmentService: AssessmentService,
    private questionService: QuestionService,
    private route: ActivatedRoute,
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
        console.error('An error occurred in the question component', error);
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

  sendQuestion(question: Question): void {
    this.sentQuestion = question;
  }
}
