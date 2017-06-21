import { Question } from './../../domains/question';
import { Subject } from 'rxjs/Subject';
import { TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpModule, Http, Response, ResponseOptions,
  XHRBackend, ConnectionBackend, BaseRequestOptions, Connection, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { UserService } from './user.service';

const mockUser = {
  users: [
    {
      id: 'id1',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'test@test.com',
      password: '123456',
    },
  ]
};

const errorResponse = new Response(new ResponseOptions({status: 400}));

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
      ]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
     expect(service).toBeTruthy();
  }));

  it('createUser() should create and return user', fakeAsync(inject([Http, MockBackend], (http: Http, mockBackend: MockBackend) => {
    const userService = new UserService(http);

    mockBackend.connections.subscribe((connection: MockConnection) => {
      if (connection.request.method === RequestMethod.Post && connection.request.url.endsWith('users')) {
        const response = new ResponseOptions({body: mockUser});
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
      expect(user.email).toEqual(expectedUser.email, 'user email should match');
    }, error => {
      console.log(error);
    });
  })));
});