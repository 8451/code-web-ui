import { QuestionResponse } from './../../domains/question-response';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Question } from './../../domains/question';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class QuestionService {

  private questionsUrl = '/api/v1/questions';

  constructor(private http: Http, private authService: AuthService) { }

  getQuestions(): Observable<Question[]> {
    return this.http.get(this.questionsUrl, {headers: this.authService.getHeaders()})
      .map(res => res.json().questions)
      .catch(this.handleError);
  }

  getPageableQuestions(page: number, size: number, property: string): Observable<QuestionResponse> {
    const searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('page', page.toString());
    searchParams.set('size', size.toString());
    searchParams.set('property', property);

    return this.http.get(this.questionsUrl, {search: searchParams})
      .map(res => res.json())
      .catch(this.handleError);
  }

  getQuestion(id: string): Observable<Question> {
    return this.http.get(`${this.questionsUrl}/${id}`, {headers: this.authService.getHeaders()})
      .map(res => res.json().questions[0])
      .catch(this.handleError);
  }

  createQuestion(question: Question): Observable<Question> {
    return this.http.post(`${this.questionsUrl}`, question, {headers: this.authService.getHeaders()})
      .map(res => res.json().questions[0])
      .catch(this.handleError);
  }

  updateQuestion(question: Question): Observable<Question> {
    return this.http.put(`${this.questionsUrl}`, question, {headers: this.authService.getHeaders()})
      .map(res => res.json().questions[0])
      .catch(this.handleError);
  }

  deleteQuestion(id: string): Observable<boolean> {
    return this.http.delete(`${this.questionsUrl}/${id}`, {headers: this.authService.getHeaders()})
      .map(res => true)
      .catch(this.handleError);
  }

  handleError (error: Response | any): Observable<string> {
    // TODO: add alert error messages
    return Observable.throw(error.statusText);
  }

}
