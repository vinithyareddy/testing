import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Renderer2, NgZone } from '@angular/core';
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
    HighchartsChartModule
  ],
  styleUrls: ['./ss-by-volume-proficiency-level.component.scss']
})
export class SsByVolumeProficiencyLevelComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  updateFlag = false;
  fullview = false;

  constructor(
    private render: Renderer2,
    private mockService: MockDataService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.mockService.getSkillSupplyProficiency().subscribe({
      next: (data: any[]) => {
        console.log('✅ JSON Loaded:', data);
        if (!data?.length) return;

        const categories = data.map(d => d.level);
        const seriesNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
        const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];

        const series = seriesNames.map((name, i) => ({
          type: 'column',
          name,
          color: colors[i],
          pointWidth: 22,
          data: data.map(d => d[name])
        }));

        this.zone.runOutsideAngular(() => {
          this.chartOptions = {
            chart: { type: 'column', backgroundColor: 'transparent' },
            title: { text: '' },
            credits: { enabled: false },
            xAxis: {
              categories,
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
            series
          };

          // force chart to re-render after data update
          setTimeout(() => {
            this.zone.run(() => (this.updateFlag = true));
          }, 50);
        });
      },
      error: (err) => console.error('❌ Error loading JSON:', err)
    });
  }

  fullPageView(): void {
    this.fullview = !this.fullview;
    this.fullview
      ? this.render.addClass(document.body, 'no-scroll')
      : this.render.removeClass(document.body, 'no-scroll');
  }
}
