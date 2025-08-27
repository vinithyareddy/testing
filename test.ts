// swfp-by-fcv-status.component.ts
export class SwfpByFcvStatusComponent {
  Highcharts: typeof Highcharts = Highcharts;

  @Input() fcv = 44;
  @Input() nonFcv = 104;
  @Input() widgetTitle = 'Workforce Supply (FTE) by FCV Status';

  private colorFCV = '#0B6F6A';   // dark teal
  private colorNonFCV = '#78C9C5';// light teal

  chartOptions: Highcharts.Options;

  constructor() {
    const total = this.fcv + this.nonFcv;
    const pctFCV = (this.fcv / total) * 100;
    const pctNon = (this.nonFcv / total) * 100;

    this.chartOptions = {
      chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent',
        height: 240,
        spacingTop: 20,
        events: {
          render: function (this: Highcharts.Chart) {
            // center labels
            const chart = this;
            const cx = chart.plotLeft + chart.plotWidth / 2;
            const cy = chart.plotTop + chart.plotHeight * 0.78;

            (chart as any).__centerValue?.destroy();
            (chart as any).__centerSub?.destroy();

            (chart as any).__centerValue = chart.renderer
              .text(Highcharts.numberFormat(total, 0), cx, cy - 8)
              .attr({ align: 'center' })
              .css({
                fontSize: '38px',
                fontWeight: 600,
                color: '#1a1a1a'
              })
              .add();

            (chart as any).__centerSub = chart.renderer
              .text('By FCV Status', cx, cy + 18)
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

      pane: {
        startAngle: -90,
        endAngle: 90,
        background: [] // no grey background arc
      },

      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
      },

      plotOptions: {
        solidgauge: {
          rounded: true,           // curve the arc ends
          linecap: 'round',        // (older versions use this)
          dataLabels: { enabled: false },
          stickyTracking: false,
          enableMouseTracking: false
        }
      },

      // We draw both slices as separate "points" on the same ring
      // to keep the donut thin and match the look.
      series: [
        {
          type: 'solidgauge',
          // ONE ring; both points share the same radius/innerRadius
          data: [
            {
              y: pctNon,
              color: this.colorNonFCV,
              radius: '95%',
              innerRadius: '85%'
            } as any,
            {
              y: pctFCV,
              color: this.colorFCV,
              radius: '95%',
              innerRadius: '85%'
            } as any
          ]
        } as Highcharts.SeriesSolidgaugeOptions
      ]
    } as Highcharts.Options;

    // Add small outside labels like "104(70%)" and "44(30%)"
    // (simple renderer texts anchored near arc ends)
    const addOutsideLabels = (chart: Highcharts.Chart) => {
      const rOuter = (chart as any).series[0].points[0].shapeArgs.r as number;
      const rInner = (chart as any).series[0].points[0].shapeArgs.innerR as number;
      const rMid = chart.plotLeft + rOuter - (rOuter - rInner) / 2;

      const angleDeg = -35; // left label angle
      const angleRad = (angleDeg * Math.PI) / 180;

      const cx = chart.plotLeft + chart.plotWidth / 2;
      const cy = chart.plotTop + chart.plotHeight / 2 + 20;

      const leftX = cx + Math.cos(Math.PI - angleRad) * (rOuter - 10);
      const leftY = cy + Math.sin(Math.PI - angleRad) * (rOuter - 16);

      const rightAngleDeg = 35; // right label angle
      const rightX = cx + Math.cos(rightAngleDeg * Math.PI / 180) * (rOuter - 6);
      const rightY = cy + Math.sin(rightAngleDeg * Math.PI / 180) * (rOuter - 16);

      const nonPct = Math.round(pctNon);
      const fcvPct = Math.round(pctFCV);

      (chart as any).__leftLbl?.destroy();
      (chart as any).__rightLbl?.destroy();

      (chart as any).__leftLbl = chart.renderer
        .text(`${this.nonFcv}(${nonPct}%)`, leftX, leftY)
        .css({ fontSize: '13px', color: '#3c3c3c' })
        .add();

      (chart as any).__rightLbl = chart.renderer
        .text(`${this.fcv}(${fcvPct}%)`, rightX, rightY)
        .css({ fontSize: '13px', color: '#3c3c3c' })
        .add();
    };

    // Hook label drawing after first render & on redraw
    (this.chartOptions.chart as any).events!.load = function (this: Highcharts.Chart) {
      addOutsideLabels(this);
    };
    (this.chartOptions.chart as any).events!.redraw = function (this: Highcharts.Chart) {
      addOutsideLabels(this);
    };
  }
}
