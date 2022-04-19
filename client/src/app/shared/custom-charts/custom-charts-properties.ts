import { CustomChartData, } from './custom-chart-data';
import { Component, ViewChild, ElementRef, OnInit, Directive } from '@angular/core';
import { Chart } from 'chart.js';
@Directive()
export class CustomChartProperties {
  public ChartData: any = []
  public ChartLabels: any = [];
  public ChartColors: any = [];
  public ChartType: any;
  @ViewChild('canvas',{ static: true }) canvas: ElementRef;
  public ChartOptions: any = {
    maintainAspectRatio: false,
    onHover: function (event) {
      event.srcElement.style.cursor = 'default';
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Revenue',
          fontColor: '#252729',
          fontWeight: 900,
          // ticks: {
          //   beginAtZero: true,
          //   fontColor: '#252729',

          //   // padding: {
          //   //   left: 56,
          //   //   right: 30,
          //   //   top: -50,
          //   //   bottom: 0
          //   // }
          // }
        }
      }],
      pointLabels: {
        fontStyle: 'bold',
      }
      // ticks: {
      //   padding: 5,
      //   beginAtZero: true,
      //   fontSize: 18,
      //   fontColor: '#000',
      //   fontStyle: 'bold',

      // }
    },
    layout: {
      padding: -5,
    },

    responsive: true,
    tooltips: {
      callbacks: {
        label: function (t, d) {
          const xLabel = d.datasets[t.datasetIndex].label;
          const yLabel = t.yLabel >= 1000 ?
            '$' + t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') :
            '$' + t.yLabel;
          return xLabel + ': ' + yLabel;
        }
      },
    },

    legend: {
      display: true,
      position: 'bottom',
      textAlign: 'left',
      padding: 160,
      onHover: function (event, legendItem) {
        if (legendItem) {
          event.srcElement.style.cursor = 'pointer';
        }
      },
      labels: {
        fontColor: '#252729',
        usePointStyle: true,
        fontSize: 12,
        fontWeight: 900,
        fontStyle: 'bold',
        position: 'left',
        boxWidth: 10,
        textAlign: 'bottom',
        padding: 15,
      },
      tooltips: {
        mode: 'label',
        backgroundColor: '#3556a5',
        custom: function (tooltip) {
          if (!tooltip.opacity) {
            document.getElementById('canvas').style.cursor = 'default';
            return;
          }
        }
      },
    }
  }

}
