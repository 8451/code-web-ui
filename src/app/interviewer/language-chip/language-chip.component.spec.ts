import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageChipComponent } from './language-chip.component';
import { MatChipsModule } from '@angular/material';

describe('LanguageChipComponent', () => {
  let component: LanguageChipComponent;
  let fixture: ComponentFixture<LanguageChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatChipsModule,
      ],
      declarations: [ LanguageChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
