import { User } from './../domains/user';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './../services/auth/auth.service';
import { AlertService } from './../services/alert/alert.service';
import { UserService } from './../services/user/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, Http } from '@angular/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AccountComponent } from './account.component';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let mockRouter = { navigate: jasmine.createSpy('navigate') };
  let userService: UserService;
  let alertService: AlertService;

  const mockForm = {
    firstName: 'Test',
    lastName: 'Test',
    username: 'test@8451.com',
    password: 'testPassword1',
    confirmPassword: 'testPassword1'
  };

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

  const mockError = {
    body: { 'statusText': 'error' },
    status: 500,
    statusText: '500 Internal Server Error'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountComponent],
      imports: [
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: UserService,
          useValue:
          {
            getActiveUser: function (): Observable<User> { return Observable.of(mockUser.users[0]); },
            updateUser: function (): Observable<User> { return Observable.of(component.form.value as User); }
          }
        },
        AlertService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(UserService);
    alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(userService, 'getActiveUser').and.returnValue(Observable.of(mockUser.users[0]));
    component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('onSubmitUpdate() should update the user when the form is valid', () => {
    component.form.setValue(mockForm);
    spyOn(userService, 'updateUser').and.returnValue(Observable.of(component.form.value as User));
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.onSubmitUpdate();

    expect(userService.updateUser).toHaveBeenCalledWith(component.form.value as User);
    expect(alertService.info).toHaveBeenCalledTimes(1);
    expect(alertService.error).toHaveBeenCalledTimes(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/account']);
  });

  it('onSubmitUpdate() should display an error when updating fails', () => {
    component.form.setValue(mockForm);
    spyOn(userService, 'updateUser').and.returnValue(Observable.throw(mockError));
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.onSubmitUpdate();

    expect(userService.updateUser).toHaveBeenCalledWith(component.form.value as User);
    expect(alertService.info).toHaveBeenCalledTimes(0);
    expect(alertService.error).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
  });

  it('onSubmitUpdate() should not update the user when the form is invalid', () => {
    spyOn(userService, 'updateUser').and.returnValue(Observable.of(component.form.value as User));
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.onSubmitUpdate();

    expect(userService.updateUser).toHaveBeenCalledTimes(0);
    expect(alertService.info).toHaveBeenCalledTimes(0);
    expect(alertService.error).toHaveBeenCalledTimes(0);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
  });
});
