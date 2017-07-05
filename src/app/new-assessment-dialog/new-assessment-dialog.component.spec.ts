import { AuthService } from './../services/auth/auth.service';
import { AlertService } from './../services/alert/alert.service';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NewAssessmentDialogComponent } from './new-assessment-dialog.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Headers, Http, BaseRequestOptions, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { MdDialogRef, MdInputModule, MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssessmentService } from './../services/assessment/assessment.service';
import { Assessment, AssessmentStates } from './../domains/assessment';
import { Observable } from 'rxjs/Observable';

class MdDialogRefMock {
  close() { };
}

describe('NewAssessmentDialogComponent', () => {
  let component: NewAssessmentDialogComponent;
  let fixture: ComponentFixture<NewAssessmentDialogComponent>;
  const assessment: Assessment = {
    id: null,
    firstName: 'first',
    lastName: 'lastName',
    email: 'e@mail.com',
    interviewGuid: 'testGuid',
    state: AssessmentStates.NOT_STARTED,
    notes: 'notes'
  };
  const mockAuthService = {
    logout() {},
    getHeaders() {},
    login(username: string, password: string) {},
    isLoggedIn() {},
    getToken() {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, FormsModule, BrowserAnimationsModule, ReactiveFormsModule],
      declarations: [NewAssessmentDialogComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService},
        { provide: MdDialogRef, useClass: MdDialogRefMock },
        AssessmentService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory:
          (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        },
        AlertService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAssessmentDialogComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should be invalid when first name empty', () => {
    const firstName = component.form.get('firstName');
    firstName.setValue('');
    expect(firstName.valid).toBeFalsy();
  });

  it('should send null for interviewGuid', () => {
    const interviewGuid = component.form.get('interviewGuid');
    expect(interviewGuid.value).toBeNull();
  });

  it('should be invalid when last name empty', () => {
    const lastName = component.form.get('lastName');
    lastName.setValue('');
    expect(lastName.valid).toBeFalsy();
  });

  it('should be invalid when email empty', () => {
    const email = component.form.get('email');
    email.setValue('');
    expect(email.valid).toBeFalsy();
  });

  it(`should be invalid when email doesn't contain @`, () => {
    const email = component.form.get('email');
    email.setValue('email');
    expect(email.valid).toBeFalsy();
  });

  it('should be valid when email is valid email address', () => {
    const email = component.form.get('email');
    email.setValue('e@mail.com');
    expect(email.valid).toBeTruthy();
  });

  it('should be valid when first name nonempty', () => {
    const firstName = component.form.get('firstName');
    firstName.setValue('first');
    expect(firstName.valid).toBeTruthy();
  });

  it('should be valid when last name nonempty', () => {
    const lastName = component.form.get('lastName');
    lastName.setValue('last');
    expect(lastName.valid).toBeTruthy();
  });


  it('when createAssessment is called, the assessment service should call createAssessment', () => {
    const service = fixture.debugElement.injector.get(AssessmentService);
    spyOn(service, 'createAssessment').and.returnValue(Observable.of(assessment));
    component.form.setValue(assessment);
    component.createAssessment();
    expect(service.createAssessment).toHaveBeenCalledWith(assessment);
  });

  it('when createAssessment is called with invalid form, the assessment service should not call createAssessment', () => {
    const service = fixture.debugElement.injector.get(AssessmentService);
    spyOn(service, 'createAssessment');
    component.createAssessment();
    expect(service.createAssessment).toHaveBeenCalledTimes(0);
  });

  it('should display a toast when createAssessment throws an error', () => {
    const assessmentService = fixture.debugElement.injector.get(AssessmentService);
    const alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(assessmentService, 'createAssessment').and.returnValue(
      Observable.throw(new Response(new ResponseOptions({ status: 500, body: null }))));
    spyOn(alertService, 'error');

    component.form.setValue(assessment);
    component.createAssessment();
    expect(alertService.error).toHaveBeenCalled();
  });


});
