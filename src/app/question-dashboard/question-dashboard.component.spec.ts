import { AlertService } from './../services/alert/alert.service';
import { QuestionResponse } from './../domains/question-response';
import { AuthService } from './../services/auth/auth.service';
import { HttpModule, ResponseOptions } from '@angular/http';
import { QuestionListItemComponent } from './../question-list-item/question-list-item.component';
import { Observable } from 'rxjs/Observable';
import { QuestionService } from './../services/question/question.service';

import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { async, fakeAsync, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { QuestionDashboardComponent } from './question-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, PageEvent } from '@angular/material';
import { routes } from '../app-routing.module';
import { LanguageChipComponent } from '../language-chip/language-chip.component';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('QuestionDashboardComponent', () => {
  let component: QuestionDashboardComponent;
  let fixture: ComponentFixture<QuestionDashboardComponent>;
  let alertService: AlertService;
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

  const errorResponse = new Response(new ResponseOptions({ status: 500, body: null }));

  const mockQuestionResponse: QuestionResponse = {
    questions: questions,
    paginationTotalElements: questions.length
  };

  const mockPageEvent: PageEvent = {
    pageIndex: 1,
    pageSize: 5,
    length: 15,
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

  let searchSpy: any;
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
        AlertService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { url: Observable.of([{ path: 'questions' }]) } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(QuestionDashboardComponent);
    alertService = fixture.debugElement.injector.get(AlertService);
    component = fixture.debugElement.componentInstance;
    questionService = fixture.debugElement.injector.get(QuestionService);
    searchSpy = spyOn(questionService, 'searchQuestions').and.returnValue(Observable.of(mockQuestionResponse));
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

  it('should call searchQuestion()', fakeAsync(() => {
    component.searchQuestion('');
    expect(questionService.searchQuestions).toHaveBeenCalledWith(0, component.pageSize, 'title', '');
  }));

  it('should handle errors if searchQuestion() has errors', async(() => {
    searchSpy.and.returnValue(Observable.throw(errorResponse));
    spyOn(alertService, 'error');

    component.searchQuestion('');

    expect(alertService.error).toHaveBeenCalled();
  }));

  it('should handle errors if getQuestions() has errors', async(() => {
    searchSpy.and.returnValue(Observable.throw(errorResponse));
    spyOn(alertService, 'error');

    component.getQuestions();

    expect(alertService.error).toHaveBeenCalled();
  }));

  it('a new page event should navigate to a new page of results', async(() => {
    component.searchQuestion('');
    component.pageEvent = mockPageEvent;
    expect(questionService.searchQuestions).toHaveBeenCalled();
    expect(component.pageEvent.pageIndex).toEqual(1);
  }));
});
