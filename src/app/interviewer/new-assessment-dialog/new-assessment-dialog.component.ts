import { AlertService } from '../../services/alert/alert.service';
import { AssessmentService } from '../../services/assessment/assessment.service';
import { Assessment, AssessmentStates } from '../../domains/assessment';
import { MatDialogRef } from '@angular/material';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-new-assessment-dialog',
  templateUrl: './new-assessment-dialog.component.html',
  styleUrls: ['./new-assessment-dialog.component.scss']
})
export class NewAssessmentDialogComponent implements OnInit, OnDestroy {
  subscription;
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<NewAssessmentDialogComponent>, private alertService: AlertService,
              private assessmentService: AssessmentService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [null, [

      ]],
      firstName: ['', [
        Validators.required
      ]],
      lastName: ['', [
        Validators.required
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      interviewGuid: [null, [

      ]],
      state: [AssessmentStates.NOT_STARTED, [

      ]],
      notes: ['', [

      ]],
      questionAnswers: [[], []],
      modifiedBy: [null, []],
      modifiedDate: [new Date(), []],
    });
  }

  createAssessment(): void {
    if (!this.form.valid) {
      return;
    }
    const assessment: Assessment = this.form.value as Assessment;
    this.subscription = this.assessmentService.createAssessment(assessment).subscribe(res => {
      this.alertService.info('Assessment created');
      this.dialogRef.close();
    },
    e => {
      this.dialogRef.close();
      this.alertService.error('Error creating assessment.');
    }
    );
  }

  ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
  }

}
