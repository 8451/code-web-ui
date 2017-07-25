import { AssessmentResponse } from './../../domains/assessment-response';
import { AuthService } from './../auth/auth.service';
import { Assessment, AssessmentStateResponse } from './../../domains/assessment';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class AssessmentService {

  private assessmentsUrl = '/api/v1/assessments';

  constructor(private http: Http, private authService: AuthService) { }

  getAssessments(): Observable<Assessment[]> {
    return this.http.get(this.assessmentsUrl, { headers: this.authService.getHeaders() })
      .map(res => res.json().assessments)
      .catch(this.handleError);
  }

  searchAssessments(page: number, size: number, property: string, searchString: string): Observable<AssessmentResponse> {
    const searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('page', page.toString());
    searchParams.set('size', size.toString());
    searchParams.set('property', property);
    searchParams.set('searchString', searchString);

    return this.http.get(`${this.assessmentsUrl}/search`, {search: searchParams, headers: this.authService.getHeaders()})
      .map(res => res.json())
      .catch(this.handleError);
  }

  getAssessmentByGuid(guid: string): Observable<Assessment> {
    return this.http.get(`${this.assessmentsUrl}/${guid}`, { headers: this.authService.getHeaders() })
      .map(res => res.json().assessments[0])
      .catch(this.handleError);
  }

  getAssessmentStateByGuid(guid: string): Observable<AssessmentStateResponse> {
    return this.http.get(`${this.assessmentsUrl}/${guid}/status`)
      .map(res => res.json())
      .catch(this.handleError);
  }

  createAssessment(assessment: Assessment): Observable<Assessment> {
    return this.http.post(`${this.assessmentsUrl}`, assessment, { headers: this.authService.getHeaders() })
      .map(res => res.json().assessments[0])
      .catch(this.handleError);
  }

  updateAssessment(assessment: Assessment): Observable<Assessment> {
    return this.http.put(`${this.assessmentsUrl}`, assessment, { headers: this.authService.getHeaders() })
      .map(res => res.json().assessments[0])
      .catch(this.handleError);
  }

  exportCsv() {
    this.http.get(`${this.assessmentsUrl}/csv`, {headers: this.authService.getHeaders()}).subscribe(val => {
      const blob = new Blob([val.arrayBuffer()], {type: 'text/csv'});
      const filename = 'assessments.csv';
      this.saveCsv(blob, filename);
    });
  }

  private saveCsv(file: Blob, filename: string) {
      const url = window.URL.createObjectURL(file);
      const anchor = document.createElement('a');
      anchor.download = filename;
      anchor.href = url;
      anchor.click();
  }

  handleError (error: Response | any): Observable<string> {
    // TODO: add alert error messages
    return Observable.throw(error.statusText);
  }

}
