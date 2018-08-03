import { AceEditorModule } from 'ng2-ace-editor';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../alert/alert-service/alert.service';
import { AuthService } from './../../services/auth/auth.service';
import { AssessmentStates } from 'app/domains/assessment';
import { Observable } from 'rxjs/Observable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, ResponseOptions, Response } from '@angular/http';
import { AssessmentService } from './../../services/assessment/assessment.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDetailsComponent } from './assessment-details.component';
import { LanguageChipComponent } from '../language-chip/language-chip.component';
import { StarRatingModule } from 'angular-star-rating';
import { MatExpansionModule, MatCardModule } from '../../../../node_modules/@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AssessmentDetailsComponent', () => {
  let component: AssessmentDetailsComponent;
  let fixture: ComponentFixture<AssessmentDetailsComponent>;
  let mockRouter = { navigate: jasmine.createSpy('navigate') };
  let alertService: AlertService;
  let assessmentService: AssessmentService;
  const mockAuthService = {
    logout() { }
  };

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
    questionAnswers: [],
    rating: 1,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentDetailsComponent, LanguageChipComponent],
      imports: [
        HttpModule,
        RouterTestingModule,
        MatExpansionModule,
        MatCardModule,
        StarRatingModule.forRoot(),
        BrowserAnimationsModule,
        FormsModule,
        AceEditorModule,
      ],
      providers: [
        AssessmentService,
        { provide: AuthService, useValue: mockAuthService },
        AlertService,
        { provide: ActivatedRoute, useValue: { params: Observable.from([{ 'guid': '1234' }]) } },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
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

  it('should return the correct mode when calling getMode', () => {
    const mode = component.getMode('Python');
    expect(mode).toBe('python');
  });

  it('should update assessment.rating onRatingChange', () => {
    mockAssessment.rating = 1;
    component.assessment = mockAssessment;
    component.onRatingChange({rating: 5});
    expect(component.assessment.rating).toEqual(5);
  });
});
