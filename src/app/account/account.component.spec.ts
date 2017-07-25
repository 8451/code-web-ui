import { UserVerification } from './../domains/user-verification';
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

  const mockFormUpdateUser = {
    id: 'id1',
    firstName: 'Test',
    lastName: 'Test',
    username: 'test@8451.com',
  };

  const mockUser = {
    users: [
      {
        id: 'id1',
        firstName: 'First Name',
        lastName: 'Last Name',
        username: 'test@8451.com',
        password: '',
      },
      {
        id: 'id1',
        firstName: 'First Name',
        lastName: 'Last Name',
        username: 'test@8451.com',
        password: 'newPassword1!',
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
            updateUser: function (): Observable<User> { return Observable.of(component.form.value as User); },
            updateUserAndPassword: function(verifiedUser: UserVerification): Observable<User> { return Observable.of(mockUser.users[1]); }
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
    component.form.setValue({
      firstName: mockUser.users[0].firstName,
      lastName: mockUser.users[0].lastName,
      username: mockUser.users[0].username,
    });
    spyOn(userService, 'updateUser').and.returnValue(Observable.of(mockUser.users[0]));
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.onSubmitUpdate();

    expect(userService.updateUser).toHaveBeenCalledWith(mockUser.users[0]);
    expect(alertService.info).toHaveBeenCalledTimes(1);
    expect(alertService.error).toHaveBeenCalledTimes(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/interview/account']);
  });

  it('onSubmitUpdate() should redirect to login when the form is valid and username is dirty', () => {
    component.form.setValue({
      firstName: mockUser.users[0].firstName,
      lastName: mockUser.users[0].lastName,
      username: mockUser.users[0].username,
    });
    component.form.get('username').markAsDirty();
    spyOn(userService, 'updateUser').and.returnValue(Observable.of(mockUser.users[0]));
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.onSubmitUpdate();

    expect(userService.updateUser).toHaveBeenCalledWith(mockUser.users[0]);
    expect(alertService.info).toHaveBeenCalledTimes(1);
    expect(alertService.error).toHaveBeenCalledTimes(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('onSubmitUpdate() should display an error when updating fails', () => {
    component.form.setValue({
      firstName: mockUser.users[0].firstName,
      lastName: mockUser.users[0].lastName,
      username: mockUser.users[0].username,
    });
    spyOn(userService, 'updateUser').and.returnValue(Observable.throw(mockError));
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.onSubmitUpdate();

    expect(userService.updateUser).toHaveBeenCalledWith(mockUser.users[0]);
    expect(alertService.info).toHaveBeenCalledTimes(0);
    expect(alertService.error).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
  });

  it('onSubmitUpdate() should not update the user when the form is invalid', () => {
    component.form.setValue({
      firstName: mockUser.users[0].firstName,
      lastName: mockUser.users[0].lastName,
      username: 'email@invalid.com',
    });
    spyOn(userService, 'updateUser').and.returnValue(Observable.of(mockUser.users[0]));
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.onSubmitUpdate();

    expect(userService.updateUser).toHaveBeenCalledTimes(0);
    expect(alertService.info).toHaveBeenCalledTimes(0);
    expect(alertService.error).toHaveBeenCalledTimes(0);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
  });

  it('onSubmitUpdate() should update the user and password when the form is valid', () => {
    component.changePassword();
    component.form.setValue({
      firstName: mockUser.users[0].firstName,
      lastName: mockUser.users[0].lastName,
      username: mockUser.users[0].username,
      currentPassword: 'validPassword1!',
      newPassword: mockUser.users[1].password,
      confirmPassword: mockUser.users[1].password,
    });
    spyOn(userService, 'updateUserAndPassword').and.returnValue(Observable.of(mockUser.users[1]));
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.onSubmitUpdate();

    const verifiedUser = new UserVerification(mockUser.users[1], 'validPassword1!');
    expect(userService.updateUserAndPassword).toHaveBeenCalledWith(verifiedUser);
    expect(alertService.info).toHaveBeenCalledTimes(1);
    expect(alertService.error).toHaveBeenCalledTimes(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('onSubmitUpdate() should display an error when updating password fails', () => {
    component.changePassword();
    component.form.setValue({
      firstName: mockUser.users[0].firstName,
      lastName: mockUser.users[0].lastName,
      username: mockUser.users[0].username,
      currentPassword: 'validPassword1!',
      newPassword: mockUser.users[1].password,
      confirmPassword: mockUser.users[1].password,
    });
    spyOn(userService, 'updateUserAndPassword').and.returnValue(Observable.throw(mockError));
    spyOn(alertService, 'info');
    spyOn(alertService, 'error');

    component.onSubmitUpdate();

    const verifiedUser = new UserVerification(mockUser.users[1], 'validPassword1!');
    expect(userService.updateUserAndPassword).toHaveBeenCalledWith(verifiedUser);
    expect(alertService.info).toHaveBeenCalledTimes(0);
    expect(alertService.error).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
  });
});
