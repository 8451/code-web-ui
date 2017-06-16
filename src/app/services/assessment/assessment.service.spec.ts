import { TestBed, inject, fakeAsync } from '@angular/core/testing';

import { AssessmentService } from './assessment.service';
import { Headers, Http, BaseRequestOptions, XHRBackend, ResponseOptions, Response } from '@angular/http';
import { MockBackend} from '@angular/http/testing';

const mockAssessment = {
  'assessments': [
    {
      'firstName': 'fname',
      'lastName': 'lname',
      'email': 'e@mail.com'
    }
  ]
};

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
      const response = new ResponseOptions({body: mockAssessment });
      connection.mockRespond(new Response(response));
    });
    const assessmentService = new AssessmentService(http);
    assessmentService.getAssessments().subscribe(res => {
      expect(res.length).toBe(1, 'should contain 1 assessment');
      expect(res[0].firstName).toBe('fname');
      expect(res[0].lastName).toBe('lname');
      expect(res[0].email).toBe('e@mail.com');
    });
  })));

  it('createAssessment() should return assessment', fakeAsync(inject([Http, MockBackend], (http: Http, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe(connection => {
      const response = new ResponseOptions({body: mockAssessment });
      connection.mockRespond(new Response(response));
    });
    const assessmentService = new AssessmentService(http);
    assessmentService.createAssessment(mockAssessment[0]).subscribe(res => {
      expect(res.firstName).toBe('fname');
      expect(res.lastName).toBe('lname');
      expect(res.email).toBe('e@mail.com');
    });
  })));
});
