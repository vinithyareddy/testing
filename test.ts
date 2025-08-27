import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';

HighchartsMore(Highcharts);
SolidGauge(Highcharts);

type TrendChart = {
  Highcharts: typeof Highcharts;
  chartConstructor: 'chart';
  chartOptions: Highcharts.Options;
};

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  styleUrls: ['./swfp-by-fcv-status.component.scss']
})
export class SwfpByFcvStatusComponent {
  // data (defaults match your screenshot)
  @Input() fcv = 44;          // dark teal segment
  @Input() nonFcv = 104;      // light teal segment
  @Input() title = 'Workforce Supply (FTE) by FCV Status';

  // UI state
  collapsed = false;
  widgetType: 'ch' | 'th' = 'ch';
  ResponseFlag = true;        // when false shows loader block

  // chart model consumed by your *ngFor
  PieChart: TrendChart[] = [
    {
      Highcharts,
      chartConstructor: 'chart',
      chartOptions: this.buildGauge()
    }
  ];

  // Actions used by your template
  loadWidget(type: 'ch' | 'th') {
    this.widgetType = type;
    if (type === 'ch') {
      // rebuild to keep labels correct if inputs changed
      this.PieChart[0].chartOptions = this.buildGauge();
    }
  }
  expand()  { this.collapsed = false; }
  collapse(){ this.collapsed = true; }
  getDetailPage() {
    // TODO: navigate or emit
    console.log('View All clicked');
  }

  // ------- Highcharts options (solid-gauge, thin & rounded) -------
  private buildGauge(): Highcharts.Options {
    const total = this.fcv + this.nonFcv;
    const pctFCV = total ? (this.fcv / total) * 100 : 0;
    const pctNon = total ? (this.nonFcv / total) * 100 : 0;

    // helper to draw the center total and the two outside labels
    const drawLabels = function (this: Highcharts.Chart) {
      const chart = this;

      // clean previous
      (chart as any).__centerValue?.destroy();
      (chart as any).__centerSub?.destroy();
      (chart as any).__leftLbl?.destroy();
      (chart as any).__rightLbl?.destroy();

      const cx = chart.plotLeft + chart.plotWidth / 2;
      const cy = chart.plotTop + chart.plotHeight * 0.78;

      (chart as any).__centerValue = chart.renderer
        .text(Highcharts.numberFormat(total, 0), cx, cy - 8)
        .attr({ align: 'center' })
        .css({ fontSize: '38px', fontWeight: 600, color: '#1a1a1a' })
        .add();

      (chart as any).__centerSub = chart.renderer
        .text('By FCV Status', cx, cy + 18)
        .attr({ align: 'center' })
        .css({ fontSize: '16px', color: '#3c3c3c' })
        .add();

      // place left/right labels near arc
      const s = chart.series[0];
      if (!s || !(s as any).points?.length) return;

      const p0: any = (s as any).points[0]; // Non-FCV point
      const rOuter = p0.shapeArgs?.r ?? 0;
      const cxArc = chart.plotLeft + chart.plotWidth / 2;
      const cyArc = chart.plotTop + chart.plotHeight / 2 + 20;

      const leftAngle = -35 * (Math.PI / 180);
      const rightAngle = 35 * (Math.PI / 180);

      const leftX = cxArc + Math.cos(Math.PI - leftAngle) * (rOuter - 10);
      const leftY = cyArc + Math.sin(Math.PI - leftAngle) * (rOuter - 16);

      const rightX = cxArc + Math.cos(rightAngle) * (rOuter - 6);
      const rightY = cyArc + Math.sin(rightAngle) * (rOuter - 16);

      (chart as any).__leftLbl = chart.renderer
        .text(`${this.userOptions as any}.nonFcvText`, leftX, leftY)
        .css({ fo
