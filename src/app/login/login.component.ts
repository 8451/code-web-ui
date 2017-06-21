import { User } from './../domains/user';
import { AuthService } from './../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MdInputModule, MaterialModule } from '@angular/material';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
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

  onSubmitLogin() {
    if (!this.form.valid) {
      return;
    }
    const user = this.form.value as User;
    this.authService.login(user.email, user.password)
      .subscribe(result => {
        if (result === true) {
          this.router.navigate(['assessments']);
        }
      });
  }

}
