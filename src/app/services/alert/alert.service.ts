import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

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

export class Alert<T> {
  type: AlertType;
  message: string;
  result?: Subject<T>;
}

export enum AlertType {
  INFO,
  ERROR,
  CONFIRMATION
}
