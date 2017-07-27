import { UserVerification } from './../../domains/user-verification';
import { UserResponse } from './../../domains/user-response';
import { AuthService } from './../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from './../../domains/user';
import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { AlertService } from '../alert/alert.service';
import { ResetForgottenPassword } from '../../domains/reset-forgotten-password';

@Injectable()
export class UserService {

  userService = '/api/v1/users';

  constructor(
    private http: Http,
    private authService: AuthService,
    private alertService: AlertService,
  ) { }

  getUsers(): Observable<User[]> {
    return this.http.get(this.userService, { headers: this.authService.getHeaders() })
      .map(res => res.json().users).catch(this.handleError);
  }

  searchUsers(page: number, size: number, property: string, searchString: string): Observable<UserResponse> {
    const searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('page', page.toString());
    searchParams.set('size', size.toString());
    searchParams.set('property', property);
    searchParams.set('searchString', searchString);

    return this.http.get(`${this.userService}/search`, {
      search: searchParams,
      headers: this.authService.getHeaders()
    })
      .map(res => res.json())
      .catch(this.handleError);
  }

  createUser(user: User): Observable<User> {
    return this.http.post(this.userService, user)
      .map(res => res.json().users[0])
      .catch(this.handleError);
  }

  deleteUser(id: string): Observable<boolean> {
    return this.http.delete(`${this.userService}/${id}`, { headers: this.authService.getHeaders() })
      .map(res => true)
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

  unlockUser(user: User): Observable<User> {
    return this.http.put(`${this.userService}/unlock`, user, { headers: this.authService.getHeaders() })
      .map(res => res.json().users[0])
      .catch(this.handleError);
  }

  getActiveUser(): Observable<User> {
    return this.http.get(`${this.userService}/activeUser`, { headers: this.authService.getHeaders() })
      .map(res => res.json().users[0])
      .catch(this.handleError);
  }

  forgotPassword(username: string) {
    const urlParams = new URLSearchParams();
    urlParams.set('username', username);
    this.http.get(`${this.userService}/forgot-password`, {search: urlParams}).subscribe(res => {
      this.alertService.info('Check your email to reset your password');
    }, error => {
      this.alertService.error('Error sending forgot password request');
    });
  }

  resetForgottenPassword(request: ResetForgottenPassword): Observable<Response> {
    return this.http.put(`${this.userService}/forgot-password`, request);
  }

  handleError(error: Response | any): Observable<any> {
    // TODO: add alert error messages
    return Observable.throw(error.statusText);
  }
}
