import { AlertService } from './../services/alert/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AssessmentService } from './../services/assessment/assessment.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Assessment, AssessmentStates } from './../domains/assessment';
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
  selectedAssessment: Assessment;
  assessmentStates: any = AssessmentStates;

  constructor(
    public dialog: MdDialog,
    private assessmentService: AssessmentService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute
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
    this.selectedAssessment.state = AssessmentStates.AWAIT_EMAIL;
    this.assessmentService.updateAssessment(this.selectedAssessment).subscribe(
      res => {
      this.alertService.info('Assessment started!');
      this.router.navigate(['../interviewAssessment', this.selectedAssessment.interviewGuid], {relativeTo: this.route});
    }, error => {
      this.alertService.error('Unable to start assessment');
    });
  }

  resumeAssessment(assessment: Assessment): void {
    this.alertService.info('Assessment resumed!');
    this.router.navigate(['../interviewAssessment', assessment.interviewGuid], {relativeTo: this.route});
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
