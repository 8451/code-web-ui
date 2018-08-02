import { Observable } from 'rxjs/Observable';
import { AuthService } from './services/auth/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertService } from './alert/alert-service/alert.service';
import { AlertComponent } from './alert/alert.component';
import { TestBed, async, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';


import { AppComponent } from './app.component';
import { MatSnackBarModule, MatDialogModule } from '@angular/material';

describe('AppComponent', () => {
  let fixture;
  let component;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        MatDialogModule,
      ],
      declarations: [
        AppComponent,
        AlertComponent
      ],
      providers: [ AlertService ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create the app', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

  }));

});
