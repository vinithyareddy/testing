import { Component, Input, OnInit } from '@angular/core';
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
  styleUrls: ['./swfp-by-fcv-status.component.scss'],
})
export class SwfpByFcvStatusComponent implements OnInit {
  // inputs (can be bound from parent)
  @Input() fcv = 44;        // dark teal
  @Input() nonFcv = 104;    // light teal
  @Input() title = 'Workforce Supply (FTE) by FCV Status';

  // ui state used in your example
  collapsed = false;
  widgetType: 'ch' | 'th' = 'ch';       // 'ch' = chart, 'th' = table
  ResponseFlag = true;                  // set to true when chart ready

  // chart binding
  Highcharts: typeof Highcharts = Highcharts;
  PieChart: TrendChart[] = [];

  // palette to match the screenshots exactly
  private colorFCV = '#0B6F6A';
  private colorNonFCV = '#78C9C5';

  ngOnInit(): void {
    this.buildChart();
  }

  expand() { this.collapsed = false; }
  collapse() { this.collapsed = true; }
  loadWidget(kind: 'ch' | 'th') { this.widgetType = kind; }

  getDetailPage() {
    // wire your router navigation here
    console.log('View All clicked');
  }

  private buildChart(): void {
    const total = this.fcv + this.nonFcv;
    const pctFCV = (this.fcv / total) * 100;
    const pctNon = (this.nonFcv / total) * 100;

    const options: Highcharts.Options = {
      chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent',
        height: 240,
        spacing: [20, 10, 0, 10], // top margin for the card look
        events: {
          render: function (this: Highcharts.Chart) {
            const chart = this;

            // center labels
            const cx = chart.plotLeft + chart.plotWidth / 2;
            const cy = chart.plotTop + chart.plotHeight * 0.78;

            (chart as any).__centerValue?.destroy();
            (chart as any).__centerSub?.destroy();

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

            // outside labels like 104(70%) & 44(30%)
            const s: any = chart.series[0];
            if (!s?.points?.length) return;
            const { r, innerR } = s.points[0].shapeArgs;
            const rOuter = r as number;
            const rInner = innerR as number;

            const angleL = -35 * (Math.PI / 180);
            const angleR = 35 * (Math.PI / 180);
            const baseY = chart.plotTop + chart.plotHeight / 2 + 20;
            const baseX = chart.plotLeft + chart.plotWidth / 2;

            const leftX = baseX + Math.cos(Math.PI - angleL) * (rOuter - 10);
            const leftY = baseY + Math.sin(Math.PI - angleL) * (rOuter - 16);
            const rightX = baseX + Math.cos(angleR) * (rOuter - 8);
            const rightY = baseY + Math.sin(angleR) * (rOuter - 16);

            (chart as any).__leftLbl?.destroy();
            (chart as any).__rightLbl?.destroy();

            (chart as any).__leftLbl = chart.renderer
              .text(`${total - this.userOptions.__fcv}(${Math.round(pctNon)}%)`, leftX, leftY)
              .css({ fontSize: '13px', color: '#3c3c3c' })
              .add();

            (chart as any).__rightLbl = chart.renderer
              .text(`${this.userOptions.__fcv}(${Math.round(pctFCV)}%)`, rightX, rightY)
              .css({ fontSize: '13px', color: '#3c3c3c' })
              .add();
          }
        }
      },

      // stash fcv for the render helper (keeps Options typing intact)
      __fcv: this.fcv as any,

      title: { text: undefined },
      credits: { enabled: false },
      tooltip: { enabled: false },
      legend: { enabled: false },

      pane: {
        startAngle: -90,
        endAngle: 90,
        background: [] // no default grey arc
      },

      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
      },

      plotOptions: {
        solidgauge: {
          rounded: true,        // curved ends
          linecap: 'round',
          dataLabels: { enabled: false },
          enableMouseTracking: false,
          stickyTracking: false
        }
      },

      series: [
        {
          type: 'solidgauge',
          data: [
            // thin ring via radius/innerRadius; both points share the ring
            { y: pctNon, color: this.colorNonCV(this.colorNonFCV), radius: '95%', innerRadius: '85%' } as any,
            { y: pctFCV, color: this.colorFCV,                     radius: '95%', innerRadius: '85%' } as any
          ]
        } as Highcharts.SeriesSolidgaugeOptions
      ]
    };

    this.PieChart = [
      {
        Highcharts: this.Highcharts,
        chartConstructor: 'chart',
        chartOptions: options,
      },
    ];
  }

  // small helper in case you want to tweak nonFCV shade later
  private colorNonCV(c: string) { return c; }
}
