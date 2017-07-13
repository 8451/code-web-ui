import { AuthService } from './../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { Question } from './../../domains/question';
import { Subject } from 'rxjs/Subject';
import { TestBed, inject, fakeAsync, async } from '@angular/core/testing';
import {
  HttpModule, Http, Response, ResponseOptions,
  XHRBackend, ConnectionBackend, BaseRequestOptions, Connection, RequestMethod
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { UserService } from './user.service';

const mockUser = {
  users: [
    {
      id: 'id1',
      firstName: 'First Name',
      lastName: 'Last Name',
      username: 'test@test.com',
      password: '123456',
    },
    {
      id: 'id2',
      firstName: 'First Name',
      lastName: 'Last Name',
      username: 'test@test.com',
      password: '123456',
    },
    {
      id: 'id3',
      firstName: 'First Name',
      lastName: 'Last Name',
      username: 'test@test.com',
      password: '123456',
    }
  ]
};

const errorResponse = new Response(new ResponseOptions({ status: 400 }));

const mockAuthService = {
  logout() { },
  getHeaders() { },
  login(username: string, password: string) { },
  isLoggedIn() { },
  getToken() { }
};

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Http, useFactory: (
            backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        },
        MockBackend,
        BaseRequestOptions,
        UserService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('createUser() should create and return user', fakeAsync(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      const userService = new UserService(http, authService);

      mockBackend.connections.subscribe((connection: MockConnection) => {
        if (connection.request.method === RequestMethod.Post && connection.request.url.endsWith('users')) {
          const response = new ResponseOptions({ body: mockUser });
          connection.mockRespond(new Response(response));
        } else {
          connection.mockRespond(errorResponse);
        }
      });

      userService.createUser(mockUser.users[0]).subscribe(user => {
        const expectedUser = mockUser.users[0];
        expect(user.id).toEqual(expectedUser.id, 'user firstName should match');
        expect(user.firstName).toEqual(expectedUser.firstName, 'user firstName should match');
        expect(user.lastName).toEqual(expectedUser.lastName, 'use lastName should match');
        expect(user.username).toEqual(expectedUser.username, 'user email should match');
      }, error => {
      });
    }
  )));

  it('should get a list of users when getUsers', async(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      const userService = new UserService(http, authService);

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const response = new ResponseOptions({ body: mockUser });
        connection.mockRespond(new Response(response));
      });

      userService.getUsers().subscribe(users => {
        expect(users.length).toBe(mockUser.users.length);
      });
    }
  )));

  it('should delete a user when deleteUser is called', async(inject([Http, MockBackend, AuthService],
    (http: Http, mockBackend: MockBackend, authService: AuthService) => {
      const userService = new UserService(http, authService);

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const response = new ResponseOptions({ body: true });
        connection.mockRespond(new Response(response));
      });

      userService.deleteUser(mockUser.users[0].id).subscribe(res => {
        expect(res).toBe(true);
      });
    }
  )));
});
