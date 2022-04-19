import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface BatchCounts {
  totalcount: any;
  failedBatchCount: any;
  successCount: any;
  headingTitle: any;
  subTitle: any;
  failedbatches: any;
}
@Component({
  selector: 'app-marked-paid-batch-list',
  templateUrl: './marked-paid-batch-list.component.html',
  styleUrls: ['./marked-paid-batch-list.component.scss']
})

export class MarkedPaidBatchListComponent implements OnInit {
  failedBatches: [];
  constructor(
    public dilogref: MatDialogRef<MarkedPaidBatchListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BatchCounts,
  ) { }
  ngOnInit() {
    this.failedBatches = this.data.failedbatches;
  }
  OnClosePopup() {
    this.dilogref.close();
  }
}
