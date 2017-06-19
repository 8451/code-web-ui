import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NewAssessmentDialogComponent } from './new-assessment-dialog.component';

import { FormsModule } from '@angular/forms';
import { Headers, Http, BaseRequestOptions, XHRBackend } from '@angular/http';
import { MockBackend} from '@angular/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { MdDialogRef, MdInputModule, MaterialModule } from '@angular/material';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';
import { AssessmentService } from './../services/assessment/assessment.service';
import { Assessment } from './../domains/assessment';
import { Observable } from 'rxjs/Observable';

class MdDialogRefMock {
  close() {};
}

describe('NewAssessmentDialogComponent', () => {
  let component: NewAssessmentDialogComponent;
  let fixture: ComponentFixture<NewAssessmentDialogComponent>;
  const assessment: Assessment = {
    firstName: 'First',
    lastName: 'Last',
    email: 'e@mail.com'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule, FormsModule, BrowserAnimationsModule  ],
      declarations: [ NewAssessmentDialogComponent ],
      providers: [
        { provide: MdDialogRef, useClass: MdDialogRefMock },
        AssessmentService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory:
            (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                return new Http(backend, defaultOptions);
            }
         }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAssessmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('when createAssessment is called, the assessment service should call createAssessment', () => {
    const service = fixture.debugElement.injector.get(AssessmentService);
    spyOn(service, 'createAssessment').and.returnValue(Observable.of(assessment));
    component.assessment = assessment;
    component.createAssessment();
    expect(service.createAssessment).toHaveBeenCalledWith(assessment);
  });


});
