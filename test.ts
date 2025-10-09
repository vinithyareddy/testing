import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Renderer2, OnInit, NgZone, AfterViewInit } from '@angular/core';
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
export class SsByVolumeProficiencyLevelComponent implements OnInit, AfterViewInit {

  fullview = false;
  viewMode: 'chart' | 'table' = 'chart';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  private chartRef: Highcharts.Chart | undefined;

  constructor(
    private render: Renderer2,
    private mockService: MockDataService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.loadChartData();
  }

  ngAfterViewInit(): void {
    // Wait until dashboard fully stabilizes, then force redraw
    setTimeout(() => {
      if (this.chartRef) {
        this.chartRef.reflow();
        this.chartRef.redraw();
        console.log('✅ Chart reflowed after view init');
      }
    }, 1200);
  }

  private loadChartData() {
    this.mockService.getSkillSupplyProficiency().subscribe({
      next: (data: any[]) => {
        console.log('✅ JSON Loaded:', data);
        if (!data || !data.length) return;

        const categories = data.map((d) => d.level);
        const awareness = data.map((d) => d.Awareness);
        const skilled = data.map((d) => d.Skilled);
        const advanced = data.map((d) => d.Advanced);
        const expert = data.map((d) => d.Expert);

        const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];

        this.zone.runOutsideAngular(() => {
          this.chartOptions = {
            chart: {
              type: 'column',
              events: {
                load: function () {
                  const chart = this as Highcharts.Chart;
                  setTimeout(() => {
                    chart.reflow();
                    chart.redraw();
                  }, 500);
                }
              }
            },
            title: { text: '' },
            credits: { enabled: false },
            xAxis: {
              categories,
              title: { text: '' },
              labels: {
                style: { color: '#111827', fontWeight: '600', fontSize: '12px' }
              },
              lineWidth: 0
            },
            yAxis: {
              min: 0,
              title: {
                text: 'Staff Count',
                style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
              },
              gridLineWidth: 1,
              gridLineDashStyle: 'Dash',
              gridLineColor: '#D1D5DB'
            },
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal',
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
              { type: 'column', name: 'Awareness', color: colors[0], pointWidth: 22, data: awareness },
              { type: 'column', name: 'Skilled', color: colors[1], pointWidth: 22, data: skilled },
              { type: 'column', name: 'Advanced', color: colors[2], pointWidth: 22, data: advanced },
              { type: 'column', name: 'Expert', color: colors[3], pointWidth: 22, data: expert }
            ]
          };
        });
      },
      error: (err) => console.error('❌ Error loading JSON:', err)
    });
  }

  fullPageView() {
    this.fullview = !this.fullview;
    this.fullview
      ? this.render.addClass(document.body, 'no-scroll')
      : this.render.removeClass(document.body, 'no-scroll');
  }
}


<div style="width: 100%; height: 400px;">
  <highcharts-chart
    [Highcharts]="Highcharts"
    [options]="chartOptions"
    (chartInstance)="chartRef = $event"
    style="width: 100%; height: 100%; display: block;"
  ></highcharts-chart>
</div>
