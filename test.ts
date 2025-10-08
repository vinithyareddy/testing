import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { MockDataService } from 'app/services/mock-data.service';

@Component({
  selector: 'app-ss-by-volume-proficiency-level',
  standalone: true,
  template: `
    <div style="padding: 20px;">
      <h4>Skill Supply by Volume (FTE) and Proficiency Level</h4>
      <div *ngIf="isReady; else loading">
        <highcharts-chart
          [Highcharts]="Highcharts"
          [options]="chartOptions"
          style="width: 100%; height: 400px; display: block;"
        ></highcharts-chart>
      </div>
      <ng-template #loading>
        <p>Loading chart data...</p>
      </ng-template>
    </div>
  `,
  imports: [CommonModule, HttpClientModule, HighchartsChartModule]
})
export class SsByVolumeProficiencyLevelComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  isReady = false;

  constructor(private mockService: MockDataService) {}

  ngOnInit() {
    // Load JSON
    this.mockService.getSkillSupplyProficiency().subscribe({
      next: (data: any[]) => {
        console.log('✅ Loaded JSON:', data);

        const categories = data.map((d) => d.proficiency || d.name);
        const fte = data.map((d) => Number(d.fte || d.value));

        this.chartOptions = {
          chart: { type: 'column' },
          title: { text: '' },
          credits: { enabled: false },
          xAxis: {
            categories,
            labels: { style: { fontSize: '12px', fontWeight: '600', color: '#111827' } }
          },
          yAxis: {
            title: { text: 'FTE Count' },
            gridLineColor: '#E5E7EB'
          },
          plotOptions: {
            column: {
              pointWidth: 35,
              borderWidth: 0,
              dataLabels: { enabled: true }
            }
          },
          series: [
            {
              type: 'column',
              name: 'FTE Count',
              colorByPoint: true,
              colors: ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'],
              data: fte
            }
          ]
        };

        this.isReady = true;
      },
      error: (err) => console.error('❌ Error loading JSON:', err)
    });
  }
}
