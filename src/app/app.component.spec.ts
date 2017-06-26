import { Observable } from 'rxjs/Observable';
import { AuthService } from './services/auth/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { AlertService } from './services/alert/alert.service';
import { AlertComponent } from './alert/alert.component';
import { TestBed, async, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';


import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture;
  let component;
  let mockAuthService = {
    logout() { }
  };
  const mockRouter = { navigate: jasmine.createSpy('navigate') };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AppComponent,
        AlertComponent
      ],
      providers: [
        AlertService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create the app', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

  }));

  it(`should have as title 'CoDE: Collaborative Development Environment'`, fakeAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.title).toEqual('CoDE: Collaborative Development Environment');
    });

  }));

  it(`should render the title 'CoDE: Collaborative Development Environment' in a h1 tag`, fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement;

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(compiled.querySelector('#appTitle').textContent).toContain('CoDE: Collaborative Development Environment');
    });
  }));

  it(`navigateTo should navigate to the various routes`, fakeAsync(() => {
    component.navigateTo('/assessments');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/assessments']);
    component.navigateTo('/questions');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/questions']);
  }));

  it(`logout should call AuthService.logout`, fakeAsync(() => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'logout').and.returnValue(Observable.of(true));
    expect(authService.logout).toHaveBeenCalledTimes(0);
    component.logout();
    expect(authService.logout).toHaveBeenCalledTimes(1);
  }));

});
