import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Renderer2, ElementRef, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LiftPopoverComponent } from '@lift/ui';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { MockDataService } from 'app/services/mock-data.service';

@Component({
  selector: 'app-ss-by-volume-proficiency-level',
  templateUrl: './ss-by-volume-proficiency-level.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LiftPopoverComponent, HighchartsChartModule],
  styleUrls: ['./ss-by-volume-proficiency-level.component.scss']
})
export class SsByVolumeProficiencyLevelComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  chart: Highcharts.Chart | null = null;

  constructor(
    private render: Renderer2,
    private mockService: MockDataService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Give Angular some time to render layout before initializing chart
    setTimeout(() => this.loadChart(), 500);
  }

  loadChart(): void {
    this.mockService.getSkillSupplyProficiency().subscribe({
      next: (data: any[]) => {
        console.log('✅ JSON Loaded:', data);
        if (!data?.length) return;

        const categories = data.map((d) => d.level);
        const seriesNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
        const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];

        const series = seriesNames.map((name, i) => ({
          type: 'column' as const,
          name,
          color: colors[i],
          pointWidth: 22,
          data: data.map((d) => d[name])
        }));

        // Destroy old chart if it exists
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;
        }

        this.zone.runOutsideAngular(() => {
          this.chart = Highcharts.chart(this.chartContainer.nativeElement, {
            chart: {
              type: 'column',
              backgroundColor: 'transparent',
              animation: true
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
              gridLineDashStyle: 'Dash',
              gridLineColor: '#D1D5DB'
            },
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal',
              itemStyle: { fontWeight: '500', fontSize: '13px' }
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
                  style: { fontSize: '11px', color: '#111827', textOutline: 'none' }
                }
              }
            },
            series: series as Highcharts.SeriesColumnOptions[]
          });

          // Ensure chart resizes correctly after being placed in DOM
          setTimeout(() => {
            if (this.chart) {
              this.chart.reflow();
              this.chart.redraw();
              console.log('✅ Chart rendered and reflowed');
            }
          }, 500);
        });
      },
      error: (err) => console.error('❌ Error loading JSON:', err)
    });
  }

  fullPageView(): void {
    this.render.addClass(document.body, 'no-scroll');
  }
}
