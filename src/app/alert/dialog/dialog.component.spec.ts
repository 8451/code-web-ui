import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { MdDialogRef } from '@angular/material';
import { Alert, AlertType } from './../../services/alert/alert.service';

class MdDialogRefMock {}

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let alert: Alert<any> = {
    'type': AlertType.INFO,
    'message': 'Alert!',
  };

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

  // it('should display an alert message', () => {
  //   fixture.componentInstance.alert = alert;

  //   fixture.whenStable().then(() => {

  //   });
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;

  //   expect(compiled.querySelector('md-dialog-content').textContent).toContain(alert.message);
  // });

});
