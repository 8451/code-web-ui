import { Observable } from 'rxjs/Observable';
import { QuestionService } from './../services/question/question.service';
import { Question } from './../domains/question';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
  }

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
});
