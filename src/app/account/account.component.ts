import { AuthService } from './../services/auth/auth.service';
import { User } from './../domains/user';
import { AlertService } from './../services/alert/alert.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user/user.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { passwordValid, sameValue } from 'app/validators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  confirmPassword: string;
  currentUser: User;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.formInit();
    this.fillForm();
  }

  formInit() {
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

  fillForm() {
    this.userService.getActiveUser()
      .subscribe(user => {
        this.currentUser = user;
        this.form.setValue({
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          password: '',
          confirmPassword: '',
        });
      });
  }

  onSubmitUpdate() {
    if (!this.form.valid) {
      return;
    }
    this.currentUser.firstName = this.form.controls['firstName'].value;
    this.currentUser.lastName = this.form.controls['lastName'].value;
    this.currentUser.username = this.form.controls['username'].value;
    this.currentUser.password = this.form.controls['password'].value;
    this.userService.updateUser(this.currentUser).subscribe(updatedUser => {
      this.alertService.info('Account updated');
      this.router.navigate(['/account']);
    }, error => {
      this.alertService.error('Error updating account.');
    });
  }
}
