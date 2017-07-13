import { AlertService } from './../../services/alert/alert.service';
import { AuthService } from './../../services/auth/auth.service';
import { AssessmentStates } from 'app/domains/assessment';
import { Observable } from 'rxjs/Observable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, ResponseOptions, Response } from '@angular/http';
import { AssessmentService } from './../../services/assessment/assessment.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDetailsComponent } from './assessment-details.component';

fdescribe('AssessmentDetailsComponent', () => {
  let component: AssessmentDetailsComponent;
  let fixture: ComponentFixture<AssessmentDetailsComponent>;
  let mockRouter = { navigate: jasmine.createSpy('navigate') };
  let alertService: AlertService ;
  let assessmentService: AssessmentService;

  const mockAssessment = {
    id: 'test',
    firstName: 'first',
    lastName: 'lastName',
    email: 'e@mail.com',
    interviewGuid: 'testGuid',
    modifiedBy: 'Test User',
    modifiedDate: new Date(1),
    state: AssessmentStates.NOTES,
    notes: 'notes',
    questionAnswers: []
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentDetailsComponent],
      imports: [
        HttpModule,
        RouterTestingModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        AssessmentService,
        AuthService,
        AlertService,
        { provide: ActivatedRoute, useValue: { params: Observable.from([{ 'guid': '1234' }]) } },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentDetailsComponent);
    component = fixture.componentInstance;
    assessmentService = fixture.debugElement.injector.get(AssessmentService);
    alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(assessmentService, 'getAssessmentByGuid').and.returnValue(Observable.of(mockAssessment));
    fixture.detectChanges();
  });

  afterEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the assessment if the assessment exists and has a CLOSED or NOTES status', async(() => {
    component.populateAssessment();
    expect(component.assessment).toBe(mockAssessment);
  }));

  it('should navigate away if the assessment exists and does not have a CLOSED or NOTES status', async(() => {
    mockAssessment.state = AssessmentStates.NOT_STARTED;
    component.populateAssessment();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/interview/assessments']);
  }));

  it('should call updateAssessment and display a toast', async(() => {
    spyOn(assessmentService, 'updateAssessment').and.returnValue(Observable.of(mockAssessment));
    spyOn(alertService, 'info');

    component.assessment = mockAssessment;
    component.saveAssessment();

    expect(assessmentService.updateAssessment).toHaveBeenCalled();
    expect(alertService.info).toHaveBeenCalled();
  }));

  it('should display a toast if an error occurs when updating assessment', async(() => {
    spyOn(assessmentService, 'updateAssessment').and.returnValue(
      Observable.throw(new Response(new ResponseOptions({ status: 500, body: null })))
    );
    spyOn(alertService, 'error');

    component.assessment = mockAssessment;
    component.saveAssessment();

    expect(alertService.error).toHaveBeenCalled();
  }));
});
