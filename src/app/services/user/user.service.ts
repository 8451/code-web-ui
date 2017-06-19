import { Observable } from 'rxjs/Observable';
import { User } from './../../domains/user';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Injectable()
export class UserService {

  userSerivce = 'user';

  constructor(private http: Http) { }

  createUser(user: User): Observable<User> {
    return null;
  }
}
