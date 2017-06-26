import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { AlertService } from './../services/alert/alert.service';
import { Observable } from 'rxjs/Observable';
import { QuestionService } from './../services/question/question.service';
import { Question } from './../domains/question';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ReactiveFormsModule, Validators, NgForm, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { QuestionDetailsComponent } from './question-details.component';
import { ActivatedRoute, Params, Router, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

describe('QuestionDetailsComponent', () => {
  let questionService: QuestionService;
  let alertService: AlertService;
  let component: QuestionDetailsComponent;
  let fixture: ComponentFixture<QuestionDetailsComponent>;
  const mockRouter = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionDetailsComponent],
      imports: [
        HttpModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        ],
      providers: [QuestionService,
        { provide: ActivatedRoute, useValue: { url: Observable.of([{ path: 'new' }]) } },
        { provide: Router, useValue: mockRouter },
        AlertService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionDetailsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    const question = {
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

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('control invalid when title is empty', () => {
    const title = component.form.get('title');
    title.setValue('');
    expect(title.valid).toBeFalsy();
  });

  it('control invalid when body is empty', () => {
    const body = component.form.get('body');
    body.setValue('');
    expect(body.valid).toBeFalsy();
  });

  it('control invalid when difficulty is empty', () => {
    const difficulty = component.form.get('difficulty');
    difficulty.setValue('');
    expect(difficulty.valid).toBeFalsy();
  });

  it('title valid when title is non-empty', () => {
    const title = component.form.get('title');
    title.setValue('testTitle');
    expect(title.valid).toBeTruthy();
  });

  it('control valid when body is non-empty', () => {
    const body = component.form.get('body');
    body.setValue('testBody');
    expect(body.valid).toBeTruthy();
  });

  it('control valid when suggestedAnswer is non-empty', () => {
    const suggestedAnswer = component.form.get('suggestedAnswer');
    suggestedAnswer.setValue('testAnswer');
    expect(suggestedAnswer.valid).toBeTruthy();
  });

  it('control valid when difficulty is non-empty', () => {
    const difficulty = component.form.get('difficulty');
    difficulty.setValue(2);
    expect(difficulty.valid).toBeTruthy();
  });

  it('control invalid when difficulty is not in range 1-5', () => {
    const difficulty = component.form.get('difficulty');
    difficulty.setValue(0);
    expect(difficulty.valid).toBeFalsy();
    difficulty.setValue(6);
    expect(difficulty.valid).toBeFalsy();
    difficulty.setValue(3.5);
    expect(difficulty.valid).toBeFalsy();
    difficulty.setValue(30);
    expect(difficulty.valid).toBeFalsy();
    difficulty.setValue(55);
    expect(difficulty.valid).toBeFalsy();
    difficulty.setValue(-1);
    expect(difficulty.valid).toBeFalsy();
  });

  it('should navigate back to /questions', async(() => {
    component.navigateBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/questions']);
  }));

  it('should call deleteQuestion when the delete button is pressed', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    alertService = fixture.debugElement.injector.get(AlertService);

    spyOn(questionService, 'deleteQuestion').and.returnValue(Observable.of(true));
    spyOn(alertService, 'confirmation').and.returnValue(Observable.of(true));

    fixture.detectChanges();
    component.form.controls['id'].setValue('testID');
    component.deleteQuestion();
    fixture.detectChanges();
    expect(questionService.deleteQuestion).toHaveBeenCalledWith('testID');
  }));

  it('should call createQuestion if a new question is submitted', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spyOn(questionService, 'createQuestion').and.returnValue(Observable.of(this.question));
    component.form.setValue({
      id: 'validID',
      title: 'validTitle',
      body: 'validBody',
      suggestedAnswer: '',
      difficulty: 3,
      createdBy: null,
      createdDate: null,
      modifiedBy: null,
      modifiedDate: null
    });
    component.isNew = true;
    component.submitQuestion();
    expect(questionService.createQuestion).toHaveBeenCalled();
  }));

  it('should call updateQuestion if an existing question is submitted', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spyOn(questionService, 'updateQuestion').and.returnValue(Observable.of(this.question));
    component.form.setValue({
      id: 'validID',
      title: 'validTitle',
      body: 'validBody',
      suggestedAnswer: '',
      difficulty: 3,
      createdBy: null,
      createdDate: null,
      modifiedBy: null,
      modifiedDate: null
    });
    component.isNew = false;
    component.submitQuestion();
    expect(questionService.updateQuestion).toHaveBeenCalled();
  }));

  it('should return without calling anything if the form is invalid', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spyOn(questionService, 'updateQuestion').and.returnValue(Observable.of(this.question));
    spyOn(questionService, 'createQuestion').and.returnValue(Observable.of(this.question));
    component.form.setValue({
      id: 'validID',
      title: 'validTitle',
      body: '', // This is an invalid body
      suggestedAnswer: '',
      difficulty: 3,
      createdBy: null,
      createdDate: null,
      modifiedBy: null,
      modifiedDate: null
    });
    component.isNew = false;
    component.submitQuestion();
    expect(questionService.updateQuestion).toHaveBeenCalledTimes(0);
    expect(questionService.createQuestion).toHaveBeenCalledTimes(0);
  }));
});


