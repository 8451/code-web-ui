import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AlertService {

  private message: Subject<Alert> = new Subject<Alert>();

  constructor() { }

  getAlert(): Observable<Alert> {
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
    this.message.next({
      type: AlertType.CONFIRMATION,
      message: message
    });

    return Observable.of(false);
  }

}

export class Alert {
  type: AlertType;
  message: string;
}

export enum AlertType {
  INFO,
  ERROR,
  CONFIRMATION
}
