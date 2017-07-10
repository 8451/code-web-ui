import { QuestionResponse } from './../../domains/question-response';
import { AuthService } from './../auth/auth.service';
import { Question } from './../../domains/question';
import { Observable } from 'rxjs/Observable';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend, ConnectionBackend, BaseRequestOptions, 
  URLSearchParams } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { TestBed, inject, fakeAsync, async } from '@angular/core/testing';

import { QuestionService } from './question.service';

const mockQuestions = {
  'questions': [
    {
      'id': 'id1',
      'title': 'Title1',
      'difficulty': 2,
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
      'difficulty': 3,
      'body': 'Body2',
      'suggestedAnswer': 'SuggestedAnswer2',
      'createdBy': 'createdBy2',
      'createdDate': null,
      'modifiedBy': 'modifiedBy2',
      'modifiedDate': null
    }
  ]
};

const mockQuestion = {
  'questions': [
    {
      'id': 'id1',
      'title': 'Title1',
      'difficulty': 2,
      'body': 'Body1',
      'suggestedAnswer': 'SuggestedAnswer1',
      'createdBy': 'createdBy1',
      'createdDate': null,
      'modifiedBy': 'modifiedBy1',
      'modifiedDate': null
    }
  ]
};

const mockQuestionResponse: QuestionResponse = {
  questions: [
    {
      'id': 'id1',
      'title': 'Title1',
      'difficulty': 2,
      'body': 'Body1',
      'suggestedAnswer': 'SuggestedAnswer1',
      'createdBy': 'createdBy1',
      'createdDate': null,
      'modifiedBy': 'modifiedBy1',
      'modifiedDate': null
    }
  ],
  paginationTotalElements: 1
};

const mockError = {
   body: {'statusText': 'error'},
   status: 404,
   statusText: '404 Not Found'
  };

const mockAuthService = {
    logout() {},
    getHeaders() {},
    login(username: string, password: string) {},
    isLoggedIn() {},
    getToken() {}
  };


describe('QuestionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService},
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
      expect(questions.length).toEqual(2, 'should contain 2 questions');
      compareQuestions(mockQuestions.questions[0], questions[0]);
      compareQuestions(mockQuestions.questions[1], questions[1]);
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
      expect(questionResponse.paginationTotalElements).toBe(1, 'should have 1 total elements');
      expect(questionResponse.questions.length).toBe(1, 'should have 1 question in list');
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

      compareQuestions(mockQuestion.questions[0], question);
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
        compareQuestions(mockQuestion.questions[0], question);
      });
    })));


  it('updateQuestion() should update and existing question', fakeAsync(inject(
    [Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {

      const questionService = new QuestionService(http, authService);

      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockQuestion });
        connection.mockRespond(new Response(response));
      });

      questionService.updateQuestion(mockQuestion.questions[0]).subscribe((question: Question) => {
        compareQuestions(mockQuestion.questions[0], question);
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

  function compareQuestions(expectedQuestion: Question, actualQuestion: Question): void {
    expect(expectedQuestion.id).toEqual(actualQuestion.id, 'question id should match');
    expect(expectedQuestion.title).toEqual(actualQuestion.title, 'question title should match');
    expect(expectedQuestion.difficulty).toEqual(actualQuestion.difficulty, 'question difficulty should match');
    expect(expectedQuestion.body).toEqual(actualQuestion.body, 'question body should match');
    expect(expectedQuestion.suggestedAnswer).toEqual(actualQuestion.suggestedAnswer, 'question suggestedAnswer should match');
    expect(expectedQuestion.createdBy).toEqual(actualQuestion.createdBy, 'question createdBy should match');
    expect(expectedQuestion.createdDate).toEqual(actualQuestion.createdDate, 'question createdDate should match');
    expect(expectedQuestion.modifiedBy).toEqual(actualQuestion.modifiedBy, 'question modifiedBy should match');
    expect(expectedQuestion.modifiedDate).toEqual(actualQuestion.modifiedDate, 'question modifiedDate should match');
  };

});
