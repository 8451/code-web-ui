import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDialogModule, MatSnackBarModule } from '@angular/material';
import { ServicesModule } from '../services/services.module';
import { AlertService } from './alert-service/alert.service';
import { AlertComponent } from './alert.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
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
    AlertComponent,
    DialogComponent,
  ]
})
export class AlertModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AlertModule,
      providers: [AlertService]
    }
  }
}
