import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentListComponentComponent } from './assessment-list-component.component';

describe('AssessmentListComponentComponent', () => {
  let component: AssessmentListComponentComponent;
  let fixture: ComponentFixture<AssessmentListComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentListComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
