import { AssessmentListComponent } from './../assessment-list/assessment-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, RouterLinkActive } from '@angular/router';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { InterviewerComponent } from './interviewer.component';

@Component({
  template: ''
})
class DummyComponent {  }

describe('InterviewerComponent', () => {
  let component: InterviewerComponent;
  let fixture: ComponentFixture<InterviewerComponent>;
  const mockAuthService = {
    logout() { }
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    events: new Observable()
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewerComponent, DummyComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        Location
        ],
      imports: [ RouterTestingModule.withRoutes([ {path: '', pathMatch: 'full', redirectTo: '/interview'},
        {path: 'interview', component: InterviewerComponent, children: [{path: 'assessments', component: DummyComponent}]}
        ]) ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the various routes', fakeAsync(() => {
    const location = fixture.debugElement.injector.get(Location);
    const link = fixture.debugElement.nativeElement.querySelector('#assessmentLink');
    expect(link.getAttribute('ng-reflect-router-link')).toBe('/interview/assessments');
    link.click();
    tick();
    expect(location.path()).toBe('/interview/assessments');
   }));

  it(`logout should call AuthService.logout`, fakeAsync(() => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'logout').and.returnValue(Observable.of(true));
    expect(authService.logout).toHaveBeenCalledTimes(0);
    component.logout();
    expect(authService.logout).toHaveBeenCalledTimes(1);
  }));
});
