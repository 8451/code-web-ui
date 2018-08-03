import { MatDialog, MatDialogRef } from '@angular/material';
import { Question } from '../../domains/question';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-question-info-dialog',
  templateUrl: './question-info-dialog.component.html',
  styleUrls: ['./question-info-dialog.component.scss']
})
export class QuestionInfoDialogComponent implements OnInit {

  mode = 'java';
  editorOptions: any = {
    showPrintMargin: false,
    wrap: true,
    maxLines: 20,
    highlightActiveLine: false,
    showGutter: false
  };

  question: Question;
  constructor(public dialogRef: MatDialogRef<QuestionInfoDialogComponent>) { }

  ngOnInit() {
  }

}
