import { CandidateQuestion } from './../../domains/candidateQuestion';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { StompService } from 'ng2-stomp-service';
import { Injectable } from '@angular/core';

@Injectable()
export class CandidateService {

  subscription: Subscription;
  candidateQuestion: Subject<CandidateQuestion> = new Subject<CandidateQuestion>();
  candidateServiceUrl = '/api/v1/socket';

  constructor(private stomp: StompService) {
    stomp.configure({
      host: this.candidateServiceUrl,
      debug: true,
      queue: {'init': false}
    });

    stomp.startConnect().then(() => {
      stomp.done('init');
      console.log('connected');
    });
   }

   getCandidateQuestion(guid: string): Subject<CandidateQuestion> {
     this.stomp.after('init').then(() => {
       this.stomp.subscribe(`/topic/assessment/${guid}/connect`, (data) => {
         console.log(data);
       });
       this.stomp.send(`/assessment/${guid}/connect`, {success: true});
       console.log(guid);
       this.subscription = this.stomp.subscribe(`/topic/assessment/${guid}/new-question`, (data) => {
         this.candidateQuestion.next(data);
       });
     });
     return this.candidateQuestion;
   }

}
