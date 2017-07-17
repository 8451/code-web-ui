import { QuestionResponse } from './../domains/question-response';
import { AuthService } from './../services/auth/auth.service';
import { HttpModule } from '@angular/http';
import { QuestionListItemComponent } from './../question-list-item/question-list-item.component';
import { Observable } from 'rxjs/Observable';
import { QuestionService } from './../services/question/question.service';

import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { async, fakeAsync, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { QuestionDashboardComponent } from './question-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { routes } from '../app-routing.module';
import { LanguageChipComponent } from '../language-chip/language-chip.component';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('QuestionDashboardComponent', () => {
  let component: QuestionDashboardComponent;
  let fixture: ComponentFixture<QuestionDashboardComponent>;
  const mockRouter = { navigate: jasmine.createSpy('navigate') };
  const questions: any[] = [
    {
      id: 'id1',
      title: 'Title1',
      body: 'Body1',
      suggestedAnswer: 'SuggestedAnswer1',
      difficulty: 1,
      language: 'java',
      createdBy: 'createdBy1',
      createdDate: null,
      modifiedBy: 'modifiedBy1',
      modifiedDate: null
    },
    {
      id: 'id2',
      title: 'Title2',
      body: 'Body2',
      suggestedAnswer: 'SuggestedAnswer2',
      difficulty: 2,
      language: 'java',
      createdBy: 'createdBy2',
      createdDate: null,
      modifiedBy: 'modifiedBy2',
      modifiedDate: null
    },
    {
      id: 'id3',
      title: 'Title3',
      body: 'Body3',
      suggestedAnswer: 'SuggestedAnswer3',
      difficulty: 3,
      language: 'java',
      createdBy: 'createdBy3',
      createdDate: null,
      modifiedBy: 'modifiedBy3',
      modifiedDate: null
    }

  ];

  const mockQuestionResponse: QuestionResponse = {
    questions: questions,
    paginationTotalElements: questions.length
  };

  const question = {
    id: 'id1',
    title: 'Title1',
    body: 'Body1',
    suggestedAnswer: 'SuggestedAnswer1',
    difficulty: 5,
    language: 'java',
    createdBy: 'createdBy1',
    createdDate: new Date(1),
    modifiedBy: 'modifiedBy1',
    modifiedDate: new Date(1)
  };

  let spy: any;
  let questionService: QuestionService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionDashboardComponent, QuestionListItemComponent, LanguageChipComponent],
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        RouterTestingModule,
        HttpModule,
      ],
      providers: [
        AuthService,
        QuestionService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { url: Observable.of([{ path: 'questions' }]) } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(QuestionDashboardComponent);
    component = fixture.debugElement.componentInstance;
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'getPageableQuestions').and.returnValue(Observable.of(mockQuestionResponse));
  }));

  it('should create the question dashboard component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('question dashboard component should be populated with a list of questions', (done) => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.questions).toEqual(questions);
      done();
    });
  });

  it('should call goToAddQuestion() and navigate to creating a new question', fakeAsync(() => {
    const route = fixture.debugElement.injector.get(ActivatedRoute);
    component.goToAddQuestion();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../question/new'], { relativeTo: route });
  }));

  it('should call goToQuestionDetails() and navigate to viewing question details', fakeAsync(() => {
    const route = fixture.debugElement.injector.get(ActivatedRoute);
    component.goToQuestionDetails(question);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../question', question.id], { relativeTo: route });
  }));
});
