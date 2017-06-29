import { Observable } from 'rxjs/Rx';
import { CandidateQuestion } from './../domains/candidateQuestion';
import { CandidateService } from './../services/candidate/candidate.service';
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
  candidateQuestion: CandidateQuestion;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private candidateService: CandidateService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      answer: ['', [
      ]]
    });

    this.sub = this.route.params.switchMap((params: Params) => {
      this.id = params['id'];
      return this.candidateService.getCandidateQuestion(this.id);
    }).subscribe((candidateQuestion: CandidateQuestion) => {
      this.candidateQuestion = candidateQuestion;
      this.form.setValue({
        answer: candidateQuestion.body
      });
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
