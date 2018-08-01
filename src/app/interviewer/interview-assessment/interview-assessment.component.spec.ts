import { QuestionAnswer } from '../../domains/question-answer';
import { AceEditorModule } from 'ng2-ace-editor';
import { ConnectEvent } from '../../domains/events/web-socket-event';
import { Subject } from 'rxjs/Subject';
import { NewQuestionEvent, AnswerQuestionEvent, PasteEvent } from 'app/domains/events/web-socket-event';
import { StompService, StompConfig } from '@stomp/ng2-stompjs';
import { AssessmentWebSocketService, stompConfig } from '../../services/assessment-web-socket/assessment-web-socket.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertService } from '../../services/alert/alert.service';
import { Question } from '../../domains/question';
import { QuestionService } from '../../services/question/question.service';
import { QuestionInfoDialogComponent } from '../question-info-dialog/question-info-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { QuestionListItemComponent } from '../question-list-item/question-list-item.component';
import { AuthService } from '../../services/auth/auth.service';
import { HttpModule, ResponseOptions, Response } from '@angular/http';
import { Assessment, AssessmentStates } from '../../domains/assessment';
import { AssessmentService } from '../../services/assessment/assessment.service';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, Validators, NgForm, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { InterviewAssessmentComponent } from './interview-assessment.component';
import { MatDialog, MatSidenavModule, MatDialogModule, MatIconModule, MatAutocompleteModule } from '@angular/material';
import { LanguageChipComponent } from 'app/interviewer/language-chip/language-chip.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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
    notes: 'notes',
    questionAnswers: []
  }];

  const answerEvent: AnswerQuestionEvent = {
    title: 'Title1',
    body: 'Body1',
    language: 'Java',
    answer: 'Answer1',
    questionResponseId: 'ae_',
    timestamp: new Date(),
  };

  const questionAnswer: QuestionAnswer = {
    title: 'Title1',
    body: 'Body1',
    language: 'Java',
    answer: 'Answer1',
    questionResponseId: 'ae_',

   };

  const newQuestionEvent: NewQuestionEvent = {
    title: 'Title1',
    body: 'Body1',
    language: 'Java',
    questionResponseId: 'ae_',
    timestamp: new Date(),
  };

  let answerEventSubject = new Subject<AnswerQuestionEvent>();

  const mockStomp = {
    initAndConnect() {},
    done(queue: string) { },
    publish(address:string, content: string) {},
    subscribe(address: string, fun: (data: any) => void) { },
    send(data: any) { }
  };

  const languages = ['Java', 'Scala', 'C#'];

  const questions: any[] = [
    {
      'id': 'id1',
      'title': 'Title1',
      'body': 'Body1',
      'suggestedAnswer': 'SuggestedAnswer1',
      'createdBy': 'createdBy1',
      'createdDate': null,
      'modifiedBy': 'modifiedBy1',
      'modifiedDate': null,
      'language': 'Java',
    },
    {
      'id': 'id2',
      'title': 'Title2',
      'body': 'Body2',
      'suggestedAnswer': 'SuggestedAnswer2',
      'createdBy': 'createdBy2',
      'createdDate': null,
      'modifiedBy': 'modifiedBy2',
      'modifiedDate': null,
      'language': 'Scala',
    },
    {
      'id': 'id3',
      'title': 'Title3',
      'body': 'Body3',
      'suggestedAnswer': 'SuggestedAnswer3',
      'createdBy': 'createdBy3',
      'createdDate': null,
      'modifiedBy': 'modifiedBy3',
      'modifiedDate': null,
      'language': 'C#',
    }
  ];

  class MdDialogRefMock {
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InterviewAssessmentComponent, QuestionListItemComponent, QuestionInfoDialogComponent,
        LanguageChipComponent],
      imports: [
        HttpModule,
        RouterTestingModule,
        FormsModule,
        MatSidenavModule,
        MatDialogModule,
        MatIconModule,
        MatAutocompleteModule,
        BrowserAnimationsModule,
        AceEditorModule,
        ReactiveFormsModule,
      ],
      providers: [
        AuthService,
        AssessmentService,
        QuestionService,
        MatDialog,
        AlertService,
        { provide: ActivatedRoute, useValue: { params: Observable.from([{ 'guid': '1234' }]) } },
        { provide: Router, useValue: mockRouter },
        { provide: StompService, useValue: mockStomp },
        { provide: StompConfig, useValue: {url: ''} },
        AssessmentWebSocketService,
        FormBuilder,
      ],
      schemas: [
        NO_ERRORS_SCHEMA
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
    spyOn(questionService, 'getLanguages').and.returnValue(Observable.of(['Java', 'Python']));
    spyOn(assessmentWebSocketService, 'getConnectEvent').and.returnValue(Observable.of(new ConnectEvent()));
    spyOn(assessmentWebSocketService, 'getPasteEvent').and.returnValue(Observable.of(new PasteEvent()));
    spyOn(assessmentWebSocketService, 'getNewQuestion').and.returnValue(Observable.of(newQuestionEvent));
    component.initForm();
  });

  afterEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    answerEventSubject = new Subject<AnswerQuestionEvent>();
  });

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should populate with a list of questions', async(() => {
    component.assessment = assessments[0];
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

  // TODO: this test has a race condition. We need to update it in order to pass.
  // Angular expert wanted...
  // it('should update sentQuestion.body when answer received', fakeAsync(() => {
  //   spyOn(questionService, 'getQuestions').and.returnValue(Observable.of(questions));
  //   component.ngOnInit();
  //   component.selectedQuestion = questions[0];
  //   component.assessment = assessments[0];
  //   spyOn(assessmentWebSocketService, 'sendNewQuestion');
  //   component.sendQuestion();
  //   answerEventSubject.next(answerEvent);
  //   tick(); // make sure the callback for the answerEvent gets called.
  //   fixture.detectChanges();
  //   expect(component.questionBody).toEqual(answerEvent.answer);
  // }));

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
    spyOn(alertService, 'info');
    component.getConnectEvent(assessments[0].interviewGuid);
    expect(alertService.info).toHaveBeenCalled();
  });

  it('should send connect event', () => {
    spyOn(assessmentWebSocketService, 'sendConnectEvent');
    component.sendConnectEvent(assessments[0].interviewGuid);
    expect(assessmentWebSocketService.sendConnectEvent).toHaveBeenCalled();
  });

  it('should display a toast when a user pastes', () => {

    alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'error');
    component.getPasteEvent(assessments[0].interviewGuid);
    expect(alertService.error).toHaveBeenCalled();
  });

  it('should call questionService.getLanguages()', async(() => {
    component.questions = questions;
    component.ngOnInit();
    expect(questionService.getLanguages).toHaveBeenCalled();
  }));

  it('filterQuestions() returns questions with language', () => {
    component.questions = questions;
    expect(component.filterQuestions('j').length).toEqual(1);
  });

  it('filterQuestions() returns all questions with no language', () => {
    component.questions = questions;
    expect(component.filterQuestions(null).length).toEqual(3);
  });

  it('filterLanguages() returns languages that match', () => {
    component.languages = languages;
    expect(component.filterLanguages('j').length).toEqual(1);
  });

  it('filterLanguages returns full list when no language', () => {
    component.languages = languages;
    expect(component.filterLanguages(null).length).toEqual(3);
  });

  it('calls updateSentQuestion when resuming an assessment', () => {
    component.assessment = assessments[0];
    component.assessment.state = AssessmentStates.IN_PROGRESS;
    component.assessment.questionAnswers = [questionAnswer];
    spyOn(component, 'updateSentQuestion');
    component.getCurrentQuestion();
    expect(component.updateSentQuestion).toHaveBeenCalledWith(questionAnswer);
  });

  it('does not call updateSentQuestion when resuming if assessment not in progress', () => {
    component.assessment = assessments[0];
    component.assessment.state = AssessmentStates.NOT_STARTED;
    component.assessment.questionAnswers = [questionAnswer];
    spyOn(component, 'updateSentQuestion');
    component.getCurrentQuestion();
    expect(component.updateSentQuestion).toHaveBeenCalledTimes(0);
  });

  it('does not call updateSentQuestion when resuming if questionAnswers is empty', () => {
    component.assessment = assessments[0];
    component.assessment.state = AssessmentStates.IN_PROGRESS;
    component.assessment.questionAnswers = [];
    spyOn(component, 'updateSentQuestion');
    component.getCurrentQuestion();
    expect(component.updateSentQuestion).toHaveBeenCalledTimes(0);
  });

  // TODO: fix this.
  // it('updateSentQuestion should set sentQuestion if there is a match', () => {
  //   component.questions = questions;
  //   component.updateSentQuestion(questionAnswer);
  //   expect(component.sentQuestion).toBe(questions[0]);
  //   expect(component.questionBody).toBe(questionAnswer.answer);
  // });

  it('updateSentQuestion should not set sentQuestion if there is not a match', () => {
    component.questions = questions;
    const wrongAnswer = questionAnswer;
    wrongAnswer.title = 'wrong_title';
    component.updateSentQuestion(wrongAnswer);
    expect(component.sentQuestion).toBeUndefined();
    expect(component.questionBody).toBeUndefined();
  });

  it('updateSentQuestion should use body if param is NewQuestionEvent', () => {
    component.questions = questions;
    component.updateSentQuestion(newQuestionEvent);
    expect(component.sentQuestion).toBe(questions[0]);
    expect(component.questionBody).toBe(newQuestionEvent.body);
  });

  it('should update assessment.rating onRatingChange', () => {
    component.assessment = assessments[0];
    component.assessment.rating = 1;
    component.onRatingChange({rating: 5});
    expect(component.assessment.rating).toEqual(5);
  });
});
