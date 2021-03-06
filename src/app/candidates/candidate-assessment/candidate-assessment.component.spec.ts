import { AceEditorModule } from 'ng2-ace-editor';
import { AssessmentStateResponse, AssessmentStates } from '../../domains/assessment';
import { Subject } from 'rxjs/Subject';
import { AnswerQuestionEvent, EndAssessmentEvent } from '../../domains/events/web-socket-event';
import { StompService, StompConfig} from '@stomp/ng2-stompjs';
import { NewQuestionEvent } from 'app/domains/events/web-socket-event';
import { AssessmentService } from '../../services/assessment/assessment.service';
import { AssessmentWebSocketService, stompConfig } from '../../services/assessment-web-socket/assessment-web-socket.service';
import { AlertService } from '../../alert/alert-service/alert.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CandidateAssessmentComponent } from './candidate-assessment.component';
import { MatInputModule, MatToolbarModule, MatSlideToggleModule } from '@angular/material';

describe('CandidateAssessmentComponent', () => {
  let component: CandidateAssessmentComponent;
  let fixture: ComponentFixture<CandidateAssessmentComponent>;
  let assessmentWebSocketService: AssessmentWebSocketService;
  let assessmentService: AssessmentService;
  let spy: any;

  const question: NewQuestionEvent = {
    title: 'title',
    body: 'body',
    language: 'language',
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
    initAndConnect(object: any) {},
    publish() { },
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
        FormsModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatInputModule,
        MatSlideToggleModule,
        AceEditorModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {params: Observable.of([{id: '12345'}])}},
        AlertService,
        { provide: StompService, useValue: mockStomp },
        { provide: StompConfig, useValue: {url: ''}},
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
      language: question.language,
      answer: question.body,
      questionResponseId: question.questionResponseId
    });
    component.submitAnswer();
    expect(assessmentWebSocketService.answerQuestion).toHaveBeenCalled();
  });

  it('should display a toast when submitted', () => {
    spyOn(assessmentWebSocketService, 'answerQuestion').and.callThrough();
    const alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'info').and.callThrough();
    component.form.setValue({
      title: question.title,
      body: question.body,
      language: question.language,
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

  it('should send paste event when pasting', fakeAsync(() => {
    assessmentWebSocketService = fixture.debugElement.injector.get(AssessmentWebSocketService);
    spyOn(assessmentWebSocketService, 'sendPasteEvent');
    component.sendPasteEvent();
    expect(assessmentWebSocketService.sendPasteEvent).toHaveBeenCalled();
  }));

  it('should set the theme to dark when toggle is not checked', () => {
    component.theme.toggle = false;
    component.setTheme();
    expect(component.theme.name).toBe('monokai');
  });

  it('should set the theme to light when toggle is checked', () => {
    component.theme.toggle = true;
    component.setTheme();
    expect(component.theme.name).toBe('sqlserver');
  });
});
