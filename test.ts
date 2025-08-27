import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  styleUrls: ['./swfp-by-fcv-status.component.scss']
})
export class SwfpByFcvStatusComponent {
  Highcharts: typeof Highcharts = Highcharts;

  /** values (default = screenshot) */
  @Input() fcv = 44;           // FCV (dark teal)
  @Input() nonFcv = 104;       // Non-FCV (light teal)
  @Input() widgetTitle = 'Workforce Supply (FTE) by FCV Status';

  private colorFCV = '#0B6F6A';
  private colorNonFCV = '#78C9C5';

  chartOptions: Highcharts.Options;

  constructor() {
    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        spacing: [10, 10, 0, 10],
        events: {
          // strongly type the callback's "this"
          render: function (this: Highcharts.Chart) {
            const chart = this;

            // compute total from first series
            const s = chart.series[0];
            const total =
              (s && s.points?.reduce((acc, p) => acc + (p.y || 0), 0)) || 0;

            // position for the center labels
            const cx = chart.plotLeft + chart.plotWidth / 2;
            const cy = chart.plotTop + chart.plotHeight * 0.88;

            // re-draw labels each render
            (chart as any).__centerValue?.destroy();
            (chart as any).__centerSub?.destroy();

            (chart as any).__centerValue = chart.renderer
              .text(Highcharts.numberFormat(total, 0), cx, cy - 6)
              .attr({ align: 'center' })
              .css({
                fontSize: '38px',
                fontWeight: '600',
                color: '#1a1a1a',
                fontFamily:
                  'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
              })
              .add();

            (chart as any).__centerSub = chart.renderer
              .text('By FCV Status', cx, cy + 20)
              .attr({ align: 'center' })
              .css({
                fontSize: '16px',
                color: '#3c3c3c',
                fontFamily:
                  'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
              })
              .add();
          }
        }
      },

      title: { text: undefined },
      credits: { enabled: false },
      tooltip: { enabled: false },
      legend: { enabled: false },

      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '85%'],
          size: '140%',
          innerSize: '70%',
          borderWidth: 0,
          allowPointSelect: false,
          dataLabels: {
            enabled: true,
            // IMPORTANT: for TS, type "this" and use this.percentage
            formatter: function (this: Highcharts.DataLabelsFormatterContextObject) {
              const p = Math.round(this.percentage || 0);
              return `${this.y}(${p}%)`;
            },
            distance: 18,
            style: {
              color: '#3c3c3c',
              fontSize: '13px',
              textOutline: 'none',
              fontFamily:
                'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
            }
          }
        }
      },

      series: [
        {
          type: 'pie',
          data: [
            { name: 'Non - FCV', y: this.nonFcv, color: this.colorNonFCV },
            { name: 'FCV', y: this.fcv, color: this.colorFCV }
          ]
        }
      ] as Highcharts.SeriesOptionsType[]
    };
  }
}
