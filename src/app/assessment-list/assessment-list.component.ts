import { Subscription } from 'rxjs/Subscription';
import { AssessmentService } from './../services/assessment/assessment.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Assessment } from './../domains/assessment';
import { NewAssessmentDialogComponent } from './../new-assessment-dialog/new-assessment-dialog.component';

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.css']
})
export class AssessmentListComponent implements OnInit, OnDestroy {

  assessments: Assessment[];
  dialogRef: MdDialogRef<NewAssessmentDialogComponent>;
  subscription: Subscription;

  constructor(public dialog: MdDialog, private assessmentService: AssessmentService) { }

  ngOnInit() {
    this.getAssessments();
  }

  getAssessments() {
    this.assessmentService.getAssessments().subscribe(res => {
      this.assessments = res;
    });
  }

  createAssessment(): void {
    this.dialogRef = this.dialog.open(NewAssessmentDialogComponent);
    this.updateList();
  }

  updateList(): void {
    this.subscription = this.dialogRef.afterClosed().subscribe(() => {
      this.getAssessments();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
