import { AuthService } from './../services/auth/auth.service';
import { Router } from '@angular/router';
import { AlertService } from './../services/alert/alert.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { HttpModule, ResponseOptions, Response } from '@angular/http';
import { AssessmentService } from './../services/assessment/assessment.service';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AssessmentListComponent } from './assessment-list.component';
import { MdDialogModule, MdCardModule, MaterialModule, MdDialogRef,
          MdInputModule, MdDialog, OverlayRef,  MdDialogContainer } from '@angular/material';

import { Assessment } from './../domains/assessment';
import { NewAssessmentDialogComponent } from './../new-assessment-dialog/new-assessment-dialog.component';


describe('AssessmentListComponent', () => {
  let component: AssessmentListComponent;
  let fixture: ComponentFixture<AssessmentListComponent>;
  const errorResponse = new Response(new ResponseOptions({status: 500, body: null}));
  const mockRouter = { navigate: jasmine.createSpy('navigate') };
  const assessments: Assessment[] = [{
    id: null,
    firstName: 'first',
    lastName: 'lastName',
    email: 'e@mail.com',
    interviewGuid: 'testGuid',
    active: false
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentListComponent, NewAssessmentDialogComponent ],
      imports: [MdCardModule, MdDialogModule, HttpModule, BrowserAnimationsModule ],
      providers: [AuthService, AssessmentService, MdDialog, AlertService, FormBuilder, { provide: Router, useValue: mockRouter } ]
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
    spyOn(assessmentService, 'getAssessments').and.returnValue(Observable.of(this.assesments));
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

  it('should call startAssessment() which sets the selected assessment to active and navigates to interviewAssessment', fakeAsync(() => {
    const assessmentService = fixture.debugElement.injector.get(AssessmentService);
    spyOn(assessmentService, 'updateAssessment').and.returnValue(Observable.of(this.assesments));
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
});
