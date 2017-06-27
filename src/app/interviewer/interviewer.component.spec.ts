import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { InterviewerComponent } from './interviewer.component';

describe('InterviewerComponent', () => {
  let component: InterviewerComponent;
  let fixture: ComponentFixture<InterviewerComponent>;
  const mockAuthService = {
    logout() { }
  };
  const mockRouter = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewerComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { url: Observable.of([{ path: 'interview'}])}}
        ],
      imports: [ RouterTestingModule ]
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

  it(`navigateTo should navigate to the various routes`, fakeAsync(() => {
    const route = fixture.debugElement.injector.get(ActivatedRoute);
    component.navigateTo('/assessments');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/assessments'], {relativeTo: route});
    component.navigateTo('/questions');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/questions'], {relativeTo: route});
  }));

  it(`logout should call AuthService.logout`, fakeAsync(() => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'logout').and.returnValue(Observable.of(true));
    expect(authService.logout).toHaveBeenCalledTimes(0);
    component.logout();
    expect(authService.logout).toHaveBeenCalledTimes(1);
  }));
});
