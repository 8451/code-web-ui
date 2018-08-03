import { FormBuilder } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { LoginComponent } from '../login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GatewayComponent } from './gateway.component';
import { RegisterComponent } from '../register/register/register.component';

@Component({
  selector: 'app-login',
  template: '<p>mock login</p>'
})
class MockLoginComponent {}

@Component({
  selector: 'app-register',
  template: '<p>mock register</p>'
})
class MockRegisterComponent {}

describe('GatewayComponent', () => {
  let component: GatewayComponent;
  let fixture: ComponentFixture<GatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GatewayComponent, MockLoginComponent, MockRegisterComponent],
      imports: [
        MatCardModule,
        BrowserAnimationsModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the facings and selected component from login to register', () => {
    component.loginFacing = 'front';
    component.registerFacing = 'front';
    component.component = 'login';

    component.toggleComponent();

    expect(component.loginFacing).toBe('back');
    expect(component.registerFacing).toBe('back');
    expect(component.component).toBe('register');
  });

  it('should toggle the facings and selected component from register to login', () => {
    component.loginFacing = 'back';
    component.registerFacing = 'back';
    component.component = 'register';

    component.toggleComponent();

    expect(component.loginFacing).toBe('front');
    expect(component.registerFacing).toBe('front');
    expect(component.component).toBe('login');
  });
});
