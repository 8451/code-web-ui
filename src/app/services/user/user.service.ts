import { Observable } from 'rxjs/Observable';
import { User } from './../../domains/user';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Injectable()
export class UserService {

  userSerivce = 'users';

  constructor(private http: Http) { }

  createUser(user: User): Observable<User> {
    return this.http.post(this.userSerivce, user)
      .map(res => {
        return res.json().users[0];
      }).catch(this.handleError);
  }

  handleError (error: Response | any): Observable<string> {
    // TODO: add alert error messages
    return Observable.throw(error.statusText);
  }
}
