import { AssessmentResponse } from '../../domains/assessment-response';
import { AssessmentService } from '../../services/assessment/assessment.service';
import { AlertService } from '../../alert/alert-service/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, PageEvent } from '@angular/material';
import { Assessment, AssessmentStates } from '../../domains/assessment';
import { NewAssessmentDialogComponent } from '../new-assessment-dialog/new-assessment-dialog.component';

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss']
})
export class AssessmentListComponent implements OnInit, OnDestroy {

  assessments: Assessment[];
  dialogRef: MatDialogRef<NewAssessmentDialogComponent>;
  subscription: Subscription;
  selectedAssessment: Assessment;
  assessmentStates: any = AssessmentStates;
  searchString = '';
  @ViewChild('assessmentPaginator') paginator: MatPaginator;

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
    public dialog: MatDialog,
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
    if (this._pageEvent) {
      pageIndex = this.pageEvent.pageIndex;
      this.pageSize = this.pageEvent.pageSize;
    }

    this.assessmentService.searchAssessments(pageIndex, this.pageSize, 'createdDate', this.searchString).subscribe(res => {
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

  private updateList(): void {
    this.subscription = this.dialogRef.afterClosed().subscribe(res => {
      this.getAssessments();
    });
  }

  startAssessment(): void {
    this.selectedAssessment.state = AssessmentStates.AWAIT_EMAIL;
    this.assessmentService.updateAssessment(this.selectedAssessment).subscribe(
      res => {
        this.alertService.info('Assessment started!');
        this.router.navigate(['../interview-assessment', this.selectedAssessment.interviewGuid], { relativeTo: this.route });
      }, error => {
        this.alertService.error('Unable to start assessment');
      });
  }

  searchAssessment(searchString: string): void {
    this.searchString = searchString;
    let pageSize = this.pageSize;
    if (this._pageEvent) {
      pageSize = this.pageEvent.pageSize;
    }
    this.assessmentService.searchAssessments(0, this.pageSize, 'createdDate', searchString).subscribe(res => {
      this.setAssessments(res);
      this.paginator.pageIndex = 0;
    });
  }

  resumeAssessment(assessment: Assessment): void {
    this.alertService.info('Assessment resumed!');
    this.router.navigate(['../interview-assessment', assessment.interviewGuid], { relativeTo: this.route });
  }

  viewAssessment(): void {
    this.router.navigate(['../assessment', this.selectedAssessment.interviewGuid], { relativeTo: this.route });
  }

  exportCsv(): void {
    this.assessmentService.exportCsv();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
