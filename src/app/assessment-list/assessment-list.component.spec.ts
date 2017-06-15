import { Observable } from 'rxjs/Observable';
import { HttpModule } from '@angular/http';
import { AssessmentService } from './../services/assessment/assessment.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentListComponent } from './assessment-list.component';
import { MdDialogModule, MdCardModule, MaterialModule } from '@angular/material';

import { Assessment } from './../domains/assessment';
import { NewAssessmentDialogComponent } from './../new-assessment-dialog/new-assessment-dialog.component';

describe('AssessmentListComponent', () => {
  let component: AssessmentListComponent;
  let fixture: ComponentFixture<AssessmentListComponent>;
  let assessments: Assessment[] = [{
    firstName: 'first',
    lastName: 'lastName',
    email: 'e@mail.com'
  }]
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentListComponent ],
      imports: [MdCardModule, MdDialogModule, HttpModule],
      providers: [AssessmentService]
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

  it('should open a dialog when create assessment is called', () => {
    spyOn(component.dialog, 'open');
    component.createAssessment();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should call createAssessment when the button is clicked', () => {
    const button = fixture.debugElement.nativeElement.querySelector('button');
    spyOn(component, 'createAssessment');
    button.click();
    expect(component.createAssessment).toHaveBeenCalled();
  });
});
