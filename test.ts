import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Renderer2, OnInit, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
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
  styleUrls: ['./ss-by-volume-proficiency-level.component.scss'],
})
export class SsByVolumeProficiencyLevelComponent implements OnInit, AfterViewInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartRef: Highcharts.Chart | undefined;

  constructor(
    private mockService: MockDataService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  ngAfterViewInit(): void {
    // Double trigger redraw once layout is ready
    setTimeout(() => {
      this.triggerReflow();
    }, 1000);

    // Also trigger again after 3 seconds for safety (dashboard fully loaded)
    setTimeout(() => {
      this.triggerReflow();
    }, 3000);
  }

  private triggerReflow(): void {
    if (this.chartRef) {
      this.chartRef.reflow();
      this.chartRef.redraw();
      console.log('✅ Chart force reflow triggered');
    }
  }

  private loadChartData(): void {
    this.mockService.getSkillSupplyProficiency().subscribe({
      next: (data: any[]) => {
        console.log('✅ JSON Loaded:', data);
        if (!data?.length) return;

        const categories = data.map((d) => d.level);
        const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];
        const seriesNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
        const series = seriesNames.map((key, i) => ({
          type: 'column' as const,
          name: key,
          color: colors[i],
          pointWidth: 22,
          data: data.map((d) => d[key]),
        }));

        this.zone.run(() => {
          this.chartOptions = {
            chart: {
              type: 'column',
              backgroundColor: 'transparent',
              animation: true,
              style: { fontFamily: 'Inter, sans-serif' },
              events: {
                load: function () {
                  const chart = this as Highcharts.Chart;
                  setTimeout(() => {
                    chart.reflow();
                    chart.redraw();
                  }, 300);
                },
              },
            },
            title: { text: '' },
            credits: { enabled: false },
            xAxis: {
              categories,
              title: { text: '' },
              labels: {
                style: { color: '#111827', fontWeight: '600', fontSize: '12px' },
              },
              lineWidth: 0,
            },
            yAxis: {
              min: 0,
              title: {
                text: 'Staff Count',
                style: { color: '#111827', fontWeight: '500', fontSize: '13px' },
              },
              gridLineDashStyle: 'Dash',
              gridLineColor: '#D1D5DB',
            },
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal',
              itemStyle: { fontSize: '13px', fontWeight: '500' },
            },
            tooltip: {
              shared: true,
              headerFormat: '<b>{point.key}</b><br/>',
              pointFormat: '{series.name}: {point.y} FTE<br/>',
            },
            plotOptions: {
              column: {
                groupPadding: 0.2,
                pointPadding: 0.05,
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  style: { fontSize: '11px', color: '#111827' },
                },
              },
            },
            series: series,
          };
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error('❌ Error loading JSON:', err),
    });
  }
}


#skill-supply-chart {
    width: 100%;
    height: 400px;
    min-height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  :host ::ng-deep highcharts-chart {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
  