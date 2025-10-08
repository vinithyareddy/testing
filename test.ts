import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-ss-by-volume-proficiency-level',
  template: `
    <div style="border:1px solid #ccc;padding:10px">
      <highcharts-chart
        [Highcharts]="Highcharts"
        [options]="chartOptions"
        style="width: 100%; height: 400px; display: block;"
      ></highcharts-chart>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, HighchartsChartModule]
})
export class SsByVolumeProficiencyLevelComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: 'Test Chart' },
    xAxis: { categories: ['A', 'B', 'C'] },
    series: [
      { type: 'column', data: [10, 20, 30], colorByPoint: true }
    ]
  };
}
