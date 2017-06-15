import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';

import { Assessment } from './../domains/assessment';
import { NewAssessmentDialogComponent } from './../new-assessment-dialog/new-assessment-dialog.component';

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.css']
})
export class AssessmentListComponent implements OnInit {

  assessments: Assessment[];

  constructor(public dialog: MdDialog) { }

  ngOnInit() {
  }

  createAssessment(): void {
    this.dialog.open(NewAssessmentDialogComponent);
  }

}
