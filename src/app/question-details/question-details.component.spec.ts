import { AlertService } from './../services/alert/alert.service';
import { Observable } from 'rxjs/Observable';
import { QuestionService } from './../services/question/question.service';
import { Question } from './../domains/question';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { QuestionDetailsComponent } from './question-details.component';
import { AppModule } from '../app.module';
import { ActivatedRoute, Params, Router, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

describe('QuestionDetailsComponent', () => {
  let spy: any;
  let questionService: QuestionService;
  let component: QuestionDetailsComponent;
  let fixture: ComponentFixture<QuestionDetailsComponent>;

  let question: Question = {
    'id': 'id1',
    'title': 'Title1',
    'difficulty': 2,
    'body': 'Body1',
    'suggestedAnswer': 'SuggestedAnswer1',
    'createdBy': 'createdBy1',
    'createdDate': null,
    'modifiedBy': 'modifiedBy1',
    'modifiedDate': null
  };
  let titleControl;
  let bodyControl;
  let answerControl;
  let difficultyControl;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule,
        RouterTestingModule,
        FormsModule],
      providers: [QuestionService,
        { provide: ActivatedRoute, useValue: { url: Observable.of([{ path: 'new' }]) } },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionDetailsComponent);
    component = fixture.componentInstance;
    question = {
      'id': 'id1',
      'title': 'Title1',
      'difficulty': 2,
      'body': 'Body1',
      'suggestedAnswer': 'SuggestedAnswer1',
      'createdBy': 'createdBy1',
      'createdDate': null,
      'modifiedBy': 'modifiedBy1',
      'modifiedDate': null
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be an invalid form if the title is empty', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'getQuestion').and.returnValue(Observable.of(question));

    fixture.detectChanges();

    fixture.whenStable().then(() => { // wait for async getQuestion
      titleControl = component.questionForm.control.get('title');
      bodyControl = component.questionForm.control.get('body');
      answerControl = component.questionForm.control.get('suggestedAnswer');
      difficultyControl = component.questionForm.control.get('difficulty');

      fixture.detectChanges();

      titleControl.setValue(question.title);
      bodyControl.setValue(question.body);
      answerControl.setValue(question.suggestedAnswer);
      difficultyControl.setValue(question.difficulty);

      titleControl.setValue(''); // Invalidates the title field
      fixture.detectChanges();        // update question with the new title
      expect(titleControl.valid).toBeFalsy();
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error('Caught error inavlid form if title is empty', e);
    });
  }));

  it('should be an invalid form if the question body is empty', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'getQuestion').and.returnValue(Observable.of(question));

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      bodyControl = component.questionForm.control.get('body');

      fixture.detectChanges();

      bodyControl.setValue('');

      fixture.detectChanges();
      expect(bodyControl.valid).toBeFalsy();
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error('Caught error invalid form if body is empty', e);
    });
  }));

  it('should be a valid form if the question is valid', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'getQuestion').and.returnValue(Observable.of(question));

    // allow the form to set itself up
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      titleControl = component.questionForm.control.get('title');
      bodyControl = component.questionForm.control.get('body');
      answerControl = component.questionForm.control.get('suggestedAnswer');
      difficultyControl = component.questionForm.control.get('difficulty');

      fixture.detectChanges();

      titleControl.setValue(question.title);
      bodyControl.setValue(question.body);
      answerControl.setValue(question.suggestedAnswer);
      difficultyControl.setValue(question.difficulty);

      fixture.detectChanges();

      expect(titleControl.valid).toBe(true);
      expect(bodyControl.valid).toBe(true);
      expect(answerControl.valid).toBe(true);
      expect(difficultyControl.valid).toBe(true);
      expect(component.questionForm.valid).toBe(true);
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error('Caught error valid form', e);
    });
  }));

  it('should display a save button when a question is modified', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'getQuestion').and.returnValue(Observable.of(question));

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.question = question;
      component.isNew = false;
      fixture.detectChanges();
      const button = fixture.debugElement.nativeElement.querySelector('#save-question-btn');
      expect(button).toBeTruthy(); // Ensure the button exists
      expect(button.textContent).toContain('Save'); // ensure the button says save
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  }));

  it('should display an add button when a question is modified', async(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      component.question = question;
      component.isNew = true; // Set the new property so the question is new
      fixture.detectChanges();
      const button = fixture.debugElement.nativeElement.querySelector('#add-question-btn');
      expect(button).toBeTruthy(); // Ensure the button exists
      expect(button.textContent).toContain('Add'); // ensure the button says save
    }).catch((e) => {
      expect(true).toBeFalsy();
    });
  }));

  it('should call deleteQuestion when the delete button is pressed', async(() => inject([Router], (router) => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    const alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(component, 'deleteQuestion');
    spyOn(questionService, 'deleteQuestion');
    spyOn(alertService, 'confirmation').and.returnValue(Observable.of(true));
    spyOn(router, 'navigate');

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      component.question = question;
      fixture.detectChanges();
      const deleteBtn = fixture.debugElement.nativeElement.querySelector('#delete-question-btn');
      expect(deleteBtn).toBeTruthy();
      deleteBtn.click();
      expect(component.deleteQuestion).toHaveBeenCalled();
      expect(questionService.deleteQuestion).toHaveBeenCalled();
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  })));

  it('should call createQuestion if a new question is submitted', async(() => inject([Router], (router) => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spyOn(questionService, 'createQuestion').and.returnValue(Observable.of(question).map(res => res));
    spyOn(router, 'navigate');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      component.question = question;
      component.isNew = true;
      fixture.detectChanges();
      component.submitQuestion();
      expect(questionService.createQuestion).toHaveBeenCalled();
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  })));

  it('should call updateQustion if an existing question is submitted', async(() => inject([Router], (router) => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spyOn(questionService, 'updateQuestion').and.returnValue(Observable.of(question));
    spyOn(router, 'navigate');

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      component.question = question;
      component.isNew = false;

      fixture.detectChanges();
      component.submitQuestion();
      expect(component.isNew).toBe(false);
      expect(questionService.updateQuestion).toHaveBeenCalled();
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  })));
});
