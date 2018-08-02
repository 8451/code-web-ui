import { MatDialogModule, MatSnackBarModule } from '@angular/material';
import { AlertModule } from './alert/alert.module';
import { PublicModule } from './public/public.module';
import { AlertService } from './alert/alert-service/alert.service';
import { ServicesModule } from './services/services.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AlertModule.forRoot(),
    ServicesModule,
    PublicModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
