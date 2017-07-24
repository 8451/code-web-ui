import { AuthService } from './../auth/auth.service';
import { Assessment, AssessmentStates } from './../../domains/assessment';
import { Observable } from 'rxjs/Observable';
import { TestBed, inject, fakeAsync, async, tick } from '@angular/core/testing';

import { AssessmentService } from './assessment.service';
import { Headers, Http, BaseRequestOptions, XHRBackend, ResponseOptions, Response, URLSearchParams } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

const mockAssessment = {
  'assessments': [
    {
      'id': 'null',
      'firstName': 'fname',
      'lastName': 'lname',
      'email': 'e@mail.com',
      'interviewGuid': 'testGuid',
      'state': AssessmentStates.NOT_STARTED,
      'notes': 'notes',
      'modifiedBy': 'Test User',
      'modifiedDate': new Date(1),
      'questionAnswers': []
    }
  ]
};

const mockAssessmentResponse = {
  assessments: [
    {
      'id': 'null',
      'firstName': 'fname',
      'lastName': 'lname',
      'email': 'e@mail.com',
      'interviewGuid': 'testGuid',
      'state': AssessmentStates.NOT_STARTED,
      'notes': 'notes',
      'modifiedBy': 'Test User',
      'modifiedDate': new Date(1),
      'questionAnswers': []
    }
  ],
  paginationTotalElements: 1
};

const mockError = {
  body: { 'statusText': 'error' },
  status: 500,
  statusText: '500 Internal Server Error'
};

const mockAuthService = {
  logout() { },
  getHeaders() { },
  login(username: string, password: string) { },
  isLoggedIn() { },
  getToken() { }
};

function compareAssessments(response): void {
  expect(response.firstName).toBe(mockAssessment.assessments[0].firstName);
  expect(response.lastName).toBe(mockAssessment.assessments[0].lastName);
  expect(response.email).toBe(mockAssessment.assessments[0].email);
  expect(response.interviewGuid).toBe(mockAssessment.assessments[0].interviewGuid);
  expect(response.state).toBe(mockAssessment.assessments[0].state);
}


describe('AssessmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentService,
        MockBackend,
        BaseRequestOptions,
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory:
          (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        }]
    });
  });

  it('should be created', inject([AssessmentService], (service: AssessmentService) => {
    expect(service).toBeTruthy();
  }));

  it('getAssessments() should return assessment', fakeAsync(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockAssessment });
        connection.mockRespond(new Response(response));
      });
      const assessmentService = new AssessmentService(http, authService);
      assessmentService.getAssessments().subscribe(res => {
        expect(res.length).toBe(1, 'should contain 1 assessment');
        compareAssessments(res[0]);
      });
    })));

  it('getPageableAssessments() should return an assesment-response', fakeAsync(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockAssessmentResponse });
        connection.mockRespond(new Response(response));
      });
      const assessmentService = new AssessmentService(http, authService);
      assessmentService.getPageableAssessments(0, 20, 'lastName').subscribe(res => {
        expect(res.assessments.length).toBe(1, 'should contain 1 assessment');
        expect(res.paginationTotalElements).toBe(1, 'should have 1 element total');
        compareAssessments(res.assessments[0]);
      });
    })));

  it('searchAssessments() should return an assesment-response', fakeAsync(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockAssessmentResponse });
        connection.mockRespond(new Response(response));
      });
      const assessmentService = new AssessmentService(http, authService);
      assessmentService.searchAssessments(0, 20, 'lastName', 'keyword').subscribe(res => {
        expect(res.assessments.length).toBe(mockAssessmentResponse.assessments.length, 'should contain 1 assessment');
        expect(res.paginationTotalElements).toBe(mockAssessmentResponse.paginationTotalElements, 'should have 1 element total');
        compareAssessments(res.assessments[0]);
      });
    })));

  it('createAssessment() should return assessment', fakeAsync(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockAssessment });
        connection.mockRespond(new Response(response));
      });
      const assessmentService = new AssessmentService(http, authService);
      assessmentService.createAssessment(mockAssessment.assessments[0]).subscribe(res => {
        compareAssessments(res);
      });
    })));

  it('getAssessmentByGuid() should update an assessment', fakeAsync(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockAssessment });
        connection.mockRespond(new Response(response));
      });
      const assessmentService = new AssessmentService(http, authService);
      assessmentService.getAssessmentByGuid(mockAssessment.assessments[0].interviewGuid).subscribe(res => {
        compareAssessments(res);
      });
    })));

  it('updateAssessment() should update an assessment', fakeAsync(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockAssessment });
        connection.mockRespond(new Response(response));
      });
      const assessmentService = new AssessmentService(http, authService);
      assessmentService.updateAssessment(mockAssessment.assessments[0]).subscribe(res => {
        compareAssessments(res);
      });
    })));

  it('handleError() should handle any http error', fakeAsync(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockAssessment });
        connection.mockRespond(new Response(response));
      });
      const assessmentService = new AssessmentService(http, authService);
      const errorResponse = new ResponseOptions(mockError);

      assessmentService.handleError(new Response(errorResponse)).subscribe(
        () => { }, error => expect(error).toBe(mockError.statusText));
    })));



});
