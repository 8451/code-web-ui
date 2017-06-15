import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { AlertService } from './services/alert/alert.service';
import { AlertComponent } from './alert/alert.component';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';


import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AppComponent,
        AlertComponent
      ],
      providers: [
        AlertService
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(app).toBeTruthy();
    });

  }));

  it(`should have as title 'CoDE: Collaborative Development Environment'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(app.title).toEqual('CoDE: Collaborative Development Environment');
    });

  }));

  it(`should render the title 'CoDE: Collaborative Development Environment' in a h1 tag`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(compiled.querySelector('#appTitle').textContent).toContain('CoDE: Collaborative Development Environment');
    });

  }));
});
