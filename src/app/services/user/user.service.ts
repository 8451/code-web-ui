import { UserVerification } from './../../domains/user-verification';
import { AuthService } from './../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from './../../domains/user';
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

@Injectable()
export class UserService {

  userService = '/api/v1/users';

  constructor(private http: Http, private authService: AuthService) { }

  createUser(user: User): Observable<User> {
    return this.http.post(this.userService, user)
      .map(res => res.json().users[0])
      .catch(this.handleError);
  }

  activateUser(activationCode: string): Observable<Response> {
    return this.http.get(`${this.userService}/activate/${activationCode}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put(this.userService, user, { headers: this.authService.getHeaders() })
      .map(res => res.json().users[0])
      .catch(this.handleError);
  }

  updateUserAndPassword(verifiedUser: UserVerification): Observable<User> {
    return this.http.put(`${this.userService}/password`, verifiedUser, { headers: this.authService.getHeaders() })
      .map(res => res.json().users[0])
      .catch(this.handleError);
  }

  getActiveUser(): Observable<User> {
    return this.http.get(`${this.userService}/activeUser`, { headers: this.authService.getHeaders() })
      .map(res => res.json().users[0])
      .catch(this.handleError);
  }

  handleError(error: Response | any): Observable<string> {
    // TODO: add alert error messages
    return Observable.throw(error.statusText);
  }
}
