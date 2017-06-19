import { Observable } from 'rxjs/Observable';
import { QuestionService } from './../services/question/question.service';

import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { async, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDashboardComponent } from './question-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { AppModule } from '../app.module';
import { routes } from '../app-routing.module';


describe('QuestionDashboardComponent', () => {
   let component: QuestionDashboardComponent;
   let fixture: ComponentFixture<QuestionDashboardComponent>;
   const questions: any[] = [
       {
           'id': 'id1',
           'title': 'Title1',
           'body': 'Body1',
           'suggestedAnswer': 'SuggestedAnswer1',
           'createdBy': 'createdBy1',
           'createdDate' : null,
           'modifiedBy': 'modifiedBy1',
           'modifiedDate': null
        },
        {
            'id': 'id2',
           'title': 'Title2',
           'body': 'Body2',
           'suggestedAnswer': 'SuggestedAnswer2',
           'createdBy': 'createdBy2',
           'createdDate' : null,
           'modifiedBy': 'modifiedBy2',
           'modifiedDate': null
        },
        {
            'id': 'id3',
           'title': 'Title3',
           'body': 'Body3',
           'suggestedAnswer': 'SuggestedAnswer3',
           'createdBy': 'createdBy3',
           'createdDate' : null,
           'modifiedBy': 'modifiedBy3',
           'modifiedDate': null
        }

   ];

  let spy: any;
  let questionService: QuestionService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        AppModule,
        RouterTestingModule
      ],
      providers: [ QuestionService ]
    }).compileComponents();
    fixture = TestBed.createComponent(QuestionDashboardComponent);
    component = fixture.debugElement.componentInstance;
  }));


  it('should create the question dashboard component', async(() => {
    expect(component).toBeTruthy();
  }), 10000);

  it('question dashboard component should be populated with a list of questions', async(() => {
    questionService = fixture.debugElement.injector.get(QuestionService);
    spy = spyOn(questionService, 'getQuestions').and.returnValue(Observable.of(questions));
    component.ngOnInit();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.questions).toEqual(questions);
    });
  }), 10000);

});
