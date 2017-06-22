import { Assessment } from './../../domains/assessment';
import { Observable } from 'rxjs/Observable';
import { TestBed, inject, fakeAsync, async, tick } from '@angular/core/testing';

import { AssessmentService } from './assessment.service';
import { Headers, Http, BaseRequestOptions, XHRBackend, ResponseOptions, Response } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

const mockAssessment = {
  'assessments': [
    {
      'id': 'null',
      'firstName': 'fname',
      'lastName': 'lname',
      'email': 'e@mail.com',
      'interviewGuid': 'testGuid',
      'active': false
    }
  ]
};

const mockError = {
  body: { 'statusText': 'error' },
  status: 500,
  statusText: '500 Internal Server Error'
};

function compareAssessments(response): void {
  expect(response.firstName).toBe(mockAssessment.assessments[0].firstName);
  expect(response.lastName).toBe(mockAssessment.assessments[0].lastName);
  expect(response.email).toBe(mockAssessment.assessments[0].email);
  expect(response.interviewGuid).toBe(mockAssessment.assessments[0].interviewGuid);
  expect(response.active).toBeFalsy();
}


describe('AssessmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentService,
        MockBackend,
        BaseRequestOptions,
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

  it('getAssessments() should return assessment', fakeAsync(inject([Http, MockBackend], (http: Http, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe(connection => {
      const response = new ResponseOptions({ body: mockAssessment });
      connection.mockRespond(new Response(response));
    });
    const assessmentService = new AssessmentService(http);
    assessmentService.getAssessments().subscribe(res => {
      expect(res.length).toBe(1, 'should contain 1 assessment');
      compareAssessments(res[0]);
    });
  })));

  it('createAssessment() should return assessment', fakeAsync(inject([Http, MockBackend], (http: Http, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe(connection => {
      const response = new ResponseOptions({ body: mockAssessment });
      connection.mockRespond(new Response(response));
    });
    const assessmentService = new AssessmentService(http);
    assessmentService.createAssessment(mockAssessment.assessments[0]).subscribe(res => {
      compareAssessments(res);
    });
  })));

  it('getAssessmentByGuid() should update an assessment', fakeAsync(inject([Http, MockBackend], (http: Http, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe(connection => {
      const response = new ResponseOptions({ body: mockAssessment });
      connection.mockRespond(new Response(response));
    });
    const assessmentService = new AssessmentService(http);
    assessmentService.getAssessmentByGuid(mockAssessment.assessments[0].interviewGuid).subscribe(res => {
      compareAssessments(res);
    });
  })));

  it('updateAssessment() should update an assessment', fakeAsync(inject([Http, MockBackend], (http: Http, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe(connection => {
      const response = new ResponseOptions({ body: mockAssessment });
      connection.mockRespond(new Response(response));
    });
    const assessmentService = new AssessmentService(http);
    assessmentService.updateAssessment(mockAssessment.assessments[0]).subscribe(res => {
      compareAssessments(res);
    });
  })));

  it('handleError() should handle any http error', fakeAsync(inject([Http, MockBackend], (http: Http, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe(connection => {
      const response = new ResponseOptions({ body: mockAssessment });
      connection.mockRespond(new Response(response));
    });
    const assessmentService = new AssessmentService(http);
    const errorResponse = new ResponseOptions(mockError);

    assessmentService.handleError(new Response(errorResponse)).subscribe(
      () => { }, error => expect(error).toBe(mockError.statusText));
  })));



});
