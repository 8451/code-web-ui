import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  id: string;
  sub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      body: ['', [
      ]],
      answer: ['', [
      ]]
    });

    this.sub = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.form.setValue({
      body: 'This is a question body',
      answer: 'This is most likely an incorrect answer'
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
