import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionInfoDialogComponent } from './question-info-dialog.component';

describe('QuestionInfoDialogComponent', () => {
  let component: QuestionInfoDialogComponent;
  let fixture: ComponentFixture<QuestionInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
