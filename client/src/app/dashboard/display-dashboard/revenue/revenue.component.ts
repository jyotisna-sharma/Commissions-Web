import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent implements OnInit {
  @Input() RevenueData: any;
  constructor() { }

  ngOnInit() {


  }
  GetGainLossValue(value) {

    if (value === 'Gain/Loss') {
      return 'greytext';
    } else if (value === 'Gain') {
      return 'greentext';
    } else {
      return 'redtext'
    }
  }
  GetTabClassName(value) {
    if (value === 'Net Revenue') {
      return 'NetRevenue'
    } else if (value === 'Gross Revenue') {
      return 'GrossRevenue'
    }
  }
}
