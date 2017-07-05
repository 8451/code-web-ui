import { NewQuestionEvent } from 'app/domains/events/web-socket-event';
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
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, Validators, NgForm, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { InterviewAssessmentComponent } from './interview-assessment.component';
import { MaterialModule, MdDialog, MdDialogRef, OverlayRef } from '@angular/material';

describe('InterviewAssessmentComponent', () => {
  let component: InterviewAssessmentComponent;
  let fixture: ComponentFixture<InterviewAssessmentComponent>;
  let questionService: QuestionService;
  let alertService: AlertService;
  const assessments: Assessment[] = [{
    id: null,
    firstName: 'first',
    lastName: 'lastName',
    email: 'e@mail.com',
    interviewGuid: 'testGuid',
    state: AssessmentStates.NOT_STARTED,
    notes: 'notes'
  }];

  const mockStomp = {
    configure(object: any) {},
    startConnect() {return Promise.resolve(); },
    done(queue: string) {},
    after(queue: string) {return Promise.resolve(); },
    subscribe(address: string, fun: (data: any) => void ) {},
    send(data: any) {}
  };

  const mockAssessmentWebSocketService = {
    sendNewQuestion(guid: string, question: NewQuestionEvent) {}
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
        { provide: StompService, useValue: mockStomp },
        { provide: AssessmentWebSocketService, useValue: mockAssessmentWebSocketService },
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
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should populate with a list of questions', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spyOn(questionService, 'getQuestions').and.returnValue(Observable.of(questions));

    component.getQuestions();

    expect(component.questions).toBe(questions);
  }));

  it('should display toast when error occurs in getQuestions', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spyOn(questionService, 'getQuestions').and.returnValue(
      Observable.throw(new Response(new ResponseOptions({ status: 500, body: null })))
    );

    alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'error');

    component.getQuestions();
    expect(alertService.error).toHaveBeenCalled();
  }));

  it('should set selectedQuestion', () => {
    component.selectQuestion(questions[0]);
    expect(component.selectedQuestion).toBe(questions[0]);
  });

  it('should open up a dialog', () => {
    component.selectedQuestion = questions[0];

    component.previewQuestion();
    component.dialog.afterOpen.subscribe(data => {
      expect(component.dialogRef.componentInstance.question).toBe(questions[0]);
    });
  });

  it('should set sentQuestion', inject([AssessmentWebSocketService],
  (assessmentWebSocketService: AssessmentWebSocketService) => {
    component.selectedQuestion = questions[0];
    component.assessment = assessments[0];
    spyOn(assessmentWebSocketService, 'sendNewQuestion');
    component.sendQuestion();
    expect(component.sentQuestion).toBe(questions[0]);
    expect(assessmentWebSocketService.sendNewQuestion).toHaveBeenCalled();
  }));
});