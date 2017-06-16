import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from './../../app-routing.module';
import { AppModule } from './../../app.module';
import { NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';

fdescribe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let form: NgForm;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // it('registerForm invalid when not 8451 email', () => {
  //   fixture.whenStable().then(() => {
  //     const emailControl = component.userForm.control.get('email');
  //     emailControl.setValue('test@gmail.com');
  //     expect(emailControl.valid).toBe(false);
  //   });
  // });

  // it('registerForm valid when 8451 email', () => {
  //   fixture.whenStable().then(() => {
  //     const emailControl = component.userForm.control.get('email');
  //     emailControl.setValue('test@8451.com');
  //     expect(emailControl.valid).toBe(true);
  //   }, e => console.error(e));
  // });

  it('registerForm invalid when no firstName', () => {
    fixture.whenStable().then(() => {
      const firstNameControl = component.userForm.control.get('firstName');
      console.log(firstNameControl);
      firstNameControl.setValue('');
      expect(firstNameControl.valid).toBeFalsy();
    });
  });
});
