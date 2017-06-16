import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { HttpModule } from '@angular/http';
import { AssessmentService } from './../services/assessment/assessment.service';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AssessmentListComponent } from './assessment-list.component';
import { MdDialogModule, MdCardModule, MaterialModule, MdDialogRef,
          MdInputModule, MdDialog, OverlayRef,  MdDialogContainer } from '@angular/material';

import { Assessment } from './../domains/assessment';
import { NewAssessmentDialogComponent } from './../new-assessment-dialog/new-assessment-dialog.component';


describe('AssessmentListComponent', () => {
  let component: AssessmentListComponent;
  let fixture: ComponentFixture<AssessmentListComponent>;
  const assessments: Assessment[] = [{
    firstName: 'first',
    lastName: 'lastName',
    email: 'e@mail.com'
  }];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentListComponent, NewAssessmentDialogComponent ],
      imports: [MdCardModule, MdDialogModule, HttpModule, BrowserAnimationsModule ],
      providers: [AssessmentService, MdDialog ]
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [NewAssessmentDialogComponent]
      }
    })
    .overrideComponent(NewAssessmentDialogComponent, {
      set: {
        template: '<span>NewAssessmentDialogComponent</span>'
      }
      // remove: {
      //   templateUrl: './assessment-list.component.html'
      // }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentListComponent);
    component = fixture.componentInstance;
    const assessmentService: AssessmentService = fixture.debugElement.injector.get(AssessmentService);
    spyOn(assessmentService, 'getAssessments').and.returnValue(Observable.of(assessments));
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should open a dialog when create assessment is called', fakeAsync(() => {
    spyOn(component, 'updateList');
    component.createAssessment();
    fixture.detectChanges();
    tick();
    expect(component.updateList).toHaveBeenCalled();
  }));

  it('should call createAssessment when the button is clicked', () => {
    const button = fixture.debugElement.nativeElement.querySelector('button');
    spyOn(component, 'createAssessment');
    button.click();
    expect(component.createAssessment).toHaveBeenCalled();
  });
});
