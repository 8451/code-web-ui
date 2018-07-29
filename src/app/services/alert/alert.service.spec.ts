import { TestBed, inject } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { Alert, AlertType } from '../../domains/alert';

describe('AlertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService]
    });
  });

  it('should be created', inject([AlertService], (service: AlertService) => {
    expect(service).toBeTruthy();
  }));

  it('should create the correct INFO message when info is called', inject([AlertService], (service: AlertService) => {
    const msgContent = 'This is an info message.';
    service.getAlert().subscribe(msg => {
      expect(msg.type).toEqual(AlertType.INFO);
      expect(msg.message).toEqual(msgContent);
      expect(msg.result).toBeFalsy();
    });
    service.info(msgContent);
  }));

  it('should create the correct CONFIRMATION message when confirmation is called',
    inject([AlertService], (service: AlertService) => {
    const msgContent = 'This is a confirmation message.';
    service.getAlert().subscribe(msg => {
      expect(msg.type).toEqual(AlertType.CONFIRMATION);
      expect(msg.message).toEqual(msgContent);
      expect(msg.result).toBeTruthy();
    });
    service.confirmation(msgContent);
  }));

  it('should create the correct ERROR message when error is called', inject([AlertService], (service: AlertService) => {
    const msgContent = 'This is an error message';
    service.getAlert().subscribe(msg => {
      expect(msg.type).toEqual(AlertType.ERROR);
      expect(msg.message).toEqual(msgContent);
      expect(msg.result).toBeFalsy();
    });
    service.error(msgContent);
  }));

  it('should create a message with a Subject and return the same Subject when confirmation is called',
    inject([AlertService], (service: AlertService) => {
    let alert: Alert<any> = null;
    service.getAlert().subscribe(msg => alert = msg);
    const result = service.confirmation('Do you want to continue?');
    expect(alert.result).toBeTruthy();
  }));
});
