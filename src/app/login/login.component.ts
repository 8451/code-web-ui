import { AuthService } from './../services/auth/auth.service';
import { AlertService } from './../services/alert/alert.service';
import { User } from './../domains/user';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MdInputModule, MaterialModule, MdCardModule } from '@angular/material';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    document.body.style.backgroundImage = 'url(../../assets/magenta-orange.jpg)';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = 'cover';
    this.authService.logout();
    this.form = this.fb.group({
      username: ['', [
        Validators.required,
      ]],
      password: ['', [
        Validators.required
      ]]
    });
  }

  ngOnDestroy() {
    document.body.style.backgroundImage = 'none';
  }

  onSubmitLogin() {
    if (!this.form.valid) {
      return;
    }
    const user = this.form.value as User;
    this.authService.login(user.username, user.password)
      .subscribe(result => {
        if (result === true) {
          this.router.navigate(['/interview']);
        } else {
          this.alertService.info('Invalid username or password.');
        }
      }, error => {
        this.alertService.error('Could not login. Try again later.');
      });
  }

}
