import { ConnectEvent } from './../../domains/events/web-socket-event';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { StompService } from 'ng2-stomp-service';
import { TestBed, inject, async, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import { AssessmentWebSocketService } from './assessment-web-socket.service';

const mockSubscription = {
  unsubscribe() {}
};

const mockNewQuestionEvent = {
  title: 'title',
  body: 'body',
  questionResponseId: '12345',
  timestamp: new Date(0)
};

const mockStomp = {
  configure(object: any) {},
  startConnect() {return Promise.resolve(); },
  done(queue: string) {},
  after(queue: string) {return Promise.resolve(); },
  subscribe(address: string, fun: (data: any) => void ) {},
  send(data: any) {}
};

describe('AssessmentWebSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentWebSocketService, {provide: StompService, useValue: mockStomp}]
    });
  });

  it('should be created', fakeAsync(inject([AssessmentWebSocketService], (assessmentWebSocketService: AssessmentWebSocketService) => {
    expect(assessmentWebSocketService).toBeTruthy();
  })));

  it('should send connect event', fakeAsync(inject([AssessmentWebSocketService],
    (assessmentWebSocketService: AssessmentWebSocketService) => {
      spyOn(assessmentWebSocketService.stomp, 'send');
      assessmentWebSocketService.sendConnectEvent('1234');
      tick();
      expect(assessmentWebSocketService.stomp.send).toHaveBeenCalled();
      expect(assessmentWebSocketService.stomp.send).toHaveBeenCalledWith('/assessment/1234/connect',  jasmine.any(ConnectEvent));
  })));

  it('should get a new question', fakeAsync(inject([AssessmentWebSocketService],
   (assessmentWebSocketService: AssessmentWebSocketService) => {
      spyOn(assessmentWebSocketService.stomp, 'subscribe').and.returnValue(Observable.of(mockNewQuestionEvent));
      const returnedQuestionObservable = assessmentWebSocketService.getNewQuestion('1234');
      tick();
      expect(assessmentWebSocketService.stomp.subscribe).toHaveBeenCalledWith('/topic/assessment/1234/new-question', jasmine.anything());
      expect(returnedQuestionObservable).toBeTruthy();
  })));
});
