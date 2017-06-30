import { Observable } from 'rxjs/Rx';
import { ConnectEvent, AnswerQuestionEvent } from './../../domains/events/web-socket-event';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { StompService } from 'ng2-stomp-service';
import { Injectable } from '@angular/core';
import { NewQuestionEvent } from 'app/domains/events/web-socket-event';

@Injectable()
export class AssessmentWebSocketService {

  socketUrl = '/api/v1/socket';

  constructor(public stomp: StompService) {
    stomp.configure({
      host: this.socketUrl,
      debug: true,
      queue: { 'init': false }
    });

    stomp.startConnect().then(() => {
      stomp.done('init');
      console.log('connected');
    });
  }

  sendConnectEvent(guid: string) {
    this.stomp.after('init').then(() => {
      this.stomp.send(`/assessment/${guid}/connect`, new ConnectEvent());
    });
  }

  getConnectEvent(guid: string): Observable<ConnectEvent> {
    const connect: Subject<ConnectEvent> = new Subject<ConnectEvent>();
    this.stomp.after('init').then(() => {
      this.stomp.subscribe(`/topic/assessment/${guid}/connect`, (data) => {
        connect.next(data);
      });
    });
    return connect;
  }

  getNewQuestion(guid: string): Observable<NewQuestionEvent> {
    const newQuestion: Subject<NewQuestionEvent> = new Subject<NewQuestionEvent>();
    this.stomp.after('init').then(() => {
      this.stomp.subscribe(`/topic/assessment/${guid}/new-question`, (data) => {
        newQuestion.next(data);
      });
    });
    return newQuestion;
  }

  sendNewQueston(guid: string, question: NewQuestionEvent): void {
    this.stomp.after('init').then(() => {
      this.stomp.send(`/assessment/${guid}/new-question`, question);
    });
  }

  answerQuestion(guid: string, answerQuestion: AnswerQuestionEvent): void {
    this.stomp.after('init').then(() => {
      this.stomp.send(`/assessment/${guid}/answer-question`, answerQuestion);
    });
  }

  getAnsweredQuestion(guid: string): Observable<AnswerQuestionEvent> {
    const answeredQuestion: Subject<AnswerQuestionEvent> = new Subject<AnswerQuestionEvent>();

    this.stomp.after('init').then(() => {
      this.stomp.subscribe(`/topic/assessment/${guid}/answer-question`, (data) => {
        answeredQuestion.next(data);
      });
    });

    return answeredQuestion;
  }

}
