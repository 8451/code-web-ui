import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../services/alert/alert.service';
import { passwordValid, sameValue } from '../validators';
import { Subscription } from 'rxjs/Subscription';
import { ResetForgottenPassword } from 'app/domains/reset-forgotten-password';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  form: FormGroup;
  guid: string;
  routeSubscription: Subscription;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router,
              private alertService: AlertService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.guid = params['guid'] || '';
      if (this.guid) {
        this.buildFullForm();
      } else {
        this.buildSimpleForm();
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  buildSimpleForm() {
    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@8451.com')
      ]],
    });
  }

  buildFullForm() {
    this.form  = this.fb.group({
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
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        passwordValid
      ]],
      confirmNewPassword: ['', [
        Validators.required,
      ]],
      resetGuid: [this.guid, [Validators.required]],
    }, {
      validator: sameValue('confirmNewPassword', 'newPassword')
    });
  }

  onSubmitForgotPassword() {
    if (this.guid) {
      this.userService.resetForgottenPassword(this.form.value as ResetForgottenPassword).subscribe(() => {
        this.router.navigate(['/login']);
      }, error => {
        this.alertService.error('Unable to reset password');
      });
    } else {
      this.userService.forgotPassword(this.form.get('username').value as string);
    }
  }
}
