import { DialogComponent } from './dialog/dialog.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from './alert-service/alert.service';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Alert, AlertType } from '../domains/alert';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  alertSubscription: Subscription = null;

  constructor(private alertService: AlertService, public snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit() {
    this.alertSubscription = this.alertService.getAlert().subscribe((alert) => this.handleAlert(alert));
  }

  ngOnDestroy() {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }

  openInfoSnackBar(alert: Alert<any>, action: string) {
    this.snackBar.open(alert.message, action, {
      duration: alert.duration,
    });
  }

  openConfirmation(alert: Alert<any>) {
    const dialog = this.dialog.open(DialogComponent, {});
    dialog.componentInstance.alert = alert;
    dialog.afterClosed()
      .subscribe(result => {
        alert.result.next(result);
      });
  }

  openErrorSnackBar(alert: Alert<any>, action: string) {
    this.snackBar.open(alert.message, action, {
      duration: alert.duration, panelClass: ['error-snack']
    });
  }

  handleAlert(alert: Alert<any>) {
    switch (alert.type) {
      case AlertType.INFO:
        this.openInfoSnackBar(alert, 'close');
        break;
      case AlertType.CONFIRMATION:
        this.openConfirmation(alert);
        break;
      case AlertType.ERROR:
      this.openErrorSnackBar(alert, 'close');
    }
  }

}
