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

    return this.http.get(this.questionsUrl, {
        search: searchParams,
        headers: this.authService.getHeaders()
      })
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

  getLanguages(): Observable<string[]> {
    return this.http.get(`${this.questionsUrl}/languages`, {headers: this.authService.getHeaders()})
    .map(res => res.json().languages)
    .catch(this.handleError);
  }
  handleError (error: Response | any): Observable<string> {
    // TODO: add alert error messages
    return Observable.throw(error.statusText);
  }

}

const languages = {
    'SQL': { editorName: 'sql', color: '#DAD8D8'},
    'Python2': { editorName: 'python', color: '#3572A5'},
    'Python3': { editorName: 'python', color: '#3572A5'},
    'C#': { editorName: 'csharp', color: '#178600'},
    'C': { editorName: 'c_cpp', color: '#555555'},
    'C++': { editorName: 'c_cpp', color: '#F34B7D'},
    'Powershell': { editorName: 'powershell', color: '#012456'},
    'Bash': { editorName: 'sh', color: '#89E051'},
    'Javascript': { editorName: 'javascript', color: '#89E051'},
    'Typescript': { editorName: 'typescript', color: '#2B7489'},
    'Ruby': { editorName: 'ruby', color: '#701516'},
    'PHP': { editorName: 'php', color: '#4F5D95'},
    'Scala': { editorName: 'scala', color: '#C22D40'},
    'Java': { editorName: 'java', color: '#B07219'}
};

export function editorTranslator(serviceValue: string): string {
  const obj = languages[serviceValue];
  return obj ? obj.editorName : 'java';
}

export function languageColor(serviceValue: string): string{
  const obj = languages[serviceValue];
  return obj ? obj.color : 'black';
}
