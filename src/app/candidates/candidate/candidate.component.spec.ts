import { AssessmentWebSocketService } from '../../services/assessment-web-socket/assessment-web-socket.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Observable } from 'rxjs/Observable';
import { ActivateComponent } from '../../public/register/activate/activate.component';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

import { CandidateComponent } from './candidate.component';

@Component({
  template: ''
})
class DummyComponent {
}

describe('CandidateComponent', () => {
  let component: CandidateComponent;
  let fixture: ComponentFixture<CandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateComponent, DummyComponent ],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([ {path: '', pathMatch: 'full', redirectTo: '/interview'},
        {path: 'candidate', component: CandidateComponent, children: [{path: 'assessments', component: DummyComponent}]}
        ])],
      providers: [ { provide: ActivatedRoute, useValue: {params: Observable.of([{id: '12345'}])}} ]
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
