import { Question } from './../../domains/question';
import { Observable } from 'rxjs/Observable';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend, ConnectionBackend, BaseRequestOptions } from '@angular/http';
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

const mockError = {
      'statusText': 'error'
};


describe('QuestionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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


  it('getQuestions() should return a list of questions', fakeAsync(inject([Http, MockBackend], (http: Http, mockBackend: MockBackend) => {
    const questionService = new QuestionService(http);

    mockBackend.connections.subscribe(connection => {
      const response = new ResponseOptions({ body: mockQuestions });
      connection.mockRespond(new Response(response));
    });
    questionService.getQuestions().subscribe((questions: Question[]) => {
      expect(questions.length).toEqual(2, 'should contain 2 questions');
      expect(questions[0].id).toEqual(mockQuestions.questions[0].id, 'question id should match');
      expect(questions[0].title).toEqual(mockQuestions.questions[0].title, 'question title should match');
      expect(questions[0].difficulty).toEqual(mockQuestions.questions[0].difficulty, 'question difficulty should match');
      expect(questions[0].body).toEqual(mockQuestions.questions[0].body, 'question body should match');
      expect(questions[0].suggestedAnswer).toEqual(mockQuestions.questions[0].suggestedAnswer, 'question suggestedAnswer should match');
      expect(questions[0].createdBy).toEqual(mockQuestions.questions[0].createdBy, 'question createdBy should match');
      expect(questions[0].createdDate).toEqual(mockQuestions.questions[0].createdDate, 'question createdDate should match');
      expect(questions[0].modifiedBy).toEqual(mockQuestions.questions[0].modifiedBy, 'question modifiedBy should match');
      expect(questions[0].modifiedDate).toEqual(mockQuestions.questions[0].modifiedDate, 'question modifiedDate should match');

      expect(questions[1].id).toEqual(mockQuestions.questions[1].id, 'question id should match');
      expect(questions[1].title).toEqual(mockQuestions.questions[1].title, 'question title should match');
      expect(questions[1].difficulty).toEqual(mockQuestions.questions[1].difficulty, 'question difficulty should match');
      expect(questions[1].body).toEqual(mockQuestions.questions[1].body, 'question body should match');
      expect(questions[1].suggestedAnswer).toEqual(mockQuestions.questions[1].suggestedAnswer, 'question suggestedAnswer should match');
      expect(questions[1].createdBy).toEqual(mockQuestions.questions[1].createdBy, 'question createdBy should match');
      expect(questions[1].createdDate).toEqual(mockQuestions.questions[1].createdDate, 'question createdDate should match');
      expect(questions[1].modifiedBy).toEqual(mockQuestions.questions[1].modifiedBy, 'question modifiedBy should match');
      expect(questions[1].modifiedDate).toEqual(mockQuestions.questions[1].modifiedDate, 'question modifiedDate should match');
    });
  })));


  it('getQuestion() should return a question', fakeAsync(inject([Http, MockBackend], (http: Http, mockBackend: MockBackend) => {
    const questionService = new QuestionService(http);

    mockBackend.connections.subscribe(connection => {
      const response = new ResponseOptions({ body: mockQuestion });
      connection.mockRespond(new Response(response));
    });

    questionService.getQuestion(mockQuestion.questions[0].id).subscribe((question: Question) => {

      expect(question.id).toEqual(mockQuestion.questions[0].id, 'question id should match');
      expect(question.title).toEqual(mockQuestion.questions[0].title, 'question title should match');
      expect(question.difficulty).toEqual(mockQuestion.questions[0].difficulty, 'question difficulty should match');
      expect(question.body).toEqual(mockQuestion.questions[0].body, 'question body should match');
      expect(question.suggestedAnswer).toEqual(mockQuestion.questions[0].suggestedAnswer, 'question suggestedAnswer should match');
      expect(question.createdBy).toEqual(mockQuestion.questions[0].createdBy, 'question createdBy should match');
      expect(question.createdDate).toEqual(mockQuestion.questions[0].createdDate, 'question createdDate should match');
      expect(question.modifiedBy).toEqual(mockQuestion.questions[0].modifiedBy, 'question modifiedBy should match');
      expect(question.modifiedDate).toEqual(mockQuestion.questions[0].modifiedDate, 'question modifiedDate should match');
    });
  })));

  it('createQuestion() should create and return a question', fakeAsync(inject(
    [Http, MockBackend],
    (http: Http, mockBackend: MockBackend) => {

      const questionService = new QuestionService(http);

      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockQuestion });
        connection.mockRespond(new Response(response));
      });

      questionService.createQuestion(mockQuestion.questions[0]).subscribe((question: Question) => {

        expect(question.id).toEqual(mockQuestion.questions[0].id, 'question id should match');
        expect(question.title).toEqual(mockQuestion.questions[0].title, 'question title should match');
        expect(question.difficulty).toEqual(mockQuestion.questions[0].difficulty, 'question difficulty should match');
        expect(question.body).toEqual(mockQuestion.questions[0].body, 'question body should match');
        expect(question.suggestedAnswer).toEqual(mockQuestion.questions[0].suggestedAnswer, 'question suggestedAnswer should match');
        expect(question.createdBy).toEqual(mockQuestion.questions[0].createdBy, 'question createdBy should match');
        expect(question.createdDate).toEqual(mockQuestion.questions[0].createdDate, 'question createdDate should match');
        expect(question.modifiedBy).toEqual(mockQuestion.questions[0].modifiedBy, 'question modifiedBy should match');
        expect(question.modifiedDate).toEqual(mockQuestion.questions[0].modifiedDate, 'question modifiedDate should match');
      });
    })));


  it('updateQuestion() should update and existing question', fakeAsync(inject(
    [Http, MockBackend],
    (http: Http, mockBackend: MockBackend) => {

      const questionService = new QuestionService(http);

      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockQuestion });
        connection.mockRespond(new Response(response));
      });

      questionService.updateQuestion(mockQuestion.questions[0]).subscribe((question: Question) => {

        expect(question.id).toEqual(mockQuestion.questions[0].id, 'question id should match');
        expect(question.title).toEqual(mockQuestion.questions[0].title, 'question title should match');
        expect(question.difficulty).toEqual(mockQuestion.questions[0].difficulty, 'question difficulty should match');
        expect(question.body).toEqual(mockQuestion.questions[0].body, 'question body should match');
        expect(question.suggestedAnswer).toEqual(mockQuestion.questions[0].suggestedAnswer, 'question suggestedAnswer should match');
        expect(question.createdBy).toEqual(mockQuestion.questions[0].createdBy, 'question createdBy should match');
        expect(question.createdDate).toEqual(mockQuestion.questions[0].createdDate, 'question createdDate should match');
        expect(question.modifiedBy).toEqual(mockQuestion.questions[0].modifiedBy, 'question modifiedBy should match');
        expect(question.modifiedDate).toEqual(mockQuestion.questions[0].modifiedDate, 'question modifiedDate should match');
      });
    })));

  it('deleteQuestion() should delete a question', fakeAsync(inject(
    [Http, MockBackend],
    (http: Http, mockBackend: MockBackend) => {

      const questionService = new QuestionService(http);

      mockBackend.connections.subscribe(connection => {
        const response = new ResponseOptions({ body: mockQuestion });
        connection.mockRespond(new Response(response));
      });

      questionService.deleteQuestion(mockQuestion.questions[0].id).subscribe((deleted: Boolean) => {
        expect(deleted).toBeTruthy();
      });
    })));

  it('handleError() should handle a http error', fakeAsync(inject(
    [Http, MockBackend],
    (http: Http, mockBackend: MockBackend) => {

      const questionService = new QuestionService(http);
      const errorResponse = new ResponseOptions({ body: mockError });
      mockBackend.connections.subscribe(connection => {
        connection.mockError(new Error('errorResponse'));
      });

      questionService.handleError(new Response(errorResponse)).subscribe(
        () => { }, error => expect(error).toBeNull()
      );
    })));

});
