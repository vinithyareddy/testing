import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Renderer2, OnInit, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LiftPopoverComponent } from '@lift/ui';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { MockDataService } from 'app/services/mock-data.service';

@Component({
  selector: 'app-ss-by-volume-proficiency-level',
  templateUrl: './ss-by-volume-proficiency-level.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LiftPopoverComponent,
    HighchartsChartModule,
  ],
  styleUrls: ['./ss-by-volume-proficiency-level.component.scss']
})
export class SsByVolumeProficiencyLevelComponent implements OnInit {

  fullview = false;
  viewMode: 'chart' | 'table' = 'chart';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  constructor(private render: Renderer2, private mockService: MockDataService, private zone: NgZone) {}

  ngOnInit() {
    // Load chart data from JSON instead of using random values
    this.loadChartData();
  }

  private loadChartData() {
    this.mockService.getSkillSupplyProficiency().subscribe({
      next: (data: any[]) => {
        console.log('✅ JSON Loaded:', data);

        if (!data || !data.length) {
          console.error('❌ No data found in JSON');
          return;
        }

        // Extract categories (levels)
        const categories = data.map((d) => d.level);

        // Extract each proficiency column
        const awareness = data.map((d) => d.Awareness);
        const skilled = data.map((d) => d.Skilled);
        const advanced = data.map((d) => d.Advanced);
        const expert = data.map((d) => d.Expert);

        // Colors and series names (same as old TS)
        const seriesNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
        const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];

        // Build chart options (identical to old look)
        this.zone.runOutsideAngular(() => {
          this.chartOptions = {
            chart: { type: 'column' },
            title: { text: '' },
            credits: { enabled: false },
            xAxis: {
              categories,
              title: {
                text: '',
                style: { color: '#111827', fontWeight: '500', fontSize: '13px' },
              },
              labels: { style: { color: '#111827', fontWeight: '600', fontSize: '12px' } },
              lineWidth: 0
            },
            yAxis: {
              min: 0,
              title: {
                text: 'Staff Count',
                style: { color: '#111827', fontWeight: '500', fontSize: '13px' },
              },
              gridLineWidth: 1,
              gridLineDashStyle: 'Dash',
              gridLineColor: '#D1D5DB'
            },
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
              itemStyle: { fontSize: '13px', fontWeight: '500' }
            },
            tooltip: {
              shared: true,
              headerFormat: '<b>{point.key}</b><br/>',
              pointFormat: '{series.name}: {point.y} FTE<br/>'
            },
            plotOptions: {
              column: {
                groupPadding: 0.2,
                pointPadding: 0.05,
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  style: { fontSize: '11px', color: '#111827' }
                }
              }
            },
            series: [
              { type: 'column', name: seriesNames[0], color: colors[0], pointWidth: 22, data: awareness },
              { type: 'column', name: seriesNames[1], color: colors[1], pointWidth: 22, data: skilled },
              { type: 'column', name: seriesNames[2], color: colors[2], pointWidth: 22, data: advanced },
              { type: 'column', name: seriesNames[3], color: colors[3], pointWidth: 22, data: expert }
            ]
          };
        });
      },
      error: (err) => console.error('❌ Error loading JSON:', err)
    });
  }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
  }
}
