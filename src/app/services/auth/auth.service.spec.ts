import { MockBackend } from '@angular/http/testing';
import { Headers, HttpModule, Http, ConnectionBackend, BaseRequestOptions, ResponseOptions, Response } from '@angular/http';
import { TestBed, inject, fakeAsync } from '@angular/core/testing';

import { AuthService } from './auth.service';

const mockToken = 'mockTokenfjaksd';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [AuthService,
        {
          provide: Http, useFactory: (
            backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        },
        MockBackend,
        BaseRequestOptions
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  it('should return correct headers', inject([AuthService], (service: AuthService) => {
    spyOn(service, 'getToken').and.returnValue('This is a token');
    const expectedHeaders: Headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + service.getToken()
    });
    const actualHeaders = service.getHeaders();
    console.log('actual: ', actualHeaders.get('Content-type'));
    console.log('expected: ', expectedHeaders.get('Content-type'));
    const sameContentType = actualHeaders.get('Content-type') === expectedHeaders.get('Content-type');
    const sameToken = actualHeaders.get('Content-type') === expectedHeaders.get('Content-type');
    expect(sameContentType).toBeTruthy();
    expect(sameToken).toBeTruthy();
    expect(actualHeaders.keys().length).toBe(2);
  }));

  it('should return true and store token when a valid login request is made', fakeAsync(inject([Http, MockBackend, AuthService],
  (http: Http, mockBackend: MockBackend, authService: AuthService) => {
    mockBackend.connections.subscribe(connection => {
      const response = new ResponseOptions({body: {token: mockToken} });
      connection.mockRespond(new Response(response));
    });

    spyOn(localStorage, 'setItem');

    authService.login('username', 'Passw0rd!').subscribe(res => {
      expect(res).toBeTruthy();
      expect(localStorage.setItem).toHaveBeenCalledWith('currentUser',
        JSON.stringify({username: 'username', token: mockToken}));
    });
  })));

  it('should return false invalid login request is made', fakeAsync(inject([Http, MockBackend, AuthService],
  (http: Http, mockBackend: MockBackend, authService: AuthService) => {
    mockBackend.connections.subscribe(connection => {
      const response = new ResponseOptions({body: {token: ''} });
      connection.mockRespond(new Response(response));
    });

    authService.login('username', 'Passw0rd!').subscribe(res => {
      expect(res).toBeFalsy();
    });
  })));

  it('should return true if token is present', inject([AuthService], (authService: AuthService) => {
    spyOn(authService, 'getToken').and.returnValue(mockToken);
    expect(authService.isLoggedIn()).toBeTruthy();
  }));

  it('should return false if token is not present', inject([AuthService], (authService: AuthService) => {
    spyOn(authService, 'getToken').and.returnValue('');
    expect(authService.isLoggedIn()).toBeFalsy();
  }));

  it('should remove currentUser when logging out', inject([AuthService], (authService: AuthService) => {
    spyOn(localStorage, 'removeItem');

    authService.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
  }));

  it('should return token if token is present', inject([AuthService], (authService: AuthService) => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({username: 'username', token: mockToken}));

    expect(authService.getToken()).toBe(mockToken);
  }));

  it('should return token if token is present', inject([AuthService], (authService: AuthService) => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({username: 'username', token: ''}));

    expect(authService.getToken()).toBeFalsy();
  }));

  it('handleError() should handle a http error', fakeAsync(inject(
    [Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      const mockError = {
        body: {'statusText': 'error'},
        status: 404,
        statusText: '404 Not Found'
      };

      const errorResponse = new ResponseOptions(mockError);

      authService.handleError(new Response(errorResponse)).subscribe(
        () => { }, error => expect(error).toBe('404 Not Found')
      );
    })));

});
