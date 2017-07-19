import { AlertService } from './../../services/alert/alert.service';
import { Router } from '@angular/router';
import { UserService } from './../../services/user/user.service';
import { User } from './../../domains/user';
import { FormsModule, ReactiveFormsModule, Validators, NgForm, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { sameValue, passwordValid } from '../../validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  user = new User();
  confirmPassword: string;
  form: FormGroup;

  constructor(private fb: FormBuilder,
      private userService: UserService,
      private router: Router,
      private alertService: AlertService
      ) { }

  ngOnInit() {
    document.body.style.backgroundImage = 'url(../../assets/magenta-orange.jpg)';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = 'cover';
    this.form = this.fb.group({
      firstName: ['', [
        Validators.required,
      ]],
      lastName: ['', [
        Validators.required,
      ]],
      username: ['', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@8451.com')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        passwordValid
      ]],
      confirmPassword: ['', [
        Validators.required,
      ]]
    }, {
      validator: sameValue('confirmPassword', 'password')
    });
  }

  ngOnDestroy() {
    document.body.style.backgroundImage = 'none';
  }

  onSubmitRegister() {
    if (!this.form.valid) {
      return;
    }
    const user  = this.form.value as User;
    this.userService.createUser(user).subscribe(createdUser => {
      this.router.navigate(['/activate']);
    }, error => {
      this.alertService.error('Error creating account.');
    });
  }
}
