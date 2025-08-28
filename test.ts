import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  styleUrls: ['./swfp-by-fcv-status.component.scss']
})
export class SwfpByFcvStatusComponent {
  Highcharts: typeof Highcharts = Highcharts;

  /** Data Inputs */
  @Input() fcv = 30;
  @Input() nonFcv = 70;

  /** Labels & Titles */
  @Input() widgetTitle = 'Workforce Supply (FTE) by FCV Status';
  @Input() centerSubText = 'By FCV Status';
  @Input() labelFCV = 'FCV';
  @Input() labelNonFCV = 'Non - FCV';

  /** Colors */
  @Input() colorFCV = '#0B6F6A';
  @Input() colorNonFCV = '#78C9C5';
  @Input() centerValueColor = '#1a1a1a';
  @Input() centerSubColor = '#3c3c3c';
  @Input() dataLabelColor = '#3c3c3c';

  /** Font Styles */
  @Input() centerValueFontSize = '38px';
  @Input() centerValueFontWeight = '600';
  @Input() centerSubFontSize = '16px';
  @Input() dataLabelFontSize = '13px';
  @Input() fontFamily =
    'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';

  /** Chart Layout */
  @Input() chartSpacing: number[] = [10, 10, 0, 10];
  @Input() startAngle = -90;
  @Input() endAngle = 90;
  @Input() center: [string, string] = ['50%', '85%'];
  @Input() size = '140%';
  @Input() innerSize = '80%';
  @Input() borderRadius = 60;
  @Input() dataLabelDistance = 24;

  chartOptions: Highcharts.Options;

  constructor() {
    const self = this; // keep reference for render callback

    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        spacing: this.chartSpacing,
        events: {
          render: function (this: Highcharts.Chart) {
            const chart = this;
            const s = chart.series[0];
            const total = (s && s.points?.reduce((acc, p) => acc + (p.y || 0), 0)) || 0;

            const cx = chart.plotLeft + chart.plotWidth / 2;
            const cy = chart.plotTop + chart.plotHeight * 0.88;

            (chart as any).__centerValue?.destroy();
            (chart as any).__centerSub?.destroy();

            // Center Total Value
            (chart as any).__centerValue = chart.renderer
              .text(Highcharts.numberFormat(total, 0), cx, cy - 6)
              .attr({ align: 'center' })
              .css({
                fontSize: self.centerValueFontSize,
                fontWeight: self.centerValueFontWeight,
                color: self.centerValueColor,
                fontFamily: self.fontFamily
              })
              .add();

            // Center Subtitle
            (chart as any).__centerSub = chart.renderer
              .text(self.centerSubText, cx, cy + 20)
              .attr({ align: 'center' })
              .css({
                fontSize: self.centerSubFontSize,
                color: self.centerSubColor,
                fontFamily: self.fontFamily
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
        verticalAlign: 'bottom'
      },

      plotOptions: {
        pie: {
          startAngle: this.startAngle,
          endAngle: this.endAngle,
          center: this.center,
          size: this.size,
          innerSize: this.innerSize,
          borderWidth: 0,
          borderRadius: this.borderRadius,
          allowPointSelect: false,
          dataLabels: {
            enabled: true,
            distance: this.dataLabelDistance,
            formatter: function (this: any) {
              const p = Math.round(this.percentage || 0);
              return `${this.y} (${p}%)`;
            },
            style: {
              color: this.dataLabelColor,
              fontSize: this.dataLabelFontSize,
              textOutline: 'none',
              textOverflow: 'none',
              fontFamily: this.fontFamily
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
      ] as Highcharts.SeriesOptionsType[]
    };
  }
}
