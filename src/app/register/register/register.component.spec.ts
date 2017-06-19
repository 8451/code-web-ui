import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from './../../app-routing.module';
import { AppModule } from './../../app.module';
import { NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
      ],
      declarations: [RegisterComponent]
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

  it('control invalid when not 8451 email', () => {
      const emailControl = component.form.get('email');
      emailControl.setValue('test@gmail.com');
      expect(emailControl.valid).toBe(false);
  });

  it('control valid when 8451 email', () => {
    const emailControl = component.form.get('email');
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

});
