import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Alert, AlertType } from '../../domains/alert';

@Injectable()
export class AlertService {

  private message: Subject<Alert<any>> = new Subject<Alert<any>>();

  constructor() { }

  getAlert(): Observable<Alert<any>> {
    return this.message;
  }

  info(message: string) {
    this.message.next({
      type: AlertType.INFO,
      message: message
    });
  }

  error(message: string) {
    this.message.next({
      type: AlertType.ERROR,
      message: message
    });
  }

  confirmation(message: string): Observable<boolean> {
    const subject = new Subject<boolean>();

    this.message.next({
      type: AlertType.CONFIRMATION,
      message: message,
      result: subject
    });

    return subject;
  }

}
