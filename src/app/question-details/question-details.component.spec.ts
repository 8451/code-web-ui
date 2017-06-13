import { Observable } from 'rxjs/Observable';
import { QuestionService } from './../services/question/question.service';
import { Question } from './../domains/question';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { QuestionDetailsComponent } from './question-details.component';
import { AppModule } from '../app.module';


describe('QuestionDetailsComponent', () => {
  let spy: any;
  let questionService: QuestionService;
  let component: QuestionDetailsComponent;
  let fixture: ComponentFixture<QuestionDetailsComponent>;
  let question: Question = {
      "id": "id1",
      "title": "Title1",
      "difficulty": 2,
      "body": "Body1",
      "suggestedAnswer": "SuggestedAnswer1",
      "createdBy": "createdBy1",
      "createdDate" : null,
      "modifiedBy": "modifiedBy1",
      "modifiedDate": null
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule,
      RouterTestingModule,
      FormsModule],
      providers: [ QuestionService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be an invalid form if the title is empty', () => {
      questionService = fixture.debugElement.injector.get(QuestionService);
      spy = spyOn(questionService, 'getQuestion').and.returnValue(Observable.of(question));
      component.ngOnInit();


      fixture.whenStable().then(() => { // wait for async getQuote
        component.question.title = ''; //Invalidates the title field
        fixture.detectChanges();        // update view with quote
        
        expect(component.questionForm.valid).toBeFalsy();
      });
  })

});
