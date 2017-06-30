import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { StompService } from 'ng2-stomp-service';
import { TestBed, inject, async, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import { AssessmentWebSocketService } from './assessment-web-socket.service';

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
};

describe('AssessmentWebSocketService', () => {
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
