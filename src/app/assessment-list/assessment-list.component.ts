import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AssessmentService } from './../services/assessment/assessment.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Assessment } from './../domains/assessment';
import { NewAssessmentDialogComponent } from './../new-assessment-dialog/new-assessment-dialog.component';

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss']
})
export class AssessmentListComponent implements OnInit, OnDestroy {

  assessments: Assessment[];
  dialogRef: MdDialogRef<NewAssessmentDialogComponent>;
  subscription: Subscription;
  private selectedAssessment: Assessment;

  constructor(
    public dialog: MdDialog,
    private assessmentService: AssessmentService,
    private router: Router,
    ) { }

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

  selectAssessment(assessment: Assessment): void {
    this.selectedAssessment = assessment;
  }


  updateList(): void {
    this.subscription = this.dialogRef.afterClosed().subscribe(() => {
      this.getAssessments();
    });
  }

  startAssessment(): void {
    this.selectedAssessment.active = true;
    this.assessmentService.updateAssessment(this.selectedAssessment).subscribe(
      res => {
      console.log(res);
    }, error => {
      console.log(error);
    });

    this.router.navigate(['/interviewAssessment', this.selectedAssessment.interviewGuid]);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
