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

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('QuestionDashboardComponent', () => {
  let component: QuestionDashboardComponent;
  let fixture: ComponentFixture<QuestionDashboardComponent>;
  const mockRouter = { navigate: jasmine.createSpy('navigate') };
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

  const question = {
    'id': 'id1',
    'title': 'Title1',
    'body': 'Body1',
    'suggestedAnswer': 'SuggestedAnswer1',
    'difficulty': 5,
    'createdBy': 'createdBy1',
    'createdDate': new Date(1),
    'modifiedBy': 'modifiedBy1',
    'modifiedDate': new Date(1)
  };

  let spy: any;
  let questionService: QuestionService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionDashboardComponent, QuestionListItemComponent],
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
  }));


  it('should create the question dashboard component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('question dashboard component should be populated with a list of questions', (done) => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'getQuestions').and.returnValue(Observable.of(questions));
    component.ngOnInit();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.questions).toEqual(questions);
      done();
    });
  });
});
