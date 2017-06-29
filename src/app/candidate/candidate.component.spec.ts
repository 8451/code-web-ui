import { StompService } from 'ng2-stomp-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Observable } from 'rxjs/Observable';
import { ActivateComponent } from './../register/activate/activate.component';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateComponent } from './candidate.component';
import { CandidateService } from 'app/services/candidate/candidate.service';

const mockCandidateService = {
  getCandidateQuestion(id: string) { return Observable.of({
    title: 'title',
    body: 'body',
    questionResponseId: '1'
  }); }
};

describe('CandidateComponent', () => {
  let component: CandidateComponent;
  let fixture: ComponentFixture<CandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateComponent ],
      imports: [ ReactiveFormsModule, BrowserAnimationsModule, FlexLayoutModule, MaterialModule ],
      providers: [ { provide: ActivatedRoute, useValue: {params: Observable.of([{id: '12345'}])}},
      { provide: CandidateService, useValue: mockCandidateService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
