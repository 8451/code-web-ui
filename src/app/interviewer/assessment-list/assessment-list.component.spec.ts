import { AssessmentResponse } from '../../domains/assessment-response';
import { AuthService } from '../../services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../services/alert/alert.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { HttpModule, ResponseOptions, Response } from '@angular/http';
import { AssessmentService } from '../../services/assessment/assessment.service';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AssessmentListComponent } from './assessment-list.component';
import {
  MatDialogModule,
  MatCardModule,
  MatDialogRef,
  MatInputModule,
  MatIconModule,
  MatDialog,
  MatDialogConfig,
  MatPaginatorModule,
  PageEvent
} from '@angular/material';

import { OverlayModule, ScrollStrategy} from '@angular/cdk/overlay'

import { Assessment, AssessmentStates } from '../../domains/assessment';
import { NewAssessmentDialogComponent } from '../new-assessment-dialog/new-assessment-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AssessmentListComponent', () => {
  let component: AssessmentListComponent;
  let fixture: ComponentFixture<AssessmentListComponent>;
  const errorResponse = new Response(new ResponseOptions({ status: 500, body: null }));
  const mockRouter = { navigate: jasmine.createSpy('navigate') };
  let assessmentService;
  const assessments: Assessment[] = [{
    id: null,
    firstName: 'first',
    lastName: 'lastName',
    email: 'e@mail.com',
    interviewGuid: 'testGuid',
    modifiedBy: 'Test User',
    modifiedDate: new Date(1),
    state: AssessmentStates.NOT_STARTED,
    notes: 'notes',
    questionAnswers: []
  }];

  const mockPageEvent: PageEvent = {
    pageIndex: 1,
    pageSize: 5,
    length: 15,
  };

  const mockAssesmentResponse: AssessmentResponse = {
    assessments: assessments,
    paginationTotalElements: assessments.length
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentListComponent, NewAssessmentDialogComponent],
      imports: [
        MatDialogModule,
        MatInputModule,
        MatPaginatorModule,
        HttpModule,
        BrowserAnimationsModule,
        MatIconModule
      ],
      providers: [
        AuthService,
        AssessmentService,
        AlertService,
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { url: Observable.of([{ path: 'assessments' }]) } }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [NewAssessmentDialogComponent]
        }
      })
      .overrideComponent(NewAssessmentDialogComponent, {
        set: {
          template: '<span>NewAssessmentDialogComponent</span>',
          providers: []
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentListComponent);
    assessmentService = fixture.debugElement.injector.get(AssessmentService);
    spyOn(assessmentService, 'getAssessments').and.returnValue(Observable.of(assessments));
    spyOn(assessmentService, 'searchAssessments').and.returnValue(Observable.of(mockAssesmentResponse));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should call startAssessment() which sets the selected assessment to AWAIT_EMAIL and navigates to interviewAssessment',
    fakeAsync(() => {
      spyOn(assessmentService, 'updateAssessment').and.returnValue(Observable.of(this.assessments));
      const alertService = fixture.debugElement.injector.get(AlertService);
      spyOn(alertService, 'info');
      spyOn(alertService, 'error');

      component.selectedAssessment = assessments[0];
      component.startAssessment();

      expect(alertService.info).toHaveBeenCalled();
      expect(alertService.error).toHaveBeenCalledTimes(0);
    }));

  it('should call the alertService when starting an assessment fails', fakeAsync(() => {
    spyOn(assessmentService, 'updateAssessment').and.returnValue(Observable.throw(this.errorResponse));
    const alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.selectedAssessment = assessments[0];
    component.startAssessment();

    expect(alertService.info).toHaveBeenCalledTimes(0);
    expect(alertService.error).toHaveBeenCalled();
  }));

  it('should call resumeAssessment() which navigates to interview-assessment', fakeAsync(() => {
    const route = fixture.debugElement.injector.get(ActivatedRoute);
    const alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.resumeAssessment(assessments[0]);

    expect(alertService.info).toHaveBeenCalled();
    expect(alertService.error).toHaveBeenCalledTimes(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['../interview-assessment', assessments[0].interviewGuid],
      { relativeTo: route }
    );
  }));

  it('should call viewAssessment() which navigates to the assessment-details', () => {
    const route = fixture.debugElement.injector.get(ActivatedRoute);
    component.selectedAssessment = assessments[0];
    component.viewAssessment();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['../assessment', assessments[0].interviewGuid], { relativeTo: route });
  });

  it('searchAssessment() should call searchAssessments and navigate to the first page of the results', fakeAsync(() => {
    component.searchAssessment('');
    expect(assessmentService.searchAssessments).toHaveBeenCalled();
    expect(component.paginator.pageIndex).toEqual(0);
  }));

  it('a new page event should navigate to a new page of results', fakeAsync(() => {
    component.searchAssessment('');
    component.pageEvent = mockPageEvent;
    expect(assessmentService.searchAssessments).toHaveBeenCalled();
    expect(component.pageEvent.pageIndex).toEqual(1);
  }));

  it('selectAssessment() should update the selectedAssessment', fakeAsync(() => {
    component.selectAssessment(assessments[0]);
    expect(component.selectedAssessment).toEqual(assessments[0]);
  }));

  it('should call assessmentService.exportCsv() when exportCsv() is called', () => {
    assessmentService = fixture.debugElement.injector.get(AssessmentService);
    spyOn(assessmentService, 'exportCsv');

    component.exportCsv();

    expect(assessmentService.exportCsv).toHaveBeenCalled();
  });
});
