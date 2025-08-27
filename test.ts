import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

// --- Robust module init (works with/without esModuleInterop) ---
import * as HC_more from 'highcharts/highcharts-more';
import * as HC_solid from 'highcharts/modules/solid-gauge';
function init(mod: any) {
  if (mod && typeof mod === 'function') { mod(Highcharts); }
  else if (mod && typeof mod.default === 'function') { mod.default(Highcharts); }
}
init(HC_more);
init(HC_solid);
// ----------------------------------------------------------------

type Slice = { name: string; value: number; color?: string };

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  styleUrls: ['./swfp-by-fcv-status.component.scss']
})
export class SwfpByFcvStatusComponent implements OnChanges {
  Highcharts: typeof Highcharts = Highcharts;

  /** Data to plot. Provide any number of slices. Example:
   *  [{ name:'Non - FCV', value: 70, color:'#78C9C5' },
   *   { name:'FCV',      value: 30, color:'#0B6F6A' }]
   */
  @Input() data: Slice[] = [];

  /** Texts/UI */
  @Input() title = 'Workforce Supply (FTE) by FCV Status';
  @Input() centerSubtitle = 'By FCV Status';
  @Input() showLegend = true;

  /** Visual controls (tweak without touching TS) */
  @Input() startAngle = -90;
  @Input() endAngle = 90;
  @Input() ringOuter = '95%';        // larger number → bigger ring
  @Input() ringInner = '85%';        // closer to outer → thinner ring
  @Input() chartHeight = 240;
  @Input() chartSize = '140%';       // overall chart scale
  @Input() centerY = '85%';          // vertical position of arc

  chartOptions: Highcharts.Options = {};

  ngOnChanges(_: SimpleChanges): void {
    this.buildOptions();
  }

  private buildOptions(): void {
    const total = this.data.reduce((a, s) => a + (s.value || 0), 0);
    const pct = (v: number) => (total > 0 ? (v / total) * 100 : 0);

    // SolidGauge expects "y" in 0–100. We convert values to %,
    // keep names/colors, and assign the same ring geometry to all points.
    const sgPoints = this.data.map(d => ({
      name: d.name,
      y: pct(d.value),
      color: d.color,
      radius: this.ringOuter,
      innerRadius: this.ringInner
    })) as any[];

    // Helper to draw center & outside labels (works for any # of slices)
    const drawOverlay = (chart: Highcharts.Chart) => {
      const cx = chart.plotLeft + chart.plotWidth / 2;
      const cy = chart.plotTop + chart.plotHeight * 0.78;

      // remove old
      (chart as any).__centerValue?.destroy();
      (chart as any).__centerSub?.destroy();
      ((chart as any).__valueLabels || []).forEach((el: any) => el.destroy?.());
      (chart as any).__valueLabels = [];

      // center total
      (chart as any).__centerValue = chart.renderer
        .text(Highcharts.numberFormat(total, 0), cx, cy - 6)
        .attr({ align: 'center' })
        .css({ fontSize: '38px', fontWeight: 600, color: '#1a1a1a' })
        .add();

      // center subtitle
      (chart as any).__centerSub = chart.renderer
        .text(this.centerSubtitle, cx, cy + 20)
        .attr({ align: 'center' })
        .css({ fontSize: '16px', color: '#3c3c3c' })
        .add();

      // outside labels: position at each slice midpoint along the semi-arc
      const series: any = chart.series[0];
      if (!series || !series.points?.length) return;

      const rOuter = series.points[0].shapeArgs.r as number;
      const cx0 = chart.plotLeft + chart.plotWidth / 2;
      const cy0 = chart.plotTop + chart.plotHeight / 2 + 20;

      // running percentage to find mid angle of each slice
      let cum = 0;
      this.data.forEach((d, i) => {
        const perc = pct(d.value);
        if (perc <= 0) return;

        // angle span of this slice within [-90, +90]
        const start = this.startAngle + (cum / 100) * (this.endAngle - this.startAngle);
        const end =   this.startAngle + ((cum + perc) / 100) * (this.endAngle - this.startAngle);
        const mid = ((start + end) / 2) * Math.PI / 180;

        // leave a small gap from the arc (no clipping)
        const x = cx0 + Math.cos(mid) * (rOuter - 8);
        const y = cy0 + Math.sin(mid) * (rOuter - 14);

        const label = chart.renderer
          .text(`${d.value}(${Math.round(perc)}%)`, x, y)
          .css({ fontSize: '13px', color: '#3c3c3c' })
          .attr({ align: mid > 0 ? 'left' : 'right' })
          .add();

        (chart as any).__valueLabels.push(label);
        cum += perc;
      });
    };

    this.chartOptions = {
      chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent',
        height: this.chartHeight,
        spacing: [10, 16, 0, 16],
        events: {
          load: function (this: Highcharts.Chart) { drawOverlay(this); },
          redraw: function (this: Highcharts.Chart) { drawOverlay(this); }
        }
      },

      title: { text: undefined },
      credits: { enabled: false },
      tooltip: { enabled: false },

      legend: {
        enabled: this.showLegend,
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
        startAngle: this.startAngle,
        endAngle: this.endAngle,
        background: []   // no grey background arc
      },

      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
      },

      plotOptions: {
        solidgauge: {
          rounded: true,              // curved ends
          linecap: 'round',
          dataLabels: { enabled: false },
          enableMouseTracking: false,
          stickyTracking: false
        }
      },

      series: [
        {
          type: 'solidgauge',
          showInLegend: this.showLegend,
          data: sgPoints
        } as Highcharts.SeriesSolidgaugeOptions
      ]
    };
  }
}
