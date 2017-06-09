import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Question } from '../question';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class QuestionService {

  private questionsUrl = 'http://localhost:8090/api/v1/questions';

  constructor(private http: Http) { }

  getQuestions(): Promise<Question[]> {
    return this.http.get(this.questionsUrl)
      .toPromise()
      .then(response => response.json().questions as Question[])
      .catch(e => {
        console.error('An error occurred when retrieving questions', e);
        return Promise.reject(e.message || e);
      })
  }

  getQuestion(id: string): Promise<Question> {
    return this.http.get(`${this.questionsUrl}/${id}`)
    .toPromise()
    .then(response => response.json().question as Question)
      .catch(e => {
        console.error('An error occurred when trying to retrieve a question', e);
        return Promise.reject(e.message || e);
    });
  }
}
