import { AnswerQuestionEvent } from './../domains/events/web-socket-event';
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
  let assessmentWebSocketService: AssessmentWebSocketService;

  const question: NewQuestionEvent = {
    title: 'title',
    body: 'body',
    questionResponseId: 'id',
    timestamp: new Date(0)
  };

  const mockStomp = {
    configure(object: any) {},
    startConnect() {return Promise.resolve(); },
    done(queue: string) {},
    after(queue: string) {return Promise.resolve(); },
    subscribe(address: string, fun: (data: any) => void ) {},
    send(data: any) {}
  };

  const mockAssessmentWebSocketService = {
    answerQuestion(guid: string, answerQuestion: AnswerQuestionEvent) {},
    sendNewQuestion(guid: string, newQuestion: NewQuestionEvent) {},
    getNewQuestion(guid: string): Observable<NewQuestionEvent> { return Observable.of(question); },
    sendConnectEvent(guid: string) {},
};

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
      { provide: StompService, useValue: mockStomp },
      { provide: AssessmentWebSocketService, useValue: mockAssessmentWebSocketService}
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateAssessmentComponent);
    component = fixture.componentInstance;
    assessmentWebSocketService = fixture.debugElement.injector.get(AssessmentWebSocketService);
    spyOn(assessmentWebSocketService, 'getNewQuestion').and.returnValue(Observable.of(question));
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should send answer over websockets when submitted', () => {
    spyOn(assessmentWebSocketService, 'answerQuestion');
    component.form.setValue({
      title: question.title,
      body: question.body,
      answer: question.body,
      questionResponseId: question.questionResponseId
    });
    component.submitAnswer();
    expect(assessmentWebSocketService.answerQuestion).toHaveBeenCalled();
  });

  it('should display a toast when submitted', () => {
    spyOn(assessmentWebSocketService, 'answerQuestion');
    const alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'info');
    component.form.setValue({
      title: question.title,
      body: question.body,
      answer: question.body,
      questionResponseId: question.questionResponseId
    });
    component.submitAnswer();
    expect(alertService.info).toHaveBeenCalled();
  });
});
