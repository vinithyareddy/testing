import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

type Slice = { name: string; value: number; color?: string };

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  styleUrls: ['./swfp-by-fcv-status.component.scss']
})
export class SwfpByFcvStatusComponent implements OnChanges {
  Highcharts: typeof Highcharts = Highcharts;

  /** Chart data: two or more slices {name, value, color?} */
  @Input() data: Slice[] = [];

  /** Header/title shown by your page (not Highcharts title) */
  @Input() title = 'Workforce Supply (FTE) by FCV Status';

  /** Subtitle printed in the center under the big number */
  @Input() centerSubtitle = 'By FCV Status';

  /** Show labels like "value(percent)%" near the arc */
  @Input() showValuePercentLabels = true;

  /** Visual tweakables (no magic numbers) */
  @Input() startAngle = -90;
  @Input() endAngle = 90;
  @Input() innerSize = '70%';    // thickness: higher = thinner ring
  @Input() size = '140%';        // overall arc size
  @Input() centerY = '85%';      // vertical position of arc (e.g., '82%'..'88%')
  @Input() centerTextYOffset = 0;// nudge the center texts if needed

  chartOptions: Highcharts.Options = {};

  ngOnChanges(_: SimpleChanges): void {
    this.buildOptions();
  }

  private buildOptions(): void {
    const total = this.data.reduce((acc, s) => acc + (s.value || 0), 0);

    // Convert to Highcharts series points
    const points = this.data.map(p => ({
      name: p.name,
      y: p.value,
      color: p.color
    }));

    const subtitle = this.centerSubtitle;

    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        spacing: [10, 10, 0, 10],
        events: {
          render: function (this: Highcharts.Chart) {
            const chart = this;

            const cx = chart.plotLeft + chart.plotWidth / 2;
            const cy = chart.plotTop + chart.plotHeight * 0.88;

            (chart as any).__centerValue?.destroy();
            (chart as any).__centerSub?.destroy();

            (chart as any).__centerValue = chart.renderer
              .text(Highcharts.numberFormat(total, 0), cx, cy - 6)
              .attr({ align: 'center' })
              .css({ fontSize: '38px', fontWeight: 600, color: '#1a1a1a' })
              .add();

            (chart as any).__centerSub = chart.renderer
              .text(subtitle, cx, cy + 20)
              .attr({ align: 'center' })
              .css({ fontSize: '16px', color: '#3c3c3c' })
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
          startAngle: this.startAngle,
          endAngle: this.endAngle,
          center: ['50%', this.centerY],
          size: this.size,
          innerSize: this.innerSize,
          borderWidth: 0,
          allowPointSelect: false,
          dataLabels: {
            enabled: this.showValuePercentLabels,
            formatter: function (this: any) {
              const p = Math.round(this.percentage || 0);
              return `${this.y}(${p}%)`;
            },
            distance: 18,
            style: { color: '#3c3c3c', fontSize: '13px', textOutline: 'none' }
          }
        }
      },

      series: [
        { type: 'pie', data: points }
      ] as Highcharts.SeriesOptionsType[]
    };
  }
}
