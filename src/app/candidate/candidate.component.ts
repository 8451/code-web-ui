import { NewQuestionEvent } from './../domains/events/web-socket-event';
import { AssessmentWebSocketService } from './../services/assessment-web-socket/assessment-web-socket.service';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  id: string;
  sub: Subscription;
  question: NewQuestionEvent;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private assessmentWebSocketService: AssessmentWebSocketService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      answer: ['', [
      ]]
    });

    this.sub = this.route.params.switchMap((params: Params) => {
      this.id = params['id'];
      return this.assessmentWebSocketService.getNewQuestion(this.id);
    }).subscribe((question: NewQuestionEvent) => {
      this.question = question;
      this.form.setValue({
        answer: question.body
      });
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
