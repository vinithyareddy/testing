import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  styleUrls: ['./swfp-by-fcv-status.component.scss']
})
export class SwfpByFcvStatusComponent {
  Highcharts: typeof Highcharts = Highcharts;

  /** Dynamic inputs instead of hardcoded values */
  @Input() fcv = 30;
  @Input() nonFcv = 70;
  @Input() widgetTitle = 'Workforce Supply (FTE) by FCV Status';
  @Input() centerSubText = 'By FCV Status';
  @Input() labelFCV = 'FCV';
  @Input() labelNonFCV = 'Non - FCV';
  @Input() colorFCV = '#0B6F6A';
  @Input() colorNonFCV = '#78C9C5';

  chartOptions: Highcharts.Options;

  constructor() {
    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        spacing: [10, 10, 0, 10],
        events: {
          render: function (this: Highcharts.Chart) {
            const chart = this;
            const s = chart.series[0];
            const total = (s && s.points?.reduce((acc, p) => acc + (p.y || 0), 0)) || 0;

            const cx = chart.plotLeft + chart.plotWidth / 2;
            const cy = chart.plotTop + chart.plotHeight * 0.88;

            (chart as any).__centerValue?.destroy();
            (chart as any).__centerSub?.destroy();

            (chart as any).__centerValue = chart.renderer
              .text(Highcharts.numberFormat(total, 0), cx, cy - 6)
              .attr({ align: 'center' })
              .css({
                fontSize: '38px',
                fontWeight: '600',
                color: '#1a1a1a',
                fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
              })
              .add();

            (chart as any).__centerSub = chart.renderer
              .text((chart.options as any).centerSubText || '', cx, cy + 20)
              .attr({ align: 'center' })
              .css({
                fontSize: '16px',
                color: '#3c3c3c',
                fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
              })
              .add();
          }
        }
      },

      title: { text: undefined },
      credits: { enabled: false },
      tooltip: { enabled: false },

      legend: {
        enabled: true,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
      },

      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '85%'],
          size: '140%',
          innerSize: '80%',
          borderWidth: 0,
          borderRadius: 60,
          allowPointSelect: false,
          dataLabels: {
            enabled: true,
            distance: 24,
            formatter: function (this: any) {
              const p = Math.round(this.percentage || 0);
              return `${this.y} (${p}%)`;
            },
            style: {
              color: '#3c3c3c',
              fontSize: '13px',
              textOutline: 'none',
              textOverflow: 'none'
            }
          }
        }
      },

      series: [
        {
          type: 'pie',
          data: [
            { name: this.labelNonFCV, y: this.nonFcv, color: this.colorNonFCV },
            { name: this.labelFCV, y: this.fcv, color: this.colorFCV }
          ]
        }
      ] as Highcharts.SeriesOptionsType[],

      /** custom property for render() */
      centerSubText: this.centerSubText
    };
  }
}
