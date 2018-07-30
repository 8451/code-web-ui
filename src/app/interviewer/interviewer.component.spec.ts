import { AssessmentListComponent } from './../assessment-list/assessment-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material';
import { InterviewerComponent } from './interviewer.component';

@Component({
  template: ''
})
class DummyComponent { }

describe('InterviewerComponent', () => {
  let component: InterviewerComponent;
  let fixture: ComponentFixture<InterviewerComponent>;
  let mockRouter;
  let authService;

  const mockUser = {
    users: [
      {
        id: 'id1',
        firstName: 'First Name',
        lastName: 'Last Name',
        username: 'test@test.com',
        password: '123456',
      },
    ]
  };

  const mockId = {
    id: [
      'userID',
    ]
  };

  const mockAuthService = {
    logout() { },
    getMe() {
      return Observable.of(mockId.id[0]);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InterviewerComponent, DummyComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        Location,
      ],
      imports: [
        RouterTestingModule.withRoutes([{ path: '', pathMatch: 'full', redirectTo: '/interview' },
        { path: 'interview', component: InterviewerComponent, children: [{ path: 'assessments', component: DummyComponent }] },
        ]),
        MatButtonModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockRouter = fixture.debugElement.injector.get(Router);
    authService = fixture.debugElement.injector.get(AuthService);
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
    spyOn(authService, 'logout').and.returnValue(Observable.of(true));
    expect(authService.logout).toHaveBeenCalledTimes(0);
    component.logout();
    expect(authService.logout).toHaveBeenCalledTimes(1);
  }));
});
