import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MdInputModule, MaterialModule } from '@angular/material';
import { LoginComponent } from './login.component';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
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

});
