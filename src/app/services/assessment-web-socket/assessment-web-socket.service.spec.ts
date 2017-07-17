import { ConnectEvent, NewQuestionEvent, AnswerQuestionEvent, PasteEvent } from './../../domains/events/web-socket-event';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { StompService } from 'ng2-stomp-service';
import { TestBed, inject, async, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import { AssessmentWebSocketService } from './assessment-web-socket.service';

const mockSubscription = {
  unsubscribe() { }
};

const mockNewQuestionEvent = {
  title: 'title',
  body: 'body',
  language: 'language',
  questionResponseId: '12345',
  timestamp: new Date(0)
};

const mockAnswerQuestionEvent: AnswerQuestionEvent = {
  title: 'title',
  body: 'body',
  language: 'language',
  answer: 'answer',
  questionResponseId: '12345',
  timestamp: new Date(0)
};

const mockConnectEvent = {
  timestamp: new Date(0)
};

const mockPasteEvent: PasteEvent = {
  timestamp: new Date(0)
};

const mockStomp = {
  configure(object: any) { },
  startConnect() { return Promise.resolve(); },
  done(queue: string) { },
  after(queue: string) { return Promise.resolve(); },
  subscribe(address: string, fun: (data: any) => void) { },
  send(data: any) { }
};

describe('AssessmentWebSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentWebSocketService, { provide: StompService, useValue: mockStomp }]
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
      expect(assessmentWebSocketService.stomp.send).toHaveBeenCalledWith('/assessment/1234/connect', jasmine.any(ConnectEvent));
    })));

  it('should get connect event', fakeAsync(inject([AssessmentWebSocketService],
    (assessmentWebSocketService: AssessmentWebSocketService) => {
      spyOn(assessmentWebSocketService.stomp, 'subscribe').and.returnValue(Observable.of(mockConnectEvent));
      const returnedConnectObservable = assessmentWebSocketService.getConnectEvent('1234');
      tick();
      expect(assessmentWebSocketService.stomp.subscribe).toHaveBeenCalled();
      expect(returnedConnectObservable).toBeTruthy();
    })));

  it('should send a new question', fakeAsync(inject([AssessmentWebSocketService],
    (assessmentWebSocketService: AssessmentWebSocketService) => {
      spyOn(assessmentWebSocketService.stomp, 'send');
      assessmentWebSocketService.sendNewQuestion('1234', mockNewQuestionEvent);
      tick();
      expect(assessmentWebSocketService.stomp.send).toHaveBeenCalledWith('/assessment/1234/new-question', mockNewQuestionEvent);
    })));

  it('should get a new question', fakeAsync(inject([AssessmentWebSocketService],
    (assessmentWebSocketService: AssessmentWebSocketService) => {
      spyOn(assessmentWebSocketService.stomp, 'subscribe').and.returnValue(Observable.of(mockNewQuestionEvent));
      const returnedQuestionObservable = assessmentWebSocketService.getNewQuestion('1234');
      tick();
      expect(assessmentWebSocketService.stomp.subscribe).toHaveBeenCalledWith('/topic/assessment/1234/new-question', jasmine.anything());
      expect(returnedQuestionObservable).toBeTruthy();
    })));

  it('should send a new answer', fakeAsync(inject([AssessmentWebSocketService],
    (assessmentWebSocketService: AssessmentWebSocketService) => {
      spyOn(assessmentWebSocketService.stomp, 'send');
      assessmentWebSocketService.answerQuestion('1234', mockAnswerQuestionEvent);
      tick();
      expect(assessmentWebSocketService.stomp.send)
        .toHaveBeenCalledWith('/assessment/1234/answer-question', mockAnswerQuestionEvent);
    })));

  it('should get an answer', fakeAsync(inject([AssessmentWebSocketService],
    (assessmentWebSocketService: AssessmentWebSocketService) => {
      spyOn(assessmentWebSocketService.stomp, 'subscribe').and.returnValue(Observable.of(mockAnswerQuestionEvent));
      const returnedAnswerObservable = assessmentWebSocketService.getAnsweredQuestion('1234');
      tick();
      expect(assessmentWebSocketService.stomp.subscribe).toHaveBeenCalledWith('/topic/assessment/1234/answer-question', jasmine.anything());
      expect(returnedAnswerObservable).toBeTruthy();
    })));

  it('should send paste event', fakeAsync(inject([AssessmentWebSocketService],
    (assessmentWebSocketService: AssessmentWebSocketService) => {
      spyOn(assessmentWebSocketService.stomp, 'send');
      assessmentWebSocketService.sendPasteEvent('1234');
      tick();
      expect(assessmentWebSocketService.stomp.send).toHaveBeenCalled();
      expect(assessmentWebSocketService.stomp.send).toHaveBeenCalledWith('/assessment/1234/paste', jasmine.any(PasteEvent));
    })));

  it('should get paste event', fakeAsync(inject([AssessmentWebSocketService],
    (assessmentWebSocketService: AssessmentWebSocketService) => {
      spyOn(assessmentWebSocketService.stomp, 'subscribe').and.returnValue(Observable.of(mockPasteEvent));
      const returnedPasteObservable = assessmentWebSocketService.getPasteEvent('1234');
      tick();
      expect(assessmentWebSocketService.stomp.subscribe).toHaveBeenCalled();
      expect(returnedPasteObservable).toBeTruthy();
    })));
});
