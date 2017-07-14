import { Subject } from 'rxjs/Subject';

export class Alert<T> {
  type: AlertType;
  message: string;
  duration: number;
  result?: Subject<T>;
}

export enum AlertType {
  INFO,
  ERROR,
  CONFIRMATION
}
