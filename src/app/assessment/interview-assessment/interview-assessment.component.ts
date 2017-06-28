import { Assessment } from './../../domains/assessment';
import { AssessmentService } from './../../services/assessment/assessment.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interview-assessment',
  templateUrl: './interview-assessment.component.html',
  styleUrls: ['./interview-assessment.component.scss']
})
export class InterviewAssessmentComponent implements OnInit {

  private assessment: Assessment;

  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.assessmentService.getAssessmentByGuid(params['guid']))
      .subscribe(assessment => {
        this.assessment = assessment;
      });
  }
}
