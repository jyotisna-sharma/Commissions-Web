import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { CustomChartProperties } from './custom-charts-properties';
import { CustomChartData } from './custom-chart-data';
@Component({
  selector: 'app-custom-charts',
  templateUrl: './custom-charts.component.html',
  styleUrls: ['./custom-charts.component.scss']
})
export class CustomChartsComponent implements OnInit, OnChanges {
  @Input() chartProperties: CustomChartProperties
  @Input() isRefreshCount: Number;
  chartcolors = [
    '#8B0000',
    '#FF8C00',
    '#2E8B57',
    '#A0522D',
    '#2F4F4F',
    '#A0522D',
    '#06931C',
    '#FF6347',
    '#0000FF',
    '#000075',
    '#911eb4',
    '#CD5C5C',
    '#000080',
    '#800080',
    '#008000',
    '#000000',
    '#00FFFF',
    '#FF6133',
    '#33DDFF',
    '#333FFF',
    '#C70039',
    '#DA22AE',
    '#AA22DA']
  constructor() { }

  ngOnInit() {
    this.chartProperties.ChartData = this.OnCreateChartData(this.chartProperties.ChartData)
  }
  ngOnChanges() {

    if (this.isRefreshCount > 0) {
      this.chartProperties.ChartData = this.OnCreateChartData(this.chartProperties.ChartData)
    }

  }
  OnCreateChartData(Data) {
    if (Data && Data.length > 0) {
      const list = [];
      let index = 0;
      for (const revenuedata of Data) {
        const Yeardata = new CustomChartData();
        Yeardata.type = 'line';
        Yeardata.data = revenuedata.data;
        Yeardata.label = revenuedata.label;
        const color = this.GetColorCode(index);
        Yeardata.backgroundColor = color
        Yeardata.borderColor = color
        Yeardata.pointBackgroundColor = color

        list.push(Yeardata);
        index++;
      }
      return list;
    }
  }
  GetColorCode(index) {
    return this.chartcolors[index];
  }
}
