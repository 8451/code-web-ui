import { AceEditorModule } from 'ng2-ace-editor';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionInfoDialogComponent } from './question-info-dialog.component';
import { MatDialogRef } from '@angular/material';

describe('QuestionInfoDialogComponent', () => {
  let component: QuestionInfoDialogComponent;
  let fixture: ComponentFixture<QuestionInfoDialogComponent>;

  const question = {
    id: 'id1',
    title: 'Title1',
    body: 'Body1',
    suggestedAnswer: 'SuggestedAnswer1',
    difficulty: 5,
    language: 'java',
    createdBy: 'createdBy1',
    createdDate: new Date(1),
    modifiedBy: 'modifiedBy1',
    modifiedDate: new Date(1)
  };

  class MdDialogRefMock {
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionInfoDialogComponent],
      providers: [
        { provide: MatDialogRef, useClass: MdDialogRefMock }
      ],
      imports: [
        AceEditorModule,
      ]
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

  it('DOM should be populated with input', () => {
    component.question = question;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.question-title').textContent).toContain(question.title);
    expect(compiled.querySelector('.question-body')).toBeTruthy();
  });
});
