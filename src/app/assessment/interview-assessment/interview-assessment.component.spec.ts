import { QuestionService } from './../../services/question/question.service';
import { QuestionInfoDialogComponent } from './../../question-info-dialog/question-info-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { QuestionListItemComponent } from './../../question-list-item/question-list-item.component';
import { AuthService } from './../../services/auth/auth.service';
import { HttpModule } from '@angular/http';
import { Assessment } from './../../domains/assessment';
import { AssessmentService } from './../../services/assessment/assessment.service';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, Validators, NgForm, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { InterviewAssessmentComponent } from './interview-assessment.component';
import { MaterialModule, MdIconModule, MdDialogModule, MdDialogRef, MdDialog, OverlayRef} from '@angular/material';

fdescribe('InterviewAssessmentComponent', () => {
  let component: InterviewAssessmentComponent;
  let fixture: ComponentFixture<InterviewAssessmentComponent>;
  const assessments: Assessment[] = [{
    id: null,
    firstName: 'first',
    lastName: 'lastName',
    email: 'e@mail.com',
    interviewGuid: 'testGuid',
    active: false
  }];

  class MdDialogRefMock {
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InterviewAssessmentComponent, QuestionListItemComponent, QuestionInfoDialogComponent],
      imports: [
        HttpModule,
        RouterTestingModule,
        FormsModule,
        MdIconModule,
      ],
      providers: [
        AuthService,
        AssessmentService,
        QuestionService,
        MdDialog,
        MdDialogModule,
        { provide: ActivatedRoute, useValue: { params: Observable.from([{ 'guid': '1234' }]) } },
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [QuestionInfoDialogComponent]
        }
      })
      .overrideComponent(QuestionInfoDialogComponent, {
        set: {
          template: '<span>QuestionInfoDialogComponent</span>',
          providers: []
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewAssessmentComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    const assessmentService = fixture.debugElement.injector.get(AssessmentService);
    spyOn(assessmentService, 'getAssessmentByGuid').and.returnValue(Observable.of(this.assesments));
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
