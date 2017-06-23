import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  authService = '/api/v1/auth';

  constructor(private http: Http) { }

  getHeaders(): Headers {
    return new Headers({
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(this.authService,
      JSON.stringify({username: username, password: password}))
      .map(res => {
        const token = res.json() && res.json().token;
        if (token) {
          localStorage.setItem('currentUser', JSON.stringify({username: username, token: token}));
          return true;
        } else {
          return false;
        }

      }).catch(this.handleError);
  }

  isLoggedIn(): boolean {
    const token: String = this.getToken();
    return token && token.length > 0;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getToken(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    return token ? token : '';
  }

  handleError(error: Response | any): Observable<string> {
    // TODO: add alert error messages
    return Observable.throw(error.statusText);
  }

}
