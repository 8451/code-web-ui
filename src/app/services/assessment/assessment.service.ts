import { AuthService } from './../auth/auth.service';
import { Assessment,  AssessmentStateResponse } from './../../domains/assessment';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AssessmentService {

  private assessmentsUrl = '/api/v1/assessments';

  constructor(private http: Http, private authService: AuthService) { }

  getAssessments(): Observable<Assessment[]> {
    return this.http.get(this.assessmentsUrl, {headers: this.authService.getHeaders()})
      .map(res => res.json().assessments)
      .catch(this.handleError);
  }

  getAssessmentByGuid(guid: string): Observable<Assessment> {
    return this.http.get(`${this.assessmentsUrl}/${guid}`, {headers: this.authService.getHeaders()})
      .map(res => res.json().assessments[0])
      .catch(this.handleError);
  }

  getAssessmentStateByGuid(guid: string): Observable<AssessmentStateResponse> {
    return this.http.get(`${this.assessmentsUrl}/${guid}/status`)
      .map(res => res.json())
      .catch(this.handleError);
  }

  createAssessment(assessment: Assessment): Observable<Assessment> {
    return this.http.post(`${this.assessmentsUrl}`, assessment, {headers: this.authService.getHeaders()})
      .map(res => res.json().assessments[0])
      .catch(this.handleError);
  }

  updateAssessment(assessment: Assessment): Observable<Assessment> {
    return this.http.put(`${this.assessmentsUrl}`, assessment, {headers: this.authService.getHeaders()})
      .map(res => res.json().assessments[0])
      .catch(this.handleError);
  }

  handleError (error: Response | any): Observable<string> {
    // TODO: add alert error messages
    return Observable.throw(error.statusText);
  }

}
