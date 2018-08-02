import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule, MatIconModule,
  MatInputModule
} from '@angular/material';
import { AlertModule } from '../alert/alert.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { GatewayComponent } from './gateway/gateway.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ActivateComponent } from './register/activate/activate.component';
import { RegisterComponent } from './register/register/register.component';

@NgModule({
  imports: [
    AlertModule.forRoot(),
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ForgotPasswordComponent,
    GatewayComponent,
    NotFoundComponent,
    RegisterComponent,
    ActivateComponent,
    LoginComponent,
  ],
  exports: [
    ForgotPasswordComponent,
    GatewayComponent,
    NotFoundComponent,
    RegisterComponent,
    ActivateComponent,
    LoginComponent,
  ]
})
export class PublicModule { }
