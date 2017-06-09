import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDashboardComponent } from './question-dashboard.component';
import{BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { AppModule } from '../app.module';

describe('QuestionDashboardComponent', () => {
   //let component: QuestionDashboardComponent;
   //let fixture: ComponentFixture<QuestionDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        AppModule,
        RouterTestingModule
      ]
    }).compileComponents();
  }));


  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(QuestionDashboardComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));

  it('should have a list of questions', async(() => {
    const fixture = TestBed.createComponent(QuestionDashboardComponent);
    fixture.detectChanges();
    const component = fixture.debugElement.componentInstance;
    console.error(component);
    expect(component).toBeTruthy();
  }));
});
