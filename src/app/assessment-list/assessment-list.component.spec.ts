import { AssessmentResponse } from './../domains/assessment-response';
import { AuthService } from './../services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from './../services/alert/alert.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { HttpModule, ResponseOptions, Response } from '@angular/http';
import { AssessmentService } from './../services/assessment/assessment.service';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AssessmentListComponent } from './assessment-list.component';
import {
  MdDialogModule, MdCardModule, MaterialModule, MdDialogRef,
  MdInputModule, MdDialog, OverlayRef, MdDialogContainer
} from '@angular/material';

import { Assessment, AssessmentStates } from './../domains/assessment';
import { NewAssessmentDialogComponent } from './../new-assessment-dialog/new-assessment-dialog.component';


describe('AssessmentListComponent', () => {
  let component: AssessmentListComponent;
  let fixture: ComponentFixture<AssessmentListComponent>;
  const errorResponse = new Response(new ResponseOptions({ status: 500, body: null }));
  const mockRouter = { navigate: jasmine.createSpy('navigate') };
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

  const mockAssesmentResponse: AssessmentResponse = {
    assessments: this.assessments,
    paginationTotalElements: this.assessments.length
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentListComponent, NewAssessmentDialogComponent],
      imports: [MaterialModule, MdCardModule, MdDialogModule, HttpModule, BrowserAnimationsModule],
      providers: [AuthService, AssessmentService, MdDialog, AlertService, FormBuilder, { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { url: Observable.of([{ path: 'assessments' }]) } }]
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
    const assessmentService = fixture.debugElement.injector.get(AssessmentService);
    spyOn(assessmentService, 'getAssessments').and.returnValue(Observable.of(this.assessments));
    spyOn(assessmentService, 'getPageableAssessments').and.returnValue(Observable.of(this.assessments));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should open a dialog when create assessment is called', fakeAsync(() => {
    spyOn(component, 'updateList');
    component.createAssessment();
    fixture.detectChanges();
    tick();
    expect(component.updateList).toHaveBeenCalled();
  }));

  it('should call createAssessment when the button is clicked', () => {
    const button = fixture.debugElement.nativeElement.querySelector('button');
    spyOn(component, 'createAssessment');
    button.click();
    expect(component.createAssessment).toHaveBeenCalled();
  });

  it('should call startAssessment() which sets the selected assessment to AWAIT_EMAIL and navigates to interviewAssessment',
   fakeAsync(() => {
    const assessmentService = fixture.debugElement.injector.get(AssessmentService);
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
    const assessmentService = fixture.debugElement.injector.get(AssessmentService);
    spyOn(assessmentService, 'updateAssessment').and.returnValue(Observable.throw(this.errorResponse));
    const alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.selectedAssessment = assessments[0];
    component.startAssessment();

    expect(alertService.info).toHaveBeenCalledTimes(0);
    expect(alertService.error).toHaveBeenCalled();
  }));

  it('should call resumeAssessment() which navigates to interviewAssessment', fakeAsync(() => {
    const route = fixture.debugElement.injector.get(ActivatedRoute);
    const alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.resumeAssessment(assessments[0]);

    expect(alertService.info).toHaveBeenCalled();
    expect(alertService.error).toHaveBeenCalledTimes(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['../interviewAssessment', assessments[0].interviewGuid],
      { relativeTo: route }
    );
  }));
});
