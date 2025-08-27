import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';

HighchartsMore(Highcharts);
SolidGauge(Highcharts);

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  styleUrls: ['./swfp-by-fcv-status.component.scss']
})
export class SwfpByFcvStatusComponent {
  Highcharts: typeof Highcharts = Highcharts;

  @Input() fcv = 30;     // dark teal
  @Input() nonFcv = 70;  // light teal
  @Input() widgetTitle = 'Workforce Supply (FTE) by FCV Status';

  private colorFCV = '#0B6F6A';
  private colorNonFCV = '#78C9C5';

  chartOptions: Highcharts.Options;

  constructor() {
    const total = this.fcv + this.nonFcv;
    const pFCV = (this.fcv / total) * 100;
    const pNon = (this.nonFcv / total) * 100;

    this.chartOptions = {
      chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent',
        height: 240,
        spacing: [10, 16, 0, 16],   // a bit more right/left so labels won’t clip
        events: {
          load: function (this: Highcharts.Chart) {
            drawCenterAndLabels(this);
          },
          redraw: function (this: Highcharts.Chart) {
            drawCenterAndLabels(this);
          }
        }
      },

      title: { text: undefined },
      credits: { enabled: false },
      tooltip: { enabled: false },

      legend: {
        enabled: true,                 // (legend at bottom)
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: { color: '#2f2f2f', fontSize: '14px' },
        symbolRadius: 6,
        symbolHeight: 10,
        symbolWidth: 10,
        y: 8
      },

      pane: {
        startAngle: -90,
        endAngle: 90,
        background: [] // no grey ring
      },

      yAxis: {
        min: 0,
        max: 100,
        tickPositions: [],
        lineWidth: 0
      },

      plotOptions: {
        solidgauge: {
          rounded: true,               // curved ends ✅
          linecap: 'round',
          dataLabels: { enabled: false },
          enableMouseTracking: false,
          stickyTracking: false
        }
      },

      series: [{
        type: 'solidgauge',
        showInLegend: true,
        data: [
          { name: 'FCV',     y: pFCV,  color: this.colorFCV,    radius: '95%', innerRadius: '85%' } as any,
          { name: 'Non - FCV', y: pNon, color: this.colorNonFCV, radius: '95%', innerRadius: '85%' } as any
        ]
      } as Highcharts.SeriesSolidgaugeOptions]
    };

    // helper that draws center text + outside value(%) labels
    const drawCenterAndLabels = (chart: Highcharts.Chart) => {
      const cx = chart.plotLeft + chart.plotWidth / 2;
      const cy = chart.plotTop + chart.plotHeight * 0.78; // more centered in the card

      (chart as any).__centerValue?.destroy();
      (chart as any).__centerSub?.destroy();
      (chart as any).__leftLbl?.destroy();
      (chart as any).__rightLbl?.destroy();

      (chart as any).__centerValue = chart.renderer
        .text(Highcharts.numberFormat(total, 0), cx, cy - 6)
        .attr({ align: 'center' })
        .css({ fontSize: '38px', fontWeight: 600, color: '#1a1a1a' })
        .add();

      (chart as any).__centerSub = chart.renderer
        .text('By FCV Status', cx, cy + 20)
        .attr({ align: 'center' })
        .css({ fontSize: '16px', color: '#3c3c3c' })
        .add();

      // compute arc radius to place labels
      const pt = (chart.series[0] as any).points[0];
      const rOuter = pt.shapeArgs.r as number;
      const cx0 = chart.plotLeft + chart.plotWidth / 2;
      const cy0 = chart.plotTop + chart.plotHeight / 2 + 20;

      const leftAngle = -35 * Math.PI / 180;
      const rightAngle = 35 * Math.PI / 180;

      const leftX = cx0 + Math.cos(Math.PI - leftAngle) * (rOuter - 8);
      const leftY = cy0 + Math.sin(Math.PI - leftAngle) * (rOuter - 14);
      const rightX = cx0 + Math.cos(rightAngle) * (rOuter - 8);
      const rightY = cy0 + Math.sin(rightAngle) * (rOuter - 14);

      (chart as any).__leftLbl = chart.renderer
        .text(`${this.nonFcv}(${Math.round(pNon)}%)`, leftX, leftY)
        .css({ fontSize: '13px', color: '#3c3c3c' })
        .add();

      (chart as any).__rightLbl = chart.renderer
        .text(`${this.fcv}(${Math.round(pFCV)}%)`, rightX, rightY)
        .css({ fontSize: '13px', color: '#3c3c3c' })
        .add();
    };
  }
}
