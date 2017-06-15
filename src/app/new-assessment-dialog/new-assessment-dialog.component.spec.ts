import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssessmentDialogComponent } from './new-assessment-dialog.component';

import { FormsModule } from '@angular/forms';
import { Headers, Http, BaseRequestOptions, XHRBackend } from '@angular/http';
import { MockBackend} from '@angular/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { MdDialogRef, MdInputModule, MaterialModule } from '@angular/material';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';
import { AssessmentService } from './../services/assessment/assessment.service';
import { Assessment } from './../domains/assessment';

class MdDialogRefMock {

}

describe('NewAssessmentDialogComponent', () => {
  let component: NewAssessmentDialogComponent;
  let fixture: ComponentFixture<NewAssessmentDialogComponent>;

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


});
