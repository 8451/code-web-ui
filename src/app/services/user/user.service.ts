import { Observable } from 'rxjs/Observable';
import { User } from './../../domains/user';
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

@Injectable()
export class UserService {

  userSerivce = '/api/v1/users';

  constructor(private http: Http) { }

  createUser(user: User): Observable<User> {
    return this.http.post(this.userSerivce, user)
      .map(res => res.json().users[0]).catch(this.handleError);
  }

  activateUser(activationCode: string): Observable<Response> {
    return this.http.get(`${this.userSerivce}/activate/${activationCode}`);
  }

  handleError(error: Response | any): Observable<string> {
    // TODO: add alert error messages
    return Observable.throw(error.statusText);
  }
}
