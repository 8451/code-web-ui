import { AlertService } from './../../services/alert/alert.service';
import { AssessmentStates } from 'app/domains/assessment';
import { Assessment } from './../../domains/assessment';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AssessmentService } from './../../services/assessment/assessment.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assessment-details',
  templateUrl: './assessment-details.component.html',
  styleUrls: ['./assessment-details.component.css']
})
export class AssessmentDetailsComponent implements OnInit {

  assessment: Assessment;

  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService) { }

  ngOnInit() {
    this.populateAssessment();
  }

  populateAssessment() {
    this.route.params.switchMap((params: Params) => {
      return this.assessmentService.getAssessmentByGuid(params['guid']);
    }).subscribe(assessment => {
      this.assessment = assessment;
      if (this.assessment.state !== AssessmentStates.NOTES && this.assessment.state !== AssessmentStates.CLOSED) {
        this.router.navigate(['/interview/assessments']);
        return;
      }
    });
  }

  saveAssessment() {
    this.assessment.state = AssessmentStates.CLOSED;
    this.assessmentService.updateAssessment(this.assessment).subscribe(res => {
      this.assessment = res;
      this.alertService.info('Assessment updated!');
    }, error => this.alertService.error('Assessment failed to save.'));
  }

}
