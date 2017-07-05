import { StompService } from 'ng2-stomp-service';
import { NewQuestionEvent } from 'app/domains/events/web-socket-event';
import { AssessmentService } from './../services/assessment/assessment.service';
import { AssessmentWebSocketService } from './../services/assessment-web-socket/assessment-web-socket.service';
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

  const question: NewQuestionEvent = {
    title: 'title',
    body: 'body',
    questionResponseId: 'id',
    timestamp: new Date(0)
  }

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
      AssessmentWebSocketService,
      StompService
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateAssessmentComponent);
    component = fixture.componentInstance;
    const assessmentWebSocketService = fixture.debugElement.injector.get(AssessmentWebSocketService);
    spyOn(assessmentWebSocketService, 'getNewQuestion').and.returnValue(Observable.of(question));
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
