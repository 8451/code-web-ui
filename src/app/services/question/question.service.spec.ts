import { QuestionResponse } from './../../domains/question-response';
import { AuthService } from './../auth/auth.service';
import { Question } from './../../domains/question';
import { Observable } from 'rxjs/Observable';
import {
  HttpModule, Http, Response, ResponseOptions, XHRBackend, ConnectionBackend, BaseRequestOptions,
  URLSearchParams
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { TestBed, inject, fakeAsync, async } from '@angular/core/testing';

import { QuestionService } from './question.service';

const mockQuestions = {
  questions: [
    {
      id: 'id1',
      title: 'Title1',
      body: 'Body1',
      difficulty: 1,
      language: 'java',
      suggestedAnswer: 'SuggestedAnswer1',
      createdBy: 'createdBy1',
      createdDate: null,
      modifiedBy: 'modifiedBy1',
      modifiedDate: null
    },
    {
      id: 'id2',
      title: 'Title2',
      body: 'Body2',
      difficulty: 2,
      language: 'java',
      suggestedAnswer: 'SuggestedAnswer2',
      createdBy: 'createdBy2',
      createdDate: null,
      modifiedBy: 'modifiedBy2',
      modifiedDate: null
    }
  ]
};

const mockQuestion = {
  questions: [
    {
      id: 'id1',
      title: 'Title1',
      body: 'Body1',
      difficulty: 1,
      language: 'java',
      suggestedAnswer: 'SuggestedAnswer1',
      createdBy: 'createdBy1',
      createdDate: null,
      modifiedBy: 'modifiedBy1',
      modifiedDate: null
    }
  ]
};

const mockQuestionResponse: QuestionResponse = {
  questions: mockQuestions.questions,
  paginationTotalElements: mockQuestions.questions.length
};

const mockLanguages = {
  languages: [
    'Java 7',
    'Java 8',
    'C',
    'C#',
    'Python',
    'JavaScript',
    'Scala',
    'Kotlin',
    'BrainF*ck',
    'C++'
  ]
};

const mockError = {
  body: { 'statusText': 'error' },
  status: 404,
  statusText: '404 Not Found'
};

const mockAuthService = {
  logout() { },
  getHeaders() { },
  login(username: string, password: string) { },
  isLoggedIn() { },
  getToken() { }
};

function compareQuestions(actual, expected): void {
  expect(actual.id).toEqual(expected.id, 'question id should match');
  expect(actual.title).toEqual(expected.title, 'question title should match');
  expect(actual.body).toEqual(expected.body, 'question body should match');
  expect(actual.difficulty).toEqual(expected.difficulty, 'question difficulty should match');
  expect(actual.language).toEqual(expected.language, 'question language should match');
  expect(actual.suggestedAnswer).toEqual(expected.suggestedAnswer, 'question suggestedAnswer should match');
  expect(actual.createdBy).toEqual(expected.createdBy, 'question createdBy should match');
  expect(actual.createdDate).toEqual(expected.createdDate, 'question createdDate should match');
  expect(actual.modifiedBy).toEqual(expected.modifiedBy, 'question modifiedBy should match');
  expect(actual.modifiedDate).toEqual(expected.modifiedDate, 'question modifiedDate should match');
}

describe('QuestionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: Http, useFactory: (
            backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        },
        MockBackend,
        BaseRequestOptions,
        QuestionService
      ],
    });
  });

  it('should be created', inject([QuestionService], (service: QuestionService) => {
    expect(service).toBeTruthy();
  }));


  it('getQuestions() should return a list of questions', fakeAsync(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      const questionService = new QuestionService(http, authService);

      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockQuestions });
        connection.mockRespond(new Response(response));
      });
      questionService.getQuestions().subscribe((questions: Question[]) => {

        expect(questions.length).toEqual(mockQuestions.questions.length, 'should contain 2 questions');

        for (const i in mockQuestions.questions) {
          if (mockQuestions.questions.hasOwnProperty(i)) {
            compareQuestions(questions[i], mockQuestions.questions[i]);
          }
        }
      });
    })));

  it('getPageableQuestions() should return a question-response', fakeAsync(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      const questionService = new QuestionService(http, authService);

      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockQuestionResponse });
        connection.mockRespond(new Response(response));
      });

      questionService.getPageableQuestions(0, 20, 'title').subscribe((questionResponse: QuestionResponse) => {
        expect(questionResponse.paginationTotalElements).toBe(mockQuestions.questions.length, 'should have 2 total elements');
        expect(questionResponse.questions.length).toBe(mockQuestions.questions.length, 'should have 2 question in list');
        compareQuestions(mockQuestionResponse.questions[0], questionResponse.questions[0]);
      });
    })));

    it('searchQuestions() should return a question-response', fakeAsync(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      const questionService = new QuestionService(http, authService);

      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockQuestionResponse });
        connection.mockRespond(new Response(response));
      });

      questionService.searchQuestions(0, 20, 'title', 'search').subscribe((questionResponse: QuestionResponse) => {
        expect(questionResponse.paginationTotalElements).toBe(mockQuestions.questions.length, 'should have 2 total elements');
        expect(questionResponse.questions.length).toBe(mockQuestions.questions.length, 'should have 2 question in list');
        compareQuestions(mockQuestionResponse.questions[0], questionResponse.questions[0]);
      });
    })));

  it('getQuestion() should return a question', fakeAsync(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      const questionService = new QuestionService(http, authService);

      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockQuestion });
        connection.mockRespond(new Response(response));
      });

      questionService.getQuestion(mockQuestion.questions[0].id).subscribe((question: Question) => {
        compareQuestions(question, mockQuestion.questions[0]);
      });
    })));

  it('createQuestion() should create and return a question', fakeAsync(inject(
    [Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {

      const questionService = new QuestionService(http, authService);

      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockQuestion });
        connection.mockRespond(new Response(response));
      });

      questionService.createQuestion(mockQuestion.questions[0]).subscribe((question: Question) => {
        compareQuestions(question, mockQuestion.questions[0]);
      });
    })));

  it('updateQuestion() should update an existing question', fakeAsync(inject(
    [Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {

      const questionService = new QuestionService(http, authService);

      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockQuestion });
        connection.mockRespond(new Response(response));
      });

      questionService.updateQuestion(mockQuestion.questions[0]).subscribe((question: Question) => {
        compareQuestions(question, mockQuestion.questions[0]);
      });
    })));

  it('deleteQuestion() should delete a question', fakeAsync(inject(
    [Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {

      const questionService = new QuestionService(http, authService);

      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockQuestion });
        connection.mockRespond(new Response(response));
      });

      questionService.deleteQuestion(mockQuestion.questions[0].id).subscribe((deleted: Boolean) => {
        expect(deleted).toBeTruthy();
      });
    })));

  it('handleError() should handle a http error', fakeAsync(inject(
    [Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {

      const questionService = new QuestionService(http, authService);
      const errorResponse = new ResponseOptions(mockError);

      questionService.handleError(new Response(errorResponse)).subscribe(
        () => { }, error => expect(error).toBe('404 Not Found')
      );
    })));

  it('getLanguages() should return a list of languages', fakeAsync(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      const questionService = new QuestionService(http, authService);

      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockLanguages });
        connection.mockRespond(new Response(response));
      });

      questionService.getLanguages().subscribe((languages: string[]) => {

        expect(languages.length).toEqual(mockLanguages.languages.length, 'should contain 10 languages');

        for (const i in mockLanguages.languages) {
          if (mockLanguages.languages.hasOwnProperty(i)) {
            expect(languages[i]).toEqual(mockLanguages.languages[i], 'language should match');
          }
        }
      });
    })));

});
