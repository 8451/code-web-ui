import { AuthService } from './../../services/auth/auth.service';
import { AlertService } from './../../services/alert/alert.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ConnectionBackend, RequestMethod, ResponseOptions, Response } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from './../../domains/user';
import { UserService } from './../../services/user/user.service';
import { Observable } from 'rxjs/Rx';
import { async, ComponentFixture, TestBed, fakeAsync, inject } from '@angular/core/testing';

import { ActivateComponent } from './activate.component';
import { ActivatedRoute, Params, Router } from '@angular/router';


describe('ActivateComponent', () => {
  let component: ActivateComponent;
  let fixture: ComponentFixture<ActivateComponent>;
  const mockRouter = { navigate: jasmine.createSpy('navigate') };
  const mockActivatedRoute: any = {
    params: Observable.from([{ 'guid': '1234' }])
  };

  const mockAuthService = {
    logout() { },
    getHeaders() { },
    login(username: string, password: string) { },
    isLoggedIn() { },
    getToken() { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivateComponent],
      imports: [
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: Http, useFactory: (
            backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        },
        MockBackend,
        BaseRequestOptions,
        { provide: ActivatedRoute, useValue: { params: Observable.from([{ 'guid': '1234' }]) } },
        { provide: Router, useValue: mockRouter },
        UserService,
        AlertService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('activated guid should populate the field', (done) => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.activationCode).toEqual('1234');
      component.ngOnDestroy();
      done();
    }).catch((e) => {
      console.error(e);
    });
  });

  it('activate() should call activateUser and perform a get using activationCode',
    fakeAsync(inject([Http, MockBackend], (http: Http, mockBackend: MockBackend) => {
      const userService = fixture.debugElement.injector.get(UserService);
      spyOn(userService, 'activateUser').and.returnValue(Observable.of(new Response(new ResponseOptions({ status: 200, body: null }))));

      mockBackend.connections.subscribe((connection: MockConnection) => {
        if (connection.request.method === RequestMethod.Get && connection.request.url.endsWith('1234')) {
          const response = new ResponseOptions({ status: 200 });
          connection.mockRespond(new Response(response));
        }
      });
      component.activate();
      expect(userService.activateUser).toHaveBeenCalledWith(component.activationCode);
    })));

  it('activate() should call alertService when activateUser returns an error',
    fakeAsync(inject([Http, MockBackend], (http: Http, mockBackend: MockBackend) => {
      const userService = fixture.debugElement.injector.get(UserService);
      const alertService = fixture.debugElement.injector.get(AlertService);
      spyOn(userService, 'activateUser').and.returnValue(Observable.throw(new Response(new ResponseOptions({ status: 500, body: null }))));
      spyOn(alertService, 'error');

      mockBackend.connections.subscribe((connection: MockConnection) => {
        if (connection.request.method === RequestMethod.Get && connection.request.url.endsWith('1234')) {
          const response = new ResponseOptions({ status: 500 });
          connection.mockRespond(new Response(response));
        }
      });
      component.activate();
      expect(userService.activateUser).toHaveBeenCalledWith(component.activationCode);
      expect(alertService.error).toHaveBeenCalled();
    })));
});
