import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Question } from './../../domains/question';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class QuestionService {

  // TODO: dynamically fill this based on the environment.
  private questionsUrl = 'http://code-bff.ci.cfapps.int.8451.com/api/v1/questions';

  constructor(private http: Http) { }

  getQuestions(): Observable<Question[]> {
    return this.http.get(this.questionsUrl)
      .map((res) => {
        console.log(res.json().questions);
        return res.json().questions;
      })
      .catch(this.handleError);

  }

  getQuestion(id: string): Observable<Question> {
    return this.http.get(`${this.questionsUrl}/${id}`)
      .map(res => res.json().questions[0])
      .catch(this.handleError);
  }

  createQuestion(question: Question): Observable<Question> {
    return this.http.post(`${this.questionsUrl}`, question)
      .map(res => res.json().questions[0])
      .catch(this.handleError);
  }

  updateQuestion(question: Question): Observable<Question> {
    return this.http.put(`${this.questionsUrl}`, question)
      .map(res => res.json().questions[0])
      .catch(this.handleError);
  }

  deleteQuestion(id: string): Observable<boolean> {
    return this.http.delete(`${this.questionsUrl}/${id}`)
      .map(res => true)
      .catch(this.handleError);
  }

  handleError (error: Response | any) : Observable<string> {
    // TODO: add alert error messages
    return Observable.throw(error.statusText);
  }

}
