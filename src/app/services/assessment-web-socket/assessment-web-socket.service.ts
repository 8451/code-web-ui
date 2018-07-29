import { Observable } from 'rxjs/Rx';
import { ConnectEvent, AnswerQuestionEvent, EndAssessmentEvent } from './../../domains/events/web-socket-event';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { StompRService } from '@stomp/ng2-stompjs';
import { Injectable } from '@angular/core';
import { NewQuestionEvent, PasteEvent } from 'app/domains/events/web-socket-event';

@Injectable()
export class AssessmentWebSocketService {

  socketUrl = '/api/v1/socket';

  constructor(public stomp: StompRService) {
    stomp.config = {
      url: this.socketUrl,
      headers: {

      },
      heartbeat_in: 0, // Typical value 0 - disabled
      heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
    
      // Wait in milliseconds before attempting auto reconnect
      // Set to 0 to disable
      // Typical value 5000 (5 seconds)
      reconnect_delay: 5000,
    
      // Will log diagnostics on console
      debug: true
    };

    this.stomp.initAndConnect();
  }

  sendConnectEvent(guid: string) {
    this.stomp.publish(`/assessment/${guid}/connect`, JSON.stringify(new ConnectEvent()))
  }

  getConnectEvent(guid: string): Observable<ConnectEvent> {
    return this.stomp.subscribe(`/topic/assessment/${guid}/connect`).map(message => {
      return JSON.parse(message.body);
    });
  }

  getNewQuestion(guid: string): Observable<NewQuestionEvent> {
    return this.stomp.subscribe(`/topic/assessment/${guid}/new-question`).map(message => {
      return JSON.parse(message.body);
    });
  }

  sendNewQuestion(guid: string, question: NewQuestionEvent): void {
    this.stomp.publish(`/assessment/${guid}/new-question`, JSON.stringify(question));
  }

  answerQuestion(guid: string, answerQuestion: AnswerQuestionEvent): void {
    this.stomp.publish(`/assessment/${guid}/answer-question`, JSON.stringify(answerQuestion));
  }

  getAnsweredQuestion(guid: string): Observable<AnswerQuestionEvent> {
    return this.stomp.subscribe(`/topic/assessment/${guid}/answer-question`).map(message => {
      return JSON.parse(message.body);
    });
  }

  sendEndAssessment(guid: string, event: EndAssessmentEvent) {
    this.stomp.publish(`/assessment/${guid}/end-assessment`, JSON.stringify(event));
  }

  getEndAssessment(guid: string): Observable<EndAssessmentEvent> {
    return this.stomp.subscribe(`/topic/assessment/${guid}/end-assessment`).map(message => {
      return JSON.parse(message.body);
    });
  }

  sendPasteEvent(guid: string) {
    this.stomp.publish(`/assessment/${guid}/paste`, JSON.stringify(new PasteEvent()));
  }

  getPasteEvent(guid: string): Observable<PasteEvent> {
    return this.stomp.subscribe(`/topic/assessment/${guid}/paste`).map(message => {
      return JSON.parse(message.body);
    });
  }

}
