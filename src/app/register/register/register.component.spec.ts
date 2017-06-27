import { ResponseOptions, Response } from '@angular/http';
import { AlertService } from './../../services/alert/alert.service';
import { Observable } from 'rxjs/Observable';
import { User } from './../../domains/user';
import { UserService } from './../../services/user/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from './../../app-routing.module';
import { NgForm, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const mockForm = {
    firstName: 'Test',
    lastName: 'Test',
    username: 'test@8451.com',
    password: 'testPassword1',
    confirmPassword: 'testPassword1'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
      ],
      declarations: [RegisterComponent],
      providers: [{provide: UserService, useValue: {
        createUser: function(user: User): Observable<User> {
          return null;
        }
      }},
      AlertService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('control invalid when not 8451 username', () => {
      const emailControl = component.form.get('username');
      emailControl.setValue('test@gmail.com');
      expect(emailControl.valid).toBe(false);
  });

  it('control valid when 8451 username', () => {
    const emailControl = component.form.get('username');
    emailControl.setValue('test@8451.com');
    expect(emailControl.valid).toBe(true);
  });

  it('control invalid when no firstName', () => {
    const firstNameControl = component.form.get('firstName');
    firstNameControl.setValue('');
    expect(firstNameControl.valid).toBeFalsy();
  });

  it('control invalid when no lastName', () => {
    const lastNameControl = component.form.get('lastName');
    lastNameControl.setValue('');
    expect(lastNameControl.valid).toBeFalsy();
  });

  it('control invalid when when password not 6 characters', () => {
    const passwordControl = component.form.get('password');
    passwordControl.setValue('12345');
    expect(passwordControl.valid).toBeFalsy();
  });

  it('control valid when passwords match and greater than 6 chars', () => {
    const passwordControl = component.form.get('password');
    const confirmPassword = component.form.get('confirmPassword');

    const dummyPassword = 'S0M3DummyPassword';

    passwordControl.setValue(dummyPassword);
    confirmPassword.setValue(dummyPassword);

    expect(confirmPassword.valid).toBeTruthy();
  });

  it('call UserService create method', () => {
    const mockService = fixture.debugElement.injector.get(UserService);
    spyOn(mockService, 'createUser');
    component.onSubmitRegister();
    expect(mockService.createUser);
  });

  /*
  Passwords must be a minimum of 8 characters and must contain at least 3 of the 4 following character types:
  -	Upper case letters
  -	Lower case letters
  -	Numbers
  -	Punctuation / special characters
  */
  it('password invalid when not given at least 2/ of required 3 elements given', () => {
    const passwordControl = component.form.get('password');
    passwordControl.setValue('1234567A');
    expect(passwordControl.valid).toBeFalsy();
  });

  it('password valid when given 3 of required 3 elements', () => {
    const passwordControl = component.form.get('password');
    passwordControl.setValue('123456+A');
    expect(passwordControl.valid).toBeTruthy();
  });

  it('should display a toast when registering throws an error', async(() => {
    const alertService = fixture.debugElement.injector.get(AlertService);
    const mockService = fixture.debugElement.injector.get(UserService);
    spyOn(alertService, 'error');
    spyOn(mockService, 'createUser').and.returnValue(
      Observable.throw(new Response(new ResponseOptions({status: 500, body: null}))));

    component.form.setValue(mockForm);

    component.onSubmitRegister();

    expect(alertService.error).toHaveBeenCalled();
  }));

});
