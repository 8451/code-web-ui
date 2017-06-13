import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from '../services/alert/alert.service';
import { Subscription } from 'rxjs/Subscription';
import { MdSnackBar } from '@angular/material';
import { Alert, AlertType } from '../services/alert/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {

  alertSubscription: Subscription = null;

  constructor(private alertService: AlertService, public snackBar: MdSnackBar) { }

  ngOnInit() {
    this.alertSubscription = this.alertService.getAlert().subscribe((alert) => this.handleAlert(alert));
  }

  ngOnDestroy() {
    this.alertSubscription.unsubscribe();
  }

  openInfoSnackBar(alert: Alert, action: string) {
    this.snackBar.open(alert.message, action, {
      duration: 2000,
    });
  }

  handleAlert(alert: Alert) {
    switch (alert.type) {
      case AlertType.INFO:
        this.openInfoSnackBar(alert, 'close');
        break;
    }
  }

}
