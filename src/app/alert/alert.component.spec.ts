import { DialogComponent } from './dialog/dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, MdSnackBar, MdDialogRef } from '@angular/material';
import { AlertService, Alert, AlertType } from './../services/alert/alert.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  const infoAlert: Alert<any> = {
    'type': AlertType.INFO,
    'message': 'Info Alert!',
  };
  const confirmationAlert: Alert<any> = {
    'type': AlertType.CONFIRMATION,
    'message': 'Info Alert!',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule
      ],
      declarations: [ AlertComponent ],
      providers: [ AlertService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call openInfoSnackbar when an Info alert is called with handleAlert', () => {
    spyOn(component, 'openInfoSnackBar');

    component.handleAlert(infoAlert);

    expect(component.openInfoSnackBar).toHaveBeenCalledWith(infoAlert, 'close');
  });

    it('should call openConfirmation when a confirmation alert is called with handleAlert', () => {
    spyOn(component, 'openConfirmation');

    component.handleAlert(confirmationAlert);

    expect(component.openConfirmation).toHaveBeenCalledWith(confirmationAlert);
    component.dialog.afterOpen.subscribe((result) => {
      expect(result).toBeTruthy();
    });
  });

  it('should get a result from confirmation alert', () => {
    spyOn(component, 'openConfirmation');

    component.handleAlert(confirmationAlert);

    component.dialog.afterOpen.subscribe((result: MdDialogRef<DialogComponent>) => {
      expect(result.componentInstance.alert).toBeTruthy();
    });
  });


});
