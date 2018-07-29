import { Alert } from '../../domains/alert';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  public alert: Alert<any> = new Alert<any>();

  constructor(public dialogRef: MatDialogRef<DialogComponent>) {}

  ngOnInit() {
  }

}
