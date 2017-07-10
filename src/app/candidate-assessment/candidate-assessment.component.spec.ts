import { AssessmentStateResponse, AssessmentStates } from './../domains/assessment';
import { Subject } from 'rxjs/Subject';
import { AnswerQuestionEvent, EndAssessmentEvent } from './../domains/events/web-socket-event';
import { StompService } from 'ng2-stomp-service';
import { NewQuestionEvent } from 'app/domains/events/web-socket-event';
import { AssessmentService } from './../services/assessment/assessment.service';
import { AssessmentWebSocketService } from './../services/assessment-web-socket/assessment-web-socket.service';
import { AlertService } from './../services/alert/alert.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { CandidateAssessmentComponent } from './candidate-assessment.component';

describe('CandidateAssessmentComponent', () => {
  let component: CandidateAssessmentComponent;
  let fixture: ComponentFixture<CandidateAssessmentComponent>;
  let assessmentWebSocketService: AssessmentWebSocketService;
  let assessmentService: AssessmentService;
  let spy: any;

  const question: NewQuestionEvent = {
    title: 'title',
    body: 'body',
    questionResponseId: 'id',
    timestamp: new Date(0)
  };

  const mockAssessmentService = {
    getAssessmentStateByGuid(guid: string): Observable<AssessmentStateResponse> {
      return Observable.of({state: AssessmentStates.IN_PROGRESS});
    }
  };

  const mockRouter = { navigate: spy = jasmine.createSpy('navigate') };

  const mockStomp = {
    configure(object: any) {},
    startConnect() {return Promise.resolve(); },
    done(queue: string) {},
    after(queue: string) {return Promise.resolve(); },
    subscribe(address: string, fun: (data: any) => void ) {},
    send(data: any) {}
  };

  let endAssessmentSubject = new Subject<EndAssessmentEvent>();

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
        AssessmentWebSocketService,
        { provide: Router, useValue: mockRouter },
        { provide: AssessmentService, useValue: mockAssessmentService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateAssessmentComponent);
    component = fixture.componentInstance;
    assessmentWebSocketService = fixture.debugElement.injector.get(AssessmentWebSocketService);
    spyOn(assessmentWebSocketService, 'getNewQuestion').and.returnValue(Observable.of(question));
    spyOn(assessmentWebSocketService, 'getEndAssessment').and.returnValue(endAssessmentSubject);
    fixture.detectChanges();
  });

  afterEach(() => {
    endAssessmentSubject = new Subject<EndAssessmentEvent>();
    spy.calls.reset();
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

  it('should redirect to Thank You when ended', fakeAsync(() => {
    component.ngOnInit();
    endAssessmentSubject.next(new EndAssessmentEvent());
    tick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/candidate/thank-you']);
  }));

  it('should redirect to Thank You when assessment is not in progress', fakeAsync(() => {
    assessmentService = fixture.debugElement.injector.get(AssessmentService);
    spyOn(assessmentService, 'getAssessmentStateByGuid').and.returnValue(Observable.of({state: AssessmentStates.CLOSED}));
    component.ngOnInit();
    tick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/candidate/thank-you']);
  }));

  it('should send answer on keyup', fakeAsync(() => {
    assessmentWebSocketService = fixture.debugElement.injector.get(AssessmentWebSocketService);
    spyOn(assessmentWebSocketService, 'answerQuestion');
    spyOn(component, 'sendAnswer').and.callThrough();
    component.ngOnInit();
    component.answerKeystroke();
    // Delay needed to account for debounce
    tick(500);
    expect(component.sendAnswer).toHaveBeenCalled();
    expect(assessmentWebSocketService.answerQuestion).toHaveBeenCalled();
  }));
});
