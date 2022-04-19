/* 
AuthorName:Acmeminds
ModifiedDate:
Number of Methods: 2 
*/


import { CalenderDataService } from './../../_services/calender-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
export interface statementData {
  statementDetails: any;
  BatchDetails: any;
}
@Component({
  selector: 'app-change-statement-date',
  templateUrl: './change-statement-date.component.html',
  styleUrls: ['./change-statement-date.component.scss']
})
export class ChangeStatementDateComponent implements OnInit {
  // StatementDate: NativeElement;
  statementDate = new FormControl('', {});
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: statementData,
    public dialogRef: MatDialogRef<ChangeStatementDateComponent>,
    public calenderDataService: CalenderDataService
  ) { }
  ngOnInit() {
    this.statementDate.disable();
    this.statementDate.setValue(new Date(this.data.statementDetails.StatementDateString));
  }
  OnUpdateStatementDate(stmntDate) {
    const date = this.calenderDataService.GetmmDDyyyFormat(stmntDate);
    this.dialogRef.close(date);
  }
  OnclosePopup() {
    this.dialogRef.close(false);
  }
}
