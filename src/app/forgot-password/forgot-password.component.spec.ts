import { ResetForgottenPassword } from './../domains/reset-forgotten-password';
import { Observable } from 'rxjs/Observable';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { AlertService } from '../services/alert/alert.service';
import { MdCardModule, MdInputModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, HttpModule } from '@angular/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


const mockUserService: any = {
  forgotPassword(username: string) {},
  resetForgottenPassword(resetForgottenPassword: ResetForgottenPassword) {}
};


describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordComponent ],
      imports: [
        FormsModule,
        MdCardModule,
        MdInputModule,
        RouterTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        AlertService,
        {provide: UserService, useValue: mockUserService},
        FormBuilder,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function setupNoGuid() {
    const route = fixture.debugElement.injector.get(ActivatedRoute);
    route.params = Observable.of({guid: null});
    component.ngOnInit();
    tick();
  }

  function setupWithGuid() {
    const route = fixture.debugElement.injector.get(ActivatedRoute);
    route.params = Observable.of({guid: '1234'});
    component.ngOnInit();
    tick();
  }

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should build simple form when no guid', fakeAsync(() => {
    setupNoGuid();
    expect(Object.keys(component.form.controls).length).toBe(1);
    expect(Object.keys(component.form.controls)[0]).toBe('username');
  }));

  it('should build complete form when guid', fakeAsync(() => {
    setupWithGuid();
    expect(Object.keys(component.form.controls).length).toBe(6);
    expect(Object.keys(component.form.controls)[0]).toBe('firstName');
    expect(Object.keys(component.form.controls)[1]).toBe('lastName');
    expect(Object.keys(component.form.controls)[2]).toBe('username');
    expect(Object.keys(component.form.controls)[3]).toBe('newPassword');
    expect(Object.keys(component.form.controls)[4]).toBe('confirmNewPassword');
    expect(Object.keys(component.form.controls)[5]).toBe('resetGuid');
  }));

  it('should call forgotPassword on service w/ no guid', fakeAsync(() => {
    setupNoGuid();
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'forgotPassword');
    component.onSubmitForgotPassword();
    expect(userService.forgotPassword).toHaveBeenCalled();
  }));

  it('should call resetForgottenPassword on service w/ guid', fakeAsync(() => {
    setupWithGuid();
    const userService = fixture.debugElement.injector.get(UserService);
    const router = fixture.debugElement.injector.get(Router);
    spyOn(userService, 'resetForgottenPassword').and.returnValue(Observable.of(true));
    spyOn(router, 'navigate');
    component.form.setValue({
      firstName: 'name',
      lastName: 'name',
      username: 'email@8451.com',
      newPassword: 'Password1',
      confirmNewPassword: 'Password1',
      resetGuid: '1234'
    });
    component.onSubmitForgotPassword();
    tick();
    expect(userService.resetForgottenPassword).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should call alertService on submission error w/ guid', fakeAsync(() => {
    setupWithGuid();
    const userService = fixture.debugElement.injector.get(UserService);
    const alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(userService, 'resetForgottenPassword').and.returnValue(Observable.throw(true));
    spyOn(alertService, 'error');
    component.form.setValue({
      firstName: 'name',
      lastName: 'name',
      username: 'email@8451.com',
      newPassword: 'Password1',
      confirmNewPassword: 'Password1',
      resetGuid: '1234'
    });
    component.onSubmitForgotPassword();
    tick();
    expect(userService.resetForgottenPassword).toHaveBeenCalled();
    expect(alertService.error).toHaveBeenCalled();
  }));

});
