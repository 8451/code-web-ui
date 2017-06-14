import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { MdDialogRef } from '@angular/material';
import { Alert, AlertType } from './../../services/alert/alert.service';

class MdDialogRefMock {
  close(confirmed: string) {
  }
}

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let alert: Alert<any> = {
    'type': AlertType.INFO,
    'message': 'Alert!',
  };
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogComponent ],
      providers: [ { provide: MdDialogRef, useClass: MdDialogRefMock } ]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display an alert message', () => {
    fixture.componentInstance.alert = alert;

    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#alert-message').innerHTML).toContain(alert.message);

  });

  it('should call dialogRef.close() with true argument', () => {
    spyOn(component.dialogRef, 'close');

    const button = fixture.nativeElement.querySelector('#yes-button');
    expect(button.innerHTML).toContain('Yes');

    button.click();

    fixture.whenStable().then(() => {
      expect(component.dialogRef.close).toHaveBeenCalledWith(true);
    });
  });

  it('should call dialogRef.close() with no argument', () => {
    spyOn(component.dialogRef, 'close');

    const button = fixture.nativeElement.querySelector('#no-button');
    expect(button.innerHTML).toContain('No');

    button.click();

    fixture.whenStable().then(() => {
      expect(component.dialogRef.close).toHaveBeenCalledWith();
    });
  });

});
