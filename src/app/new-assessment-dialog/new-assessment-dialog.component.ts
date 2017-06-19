import { AssessmentService } from './../services/assessment/assessment.service';
import { Assessment } from './../domains/assessment';
import { MdDialogRef } from '@angular/material';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-new-assessment-dialog',
  templateUrl: './new-assessment-dialog.component.html',
  styleUrls: ['./new-assessment-dialog.component.css']
})
export class NewAssessmentDialogComponent implements OnInit, OnDestroy {
  subscription;
  assessment: Assessment = new Assessment();

  constructor(public dialogRef: MdDialogRef<NewAssessmentDialogComponent>, private assessmentService: AssessmentService) { }

  ngOnInit() {
  }

  createAssessment(): void {
    this.subscription = this.assessmentService.createAssessment(this.assessment).subscribe(res => {
      // TODO: call alert service to say the assessment was added
      this.dialogRef.close();
    },
    e => {
      console.error(e);
      this.dialogRef.close();
    }
    );
  }

  ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
  }

}
