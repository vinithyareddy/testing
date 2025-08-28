// swfp-by-fcv-status.component.ts
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  styleUrls: ['./swfp-by-fcv-status.component.scss']
})
export class SwfpByFcvStatusComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  
  private chart!: Highcharts.Chart;
  
  // Sample data - replace with your actual data
  private chartData = {
    total: 148,
    fcvPercentage: 30,
    nonFcvPercentage: 70,
    fcvCount: 44,
    nonFcvCount: 104
  };

  ngOnInit(): void {
    this.createChart();
  }

  private createChart(): void {
    const options: Highcharts.Options = {
      chart: {
        type: 'pie',
        backgroundColor: '#f8f9fa',
        height: 300,
        width: 300,
        margin: [0, 0, 0, 0],
        spacing: [10, 10, 10, 10]
      },
      title: {
        text: ''
      },
      tooltip: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          innerSize: '75%',
          startAngle: -90,
          endAngle: 270,
          dataLabels: {
            enabled: false
          },
          enableMouseTracking: false,
          borderWidth: 0,
          states: {
            hover: {
              enabled: false
            }
          }
        }
      },
      series: [{
        type: 'pie',
        data: [
          {
            name: 'FCV',
            y: this.chartData.fcvPercentage,
            color: '#2d7d5f'
          },
          {
            name: 'Non-FCV',
            y: this.chartData.nonFcvPercentage,
            color: '#5fb59b'
          }
        ]
      }]
    };

    this.chart = Highcharts.chart(this.chartContainer.nativeElement, options);
  }

  // Method to update data if needed
  updateData(newData: any): void {
    this.chartData = newData;
    this.chart.destroy();
    this.createChart();
  }
}