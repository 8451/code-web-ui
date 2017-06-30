import { Subscription } from 'rxjs/Subscription';
import { CandidateQuestion } from './../../domains/candidateQuestion';
import { Observable } from 'rxjs/Observable';
import { StompService } from 'ng2-stomp-service';
import { TestBed, inject, async, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import { AssessmentWebSocketService } from './assessment-web-socket.service';

let stomp: StompService;

// const testQuestion: CandidateQuestion = {
//   title: 'Title',
//   body: 'Body',
//   questionResponseId: 'id'
// }

const mockSubscription = {
  unsubscribe() {}
};

const mockStomp = {
  configure(object: any) {},
  startConnect() {return Promise.resolve(); },
  done(queue: string) {},
  after(queue: string) {return Promise.resolve(); },
  subscribe(address: string, fun: (data: any) => void ) {},
  send(data: any) {}
}

fdescribe('AssessmentWebSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentWebSocketService, {provide: StompService, useValue: mockStomp}]
    });
  });

  it('should be created', fakeAsync(inject([AssessmentWebSocketService], (assessmentWebSocketService: AssessmentWebSocketService) => {
    tick();
    expect(assessmentWebSocketService).toBeTruthy();
  })));
});
