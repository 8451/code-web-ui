import { ConnectEvent } from './../../domains/events/web-socket-event';
import { Subject } from 'rxjs/Subject';
import { NewQuestionEvent, AnswerQuestionEvent } from 'app/domains/events/web-socket-event';
import { StompService } from 'ng2-stomp-service';
import { AssessmentWebSocketService } from './../../services/assessment-web-socket/assessment-web-socket.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertService } from './../../services/alert/alert.service';
import { Question } from './../../domains/question';
import { QuestionService } from './../../services/question/question.service';
import { QuestionInfoDialogComponent } from './../../question-info-dialog/question-info-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { QuestionListItemComponent } from './../../question-list-item/question-list-item.component';
import { AuthService } from './../../services/auth/auth.service';
import { HttpModule, ResponseOptions, Response } from '@angular/http';
import { Assessment, AssessmentStates } from './../../domains/assessment';
import { AssessmentService } from './../../services/assessment/assessment.service';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, Validators, NgForm, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { InterviewAssessmentComponent } from './interview-assessment.component';
import { MaterialModule, MdDialog, MdDialogRef, OverlayRef } from '@angular/material';

describe('InterviewAssessmentComponent', () => {
  let component: InterviewAssessmentComponent;
  let fixture: ComponentFixture<InterviewAssessmentComponent>;
  let questionService: QuestionService;
  let assessmentService: AssessmentService;
  let assessmentWebSocketService: AssessmentWebSocketService;
  let alertService: AlertService;
  let mockRouter = { navigate: jasmine.createSpy('navigate') };
  const errorResponse = new Response(new ResponseOptions({ status: 500, body: null }));
  const assessments: Assessment[] = [{
    id: 'test',
    firstName: 'first',
    lastName: 'lastName',
    email: 'e@mail.com',
    interviewGuid: 'testGuid',
    modifiedBy: 'Test User',
    modifiedDate: new Date(1),
    state: AssessmentStates.NOT_STARTED,
    notes: 'notes'
  }];

  const answerEvent: AnswerQuestionEvent = {
    title: 'ae_title1',
    body: 'ae_body1',
    answer: 'ae_answer1',
    questionResponseId: 'ae_',
    timestamp: new Date(),
  };

  let answerEventSubject = new Subject<AnswerQuestionEvent>();

  const mockStomp = {
    configure(object: any) { },
    startConnect() { return Promise.resolve(); },
    done(queue: string) { },
    after(queue: string) { return Promise.resolve(); },
    subscribe(address: string, fun: (data: any) => void) { },
    send(data: any) { }
  };

  const questions: any[] = [
    {
      'id': 'id1',
      'title': 'Title1',
      'body': 'Body1',
      'suggestedAnswer': 'SuggestedAnswer1',
      'createdBy': 'createdBy1',
      'createdDate': null,
      'modifiedBy': 'modifiedBy1',
      'modifiedDate': null
    },
    {
      'id': 'id2',
      'title': 'Title2',
      'body': 'Body2',
      'suggestedAnswer': 'SuggestedAnswer2',
      'createdBy': 'createdBy2',
      'createdDate': null,
      'modifiedBy': 'modifiedBy2',
      'modifiedDate': null
    },
    {
      'id': 'id3',
      'title': 'Title3',
      'body': 'Body3',
      'suggestedAnswer': 'SuggestedAnswer3',
      'createdBy': 'createdBy3',
      'createdDate': null,
      'modifiedBy': 'modifiedBy3',
      'modifiedDate': null
    }

  ];

  class MdDialogRefMock {
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InterviewAssessmentComponent, QuestionListItemComponent, QuestionInfoDialogComponent],
      imports: [
        HttpModule,
        RouterTestingModule,
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        AuthService,
        AssessmentService,
        QuestionService,
        MdDialog,
        AlertService,
        { provide: ActivatedRoute, useValue: { params: Observable.from([{ 'guid': '1234' }]) } },
        { provide: Router, useValue: mockRouter },
        { provide: StompService, useValue: mockStomp },
        AssessmentWebSocketService,
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [QuestionInfoDialogComponent]
        }
      })
      .overrideComponent(QuestionInfoDialogComponent, {
        set: {
          template: '<span>QuestionInfoDialogComponent</span>',
          providers: []
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewAssessmentComponent);
    component = fixture.componentInstance;
    assessmentService = fixture.debugElement.injector.get(AssessmentService);
    questionService = fixture.debugElement.injector.get(QuestionService);
    assessmentWebSocketService = fixture.debugElement.injector.get(AssessmentWebSocketService);
    spyOn(assessmentService, 'getAssessmentByGuid').and.returnValue(Observable.of(assessments[0]));
    spyOn(assessmentWebSocketService, 'getAnsweredQuestion').and.returnValue(answerEventSubject);
  });

  afterEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    answerEventSubject = new Subject<AnswerQuestionEvent>();
  });

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should populate with a list of questions', async(() => {
    spyOn(questionService, 'getQuestions').and.returnValue(Observable.of(questions));

    component.getQuestions();

    expect(component.questions).toBe(questions);
  }));

  it('should display toast when error occurs in getQuestions', async(() => {
    spyOn(questionService, 'getQuestions').and.returnValue(
      Observable.throw(new Response(new ResponseOptions({ status: 500, body: null })))
    );

    alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'error');

    component.getQuestions();
    expect(alertService.error).toHaveBeenCalled();
  }));

  it('should set selectedQuestion', async(() => {
    component.selectQuestion(questions[0]);
    expect(component.selectedQuestion).toBe(questions[0]);
  }));

  it('should open up a dialog', async(() => {
    component.selectedQuestion = questions[0];

    component.previewQuestion();
    component.dialog.afterOpen.subscribe(data => {
      expect(component.dialogRef.componentInstance.question).toBe(questions[0]);
    });
  }));

  it('should set sentQuestion', inject([AssessmentWebSocketService],
    (injectedAssessmentWebSocketService: AssessmentWebSocketService) => {
    component.selectedQuestion = questions[0];
    component.assessment = assessments[0];
    spyOn(injectedAssessmentWebSocketService, 'sendNewQuestion');
    component.sendQuestion();
    expect(component.sentQuestion).toBe(questions[0]);
    expect(injectedAssessmentWebSocketService.sendNewQuestion).toHaveBeenCalled();
  }));

  it('should update sentQuestion.body when answer received', fakeAsync((inject([AssessmentWebSocketService],
  (injectedAssessmentWebSocketService: AssessmentWebSocketService) => {
    spyOn(questionService, 'getQuestions').and.returnValue(Observable.of(questions));
    component.ngOnInit();
    component.selectedQuestion = questions[0];
    component.assessment = assessments[0];
    spyOn(injectedAssessmentWebSocketService, 'sendNewQuestion');
    component.sendQuestion();
    answerEventSubject.next(answerEvent);
    tick(); // make sure the callback for the answerEvent gets called.
    expect(component.sentQuestion.body).toEqual(answerEvent.answer);
  }))));

  it('endAssessment() should end the assessment and navigate', async(() => {
    spyOn(questionService, 'getQuestions').and.returnValue(Observable.of(questions));

    spyOn(assessmentService, 'updateAssessment').and.returnValue(Observable.of(assessments[0]));

    alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'confirmation').and.returnValue(Observable.of(true));
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.assessment = assessments[0];
    component.endAssessment();

    expect(alertService.info).toHaveBeenCalled();
    expect(alertService.error).toHaveBeenCalledTimes(0);
    expect(assessmentService.getAssessmentByGuid).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
  }));

  it('endAssessment() should not end if confirmation fails', async(() => {
    spyOn(questionService, 'getQuestions').and.returnValue(Observable.of(questions));

    spyOn(assessmentService, 'updateAssessment').and.returnValue(Observable.of(assessments[0]));

    alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'confirmation').and.returnValue(Observable.of(false));
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.assessment = assessments[0];
    component.endAssessment();

    expect(alertService.info).toHaveBeenCalledTimes(0);
    expect(alertService.error).toHaveBeenCalledTimes(0);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
  }));

  it('endAssessment() should throw an error if it cannot end the assessment', async(() => {
    spyOn(questionService, 'getQuestions').and.returnValue(Observable.of(questions));

    spyOn(assessmentService, 'updateAssessment').and.returnValue(Observable.throw(this.errorResponse));

    alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'confirmation').and.returnValue(Observable.of(true));
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.assessment = assessments[0];
    component.endAssessment();

    expect(alertService.info).toHaveBeenCalledTimes(0);
    expect(alertService.error).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
  }));

  it('saveNotes() should save the notes and navigate', async(() => {
    spyOn(questionService, 'getQuestions').and.returnValue(Observable.of(questions));

    spyOn(assessmentService, 'updateAssessment').and.returnValue(Observable.of(assessments[0]));

    alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.assessment = assessments[0];
    component.saveNotes(assessments[0].notes);

    expect(alertService.info).toHaveBeenCalled();
    expect(alertService.error).toHaveBeenCalledTimes(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../interview/assessments']);
  }));

  it('saveNotes() should throw an error if it cannot save the notes', async(() => {
    spyOn(questionService, 'getQuestions').and.returnValue(Observable.of(questions));

    spyOn(assessmentService, 'updateAssessment').and.returnValue(Observable.throw(this.errorResponse));

    alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'confirmation').and.returnValue(Observable.of(true));
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.assessment = assessments[0];
    component.saveNotes(assessments[0].notes);

    expect(alertService.info).toHaveBeenCalledTimes(0);
    expect(alertService.error).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
  }));

  it('should display a toast when a new user connects', () => {

    alertService = fixture.debugElement.injector.get(AlertService);

    spyOn(assessmentWebSocketService, 'getConnectEvent')
      .and.returnValue(Observable.of(new ConnectEvent()));
    spyOn(alertService, 'info');
    component.getConnectEvent(assessments[0].interviewGuid);
    expect(alertService.info).toHaveBeenCalled();
  });

  it('should send connect event', () => {
    spyOn(assessmentWebSocketService, 'sendConnectEvent');
    component.sendConectEvent(assessments[0].interviewGuid);
    expect(assessmentWebSocketService.sendConnectEvent).toHaveBeenCalled();
  });
});
