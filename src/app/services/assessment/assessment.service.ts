import { Assessment } from './../../domains/assessment';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AssessmentService {

  private assessmentsUrl = 'http://code-bff.ci.cfapps.int.8451.com/api/v1/assessments';

  constructor(private http: Http) { }

  getAssessments(): Observable<Assessment[]> {
    return this.http.get(this.assessmentsUrl)
      .map(res => res.json().assessments)
      .catch(this.handleError);
  }

  createAssessment(assessment: Assessment): Observable<Assessment> {
    return this.http.post(`${this.assessmentsUrl}`, assessment)
      .map(res => res.json().assessments[0])
      .catch(this.handleError);
  }

  handleError (error: Response | any): Observable<string> {
    // TODO: add alert error messages
    return Observable.throw(error.statusText);
  }

}