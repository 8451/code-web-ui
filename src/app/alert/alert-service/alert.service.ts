import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Alert, AlertType } from '../../domains/alert';

@Injectable()
export class AlertService {

  private message: Subject<Alert<any>> = new Subject<Alert<any>>();

  constructor() {
  }

  getAlert(): Observable<Alert<any>> {
    return this.message;
  }

  info(message: string, duration: number = 5000) {
    this.message.next({
      type: AlertType.INFO,
      message: message,
      duration: duration
    });
  }

  error(message: string, duration: number = 5000) {
    this.message.next({
      type: AlertType.ERROR,
      message: message,
      duration: duration
    });
  }

  confirmation(message: string, duration: number = 5000): Observable<boolean> {
    const subject = new Subject<boolean>();

    this.message.next({
      type: AlertType.CONFIRMATION,
      message: message,
      result: subject,
      duration: duration
    });

    return subject;
  }

}
