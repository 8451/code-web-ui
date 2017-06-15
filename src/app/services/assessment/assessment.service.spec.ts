import { TestBed, inject } from '@angular/core/testing';

import { AssessmentService } from './assessment.service';
import { Headers, Http, BaseRequestOptions, XHRBackend } from '@angular/http';
import { MockBackend} from '@angular/http/testing';

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
});
