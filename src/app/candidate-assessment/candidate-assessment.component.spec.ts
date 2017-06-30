import { AlertService } from './../services/alert/alert.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { CandidateAssessmentComponent } from './candidate-assessment.component';

describe('CandidateAssessmentComponent', () => {
  let component: CandidateAssessmentComponent;
  let fixture: ComponentFixture<CandidateAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateAssessmentComponent ],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule,
      ],
      providers: [
      { provide: ActivatedRoute, useValue: {params: Observable.of([{id: '12345'}])}},
      AlertService,
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
