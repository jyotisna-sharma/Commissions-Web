import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-overwrite',
  templateUrl: './settings-overwrite.component.html',
  styleUrls: ['./settings-overwrite.component.scss']
})
export class SettingsOverwriteComponent implements OnInit {
  TextList: any;
  defaultSelected: any;
  constructor(
    public dialogRef: MatDialogRef<SettingsOverwriteComponent>,
  ) { }

  ngOnInit() {
    this.TextList = [
      {
        key: 2,
        value: ' Save and overwrite all policies with matching configuration.'
      },
      {
        key: 1,
        value: 'Save and overwrite matching policies with no incoming schedule.'
      },
      {
        key: 0,
        value: 'Save without changing policies.'
      }
    ];
    this.defaultSelected = 1;
  }
  OnClosePopup() {
    this.dialogRef.close(false);
  }
}
