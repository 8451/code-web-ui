import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';
import { ServicesModule } from '../services/services.module';
import { AlertComponent } from './alert.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ServicesModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  declarations: [
    AlertComponent,
    DialogComponent
  ],
  entryComponents: [
    DialogComponent,
    AlertComponent,
  ],
  exports: [
    AlertComponent
  ]
})
export class AlertModule { }
