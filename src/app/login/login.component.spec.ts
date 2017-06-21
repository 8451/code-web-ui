import { AlertService } from './../services/alert/alert.service';
import { Observable } from 'rxjs/Rx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { AuthService } from './../services/auth/auth.service';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MdInputModule, MaterialModule } from '@angular/material';
import { LoginComponent } from './login.component';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let alertService: AlertService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        ReactiveFormsModule,
        MdInputModule,
        FormsModule,
        HttpModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        AuthService,
        MockBackend,
        AlertService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when username is empty', () => {
    const username = component.form.get('username');
    username.setValue('');
    expect(username.valid).toBeFalsy();
  });

  it('form invalid when password is empty', () => {
    const password = component.form.get('password');
    password.setValue('');
    expect(password.valid).toBeFalsy();
  });

  it('form valid when username is non-empty', () => {
    const username = component.form.get('username');
    username.setValue('username');
    expect(username.valid).toBeTruthy();
  });

  it('form valid when password is non-empty', () => {
    const password = component.form.get('password');
    password.setValue('password');
    expect(password.valid).toBeTruthy();
  });

  it('should not call authService.login() if the form is invalid', () => {
    authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'login');
    component.onSubmitLogin();
    expect(authService.login).toHaveBeenCalledTimes(0);
  });

  it('should call alertService.info() when the login fails', () => {
    authService = fixture.debugElement.injector.get(AuthService);
    alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(authService, 'login').and.returnValue(Observable.of(false));
    spyOn(alertService, 'info');
    component.form.setValue({username: 'test', password: 'test'});
    component.onSubmitLogin();
    expect(alertService.info).toHaveBeenCalled();
  })

  it('should call alertService.error() when the login request fails', () => {
    authService = fixture.debugElement.injector.get(AuthService);
    alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(alertService, 'error');
    spyOn(authService, 'login').and.returnValue(
      Observable.throw(new Response(new ResponseOptions({status: 500, body: null}))));
    component.form.setValue({username: 'test', password: 'test'});
    component.onSubmitLogin();
    expect(alertService.error).toHaveBeenCalled();
  });

});
