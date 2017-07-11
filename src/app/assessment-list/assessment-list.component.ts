import { AssessmentResponse } from './../domains/assessment-response';
import { AssessmentService } from './../services/assessment/assessment.service';
import { AlertService } from './../services/alert/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdPaginator, PageEvent } from '@angular/material';
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

  totalAssessments = 100;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];

  _pageEvent: PageEvent;

  set pageEvent(pageEvent: PageEvent) {
    this._pageEvent = pageEvent;
    this.getAssessments();
  }

  get pageEvent(): PageEvent {
    return this._pageEvent;
  }

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
    let pageIndex = 0;
    let pageSize = this.pageSize;
    if (this._pageEvent) {
      pageIndex = this.pageEvent.pageIndex;
      pageSize = this.pageEvent.pageSize;
    }

    this.assessmentService.getPageableAssessments(pageIndex, pageSize, 'lastName').subscribe(res => {
      this.setAssessments(res);
    });
  }

  setAssessments(assessmentResponse: AssessmentResponse) {
    this.assessments = assessmentResponse.assessments;
    this.totalAssessments = assessmentResponse.paginationTotalElements;
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
        this.router.navigate(['../interviewAssessment', this.selectedAssessment.interviewGuid], { relativeTo: this.route });
      }, error => {
        this.alertService.error('Unable to start assessment');
      });
  }

  resumeAssessment(assessment: Assessment): void {
    this.alertService.info('Assessment resumed!');
    this.router.navigate(['../interviewAssessment', assessment.interviewGuid], { relativeTo: this.route });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
