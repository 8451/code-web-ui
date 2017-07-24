import { UserVerification } from './../domains/user-verification';
import { AuthService } from './../services/auth/auth.service';
import { User } from './../domains/user';
import { AlertService } from './../services/alert/alert.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user/user.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { passwordValid, sameValue } from 'app/validators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  confirmPassword: string;
  currentUser: User;
  form: FormGroup;
  canChangePassword: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    document.body.style.backgroundImage = 'url(../../assets/magenta-blue.jpg)';
    this.canChangePassword = false;
    this.formInit();
    this.fillForm();
  }

  ngOnDestroy() {
    document.body.style.backgroundImage = 'none';
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

    if (this.canChangePassword) {
      this.currentUser.password = this.form.controls['newPassword'].value;
      const currentPassword = this.form.controls['currentPassword'].value;
      const verifiedUser = new UserVerification(this.currentUser, currentPassword);

      this.userService.updateUserAndPassword(verifiedUser).subscribe(updatedUser => {
        this.alertService.info('Account password updated');
        this.router.navigate(['/login']);
      }, error => {
        this.alertService.error('Error updating account password.');
      });
    } else {
      this.userService.updateUser(this.currentUser).subscribe(updatedUser => {
        this.alertService.info('Account updated');
        this.router.navigate(['/interview/account']);
      }, error => {
        this.alertService.error('Error updating account.');
      });
    }
  }

  changePassword(): void {

    const passwordFields = this.fb.group({
      currentPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        passwordValid
      ]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        passwordValid
      ]],
      confirmPassword: ['', [
        Validators.required,
      ]]
    }, {
        validator: sameValue('confirmPassword', 'newPassword')
      });
    this.form.addControl('currentPassword', passwordFields.controls['currentPassword']);
    this.form.addControl('newPassword', passwordFields.controls['newPassword']);
    this.form.addControl('confirmPassword', passwordFields.controls['confirmPassword']);
    this.form.validator = sameValue('confirmPassword', 'newPassword');

    this.canChangePassword = true;

  }
}
