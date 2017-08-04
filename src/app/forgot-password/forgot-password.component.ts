import { environment } from './../../environments/environment';
import { Component, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../services/alert/alert.service';
import { passwordValid, sameValue } from '../validators';
import { Subscription } from 'rxjs/Subscription';
import { ResetForgottenPassword } from 'app/domains/reset-forgotten-password';
import { slideToTop } from '../../router.animations';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [slideToTop()]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  @HostBinding('@routerTransition') routerTransition;
  form: FormGroup;
  guid: string;
  routeSubscription: Subscription;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router,
    private alertService: AlertService, private route: ActivatedRoute) { }

  ngOnInit() {
    document.body.style.backgroundImage = 'linear-gradient(45deg, #ED008C, #F67E27)';
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
    document.body.style.backgroundImage = 'none';
    this.routeSubscription.unsubscribe();
  }

  buildSimpleForm() {
    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern(environment.emailValidator)
      ]],
    });
  }

  buildFullForm() {
    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern(environment.emailValidator)
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
