import { User } from './../../domains/user';
import { FormsModule, ReactiveFormsModule, Validators, NgForm, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { controlsMustHaveEqualValue } from '../../validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new User();
  confirmPassword: string;
  form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', [
        Validators.required,
      ]],
      lastName: ['', [
        Validators.required,
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@8451.com')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
      ]],
      confirmPassword: ['', [
        Validators.required,
      ]]
    }, {
      validator: controlsMustHaveEqualValue('password', 'confirmPassword')
    });
  }

  onSubmitRegister() {
    if (!this.form.valid) {
      return;
    }

    console.log('register submitted');
  }
}
