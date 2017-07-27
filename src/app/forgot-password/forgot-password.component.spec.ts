import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { AlertService } from '../services/alert/alert.service';
import { MdCardModule, MdInputModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { Http, HttpModule } from '@angular/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


const mockUserService: any = {};

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordComponent ],
      imports: [
        FormsModule,
        MdCardModule,
        MdInputModule,
        RouterTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        AlertService,
        {provide: UserService, useValue: mockUserService},
        FormBuilder,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should be created', () => {
    expect(component).toBeTruthy();
  });
});
