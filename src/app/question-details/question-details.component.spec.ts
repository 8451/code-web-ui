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
  const question: Question = {
      'id': 'id1',
      'title': 'Title1',
      'difficulty': 2,
      'body': 'Body1',
      'suggestedAnswer': 'SuggestedAnswer1',
      'createdBy': 'createdBy1',
      'createdDate' : null,
      'modifiedBy': 'modifiedBy1',
      'modifiedDate': null
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule,
      RouterTestingModule,
      FormsModule],
      providers: [ QuestionService,
        {provide: ActivatedRoute, useValue: {url: Observable.of([{path: 'new'}])}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // TODO These tests aren't working correctly.  The form is always invalid
  it('should be an invalid form if the title is empty', async(() => {
      questionService = fixture.debugElement.injector.get(QuestionService);
      spy = spyOn(questionService, 'getQuestion').and.returnValue(Observable.of(question));

       fixture.whenStable().then(() => { // wait for async getQuestion
        component.question = question;
        component.question.title = ''; // Invalidates the title field
        fixture.detectChanges();        // update question with the new title
        expect(component.questionForm.valid).toBeFalsy();
       }).catch((e) => {
        expect(true).toBeFalsy();
        console.error(e);
      });
  }));

  it('should be an invalid form if the question body is empty', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'getQuestion').and.returnValue(Observable.of(question));

    fixture.whenStable().then(() => {
      component.question = question;
      component.question.body = ''; // Invalidates the body field
      fixture.detectChanges();
      expect(component.questionForm.valid).toBeFalsy();
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  }));

  it('should be a valid form if the question is valid', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'getQuestion').and.returnValue(Observable.of(question));

    // allow the form to set itself up
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      component.question = question;

      // set the title FormControl
      const titleControl = component.questionForm.control.get('title');
      const bodyControl = component.questionForm.control.get('body');
      const answerControl = component.questionForm.control.get('suggestedAnswer');
      const difficultyControl = component.questionForm.control.get('difficulty');

      expect(titleControl).toBeTruthy();

      titleControl.setValue(question.title);
      console.log('title ', titleControl.value);
      bodyControl.setValue(question.body);
      answerControl.setValue(question.suggestedAnswer);
      difficultyControl.setValue(question.difficulty);

      fixture.detectChanges();
      expect(titleControl.valid).toBe(true);
      console.log('title valid: ' + titleControl.valid);
      expect(bodyControl.valid).toBe(true);
      expect(answerControl.valid).toBe(true);
      expect(difficultyControl.valid).toBe(true);
      expect(component.questionForm.valid).toBe(true);
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  }));

  it('should display the correct title in the #title element', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'getQuestion').and.returnValue(Observable.of(question));

    fixture.whenStable().then(() => {
      component.question = question;
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('#title').textContent).toEqual(question.title);
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  }));

  it('should display a save button when a question is modified', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'getQuestion').and.returnValue(Observable.of(question));

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

  it('should submit form when save button is clicked', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'getQuestion').and.returnValue(Observable.of(question));
    spyOn(component.questionForm, 'onSubmit');
    spyOn(component, 'submitQuestion');
    spyOn(component.questionForm, 'valid').and.returnValue(true);

    fixture.whenStable().then(() => {
      component.question = question;
      component.isNew = false;
      const button = fixture.debugElement.nativeElement.querySelector('#save-question-btn');
      expect(button).toBeTruthy(); // Ensure the button exist
      expect(button.isEnabled()).toBe(true); // the button is disabled, which is why the click event won't work
      button.click();
      fixture.detectChanges();
      // expect(component.submitQuestion).toHaveBeenCalled();
      // expect(component.questionForm.onSubmit).toHaveBeenCalled(); // Ensure the submit question has been called
      // expect(component.questionForm.submitted).toBe(true);
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  }));

  it('should display an add button when a question is modified', async(() => {
    fixture.whenStable().then(() => {
      component.question = question;
      component.isNew = true; // Set the new property so the question is new
      fixture.detectChanges();
      const button = fixture.debugElement.nativeElement.querySelector('#add-question-btn');
      expect(button).toBeTruthy(); // Ensure the button exists
      expect(button.textContent).toContain('Add'); // ensure the button says save
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  }));

  it('should submit the form when add button is clicked', async(() => {
    spyOn(component.questionForm, 'onSubmit');

    fixture.whenStable().then(() => {
      component.question = question;
      component.isNew = true; // Set the new property so the question is new
      fixture.detectChanges();
      const button = fixture.debugElement.nativeElement.querySelector('#add-question-btn');
      expect(button).toBeTruthy(); // Ensure the button exists
      expect(button.textContent).toContain('Add'); // ensure the button says save
      button.click();
      expect(component.questionForm.onSubmit).toHaveBeenCalled(); // Ensure the submit question has been called
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  }));

  it('should call deleteQuestion when the delete button is pressed', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spyOn(questionService, 'deleteQuestion');

    fixture.whenStable().then(() => {
      component.question = question;
      fixture.detectChanges();
      const deleteBtn = fixture.debugElement.nativeElement.querySelector('#delete-question-btn');
      expect(deleteBtn).toBeTruthy();
      deleteBtn.click();
      expect(component.deleteQuestion).toHaveBeenCalled();
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  }));

  it('should call submitQuestion when a form is submitted', async(() => {
    spyOn(component, 'submitQuestion');
    fixture.whenStable().then(() => {
      component.question = question;
      fixture.detectChanges();
      const form = fixture.debugElement.nativeElement.querySelector('questionForm');
      expect(form).toBeTruthy();
      // form.onSubmit();
      fixture.detectChanges();
      // expect(component.questionForm.submitted).toBe(true);
      // expect(component.submitQuestion).toHaveBeenCalled();
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  }));

  it('should navigate back to /questions when a question is added', async(() => inject([Router], (router: Router) => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'createQuestion').and.returnValue(Observable.of(question));
    spyOn(router, 'navigate');

    fixture.whenStable().then(() => {
      component.question = question;
      component.isNew = true;
      fixture.detectChanges();
      const form = fixture.debugElement.nativeElement.querySelector('questionForm');
      form.onSubmit();
      expect(router.navigate).toHaveBeenCalledWith(['/questions']);
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  })));

  it('should navigate back to /questions when a question is saved', async(() => inject([Router], (router: Router) => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'updateQuestion').and.returnValue(Observable.of(question));
    spyOn(router, 'navigate');

    fixture.whenStable().then(() => {
      component.question = question;
      fixture.detectChanges();
      const form = fixture.debugElement.nativeElement.querySelector('questionForm');
      form.onSubmit();
      expect(router.navigate).toHaveBeenCalledWith(['/questions']);
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  })));

  it('should navigate back to /questions when a question is deleted', async(() => inject([Router], (router: Router) => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spyOn(questionService, 'deleteQuestion');
    spyOn(router, 'navigate');

    fixture.whenStable().then(() => {
      component.question = question;
      fixture.detectChanges();
      const deleteBtn = fixture.debugElement.nativeElement.querySelector('#delete-question-btn');
      deleteBtn.click();
      expect(component.deleteQuestion).toHaveBeenCalledWith(question.id);
      expect(router.navigate).toHaveBeenCalledWith(['/questions']);
    }).catch((e) => {
      expect(true).toBeFalsy();
      console.error(e);
    });
  })));
});
