import { MdDialogRef } from '@angular/material';
import { Question } from './../domains/question';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-question-info-dialog',
  templateUrl: './question-info-dialog.component.html',
  styleUrls: ['./question-info-dialog.component.scss']
})
export class QuestionInfoDialogComponent implements OnInit {

  question: Question;
  constructor(public dialogRef: MdDialogRef<QuestionInfoDialogComponent>) { }

  ngOnInit() {
  }

}
