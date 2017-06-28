import { Subject } from 'rxjs/Subject';

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
