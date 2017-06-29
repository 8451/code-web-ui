import { Subscription } from 'rxjs/Subscription';
import { CandidateQuestion } from './../../domains/candidateQuestion';
import { Observable } from 'rxjs/Observable';
import { StompService } from 'ng2-stomp-service';
import { TestBed, inject } from '@angular/core/testing';
import { CandidateService } from './candidate.service';

let candidateService: CandidateService;
let stomp = StompService;

// const testQuestion: CandidateQuestion = {
//   title: 'Title',
//   body: 'Body',
//   questionResponseId: 'id'
// }

const mockSubscription = {
  unsubscribe() {}
};

describe('CandidateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CandidateService, StompService]
    });
    stomp = TestBed.get(StompService);
    spyOn(stomp, 'configure');
    spyOn(stomp, 'startConnect').and.returnValue(Promise.resolve());
    spyOn(stomp, 'after').and.returnValue(Promise.resolve());
    // spyOn(stomp, 'subscribe').and.returnValue(mockSubscription);
    spyOn(stomp, 'subscribe');
    candidateService = TestBed.get(CandidateService);
  });

  it('should be created', () => {
      expect(candidateService).toBeTruthy();
  });
});
