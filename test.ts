import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

type ChartWithCenter = Highcharts.Chart & { customCenter?: Highcharts.SVGElement };
type PieSeriesWithCenter = Highcharts.Series & {
  center?: [number, number, number, number];
  points: Highcharts.Point[];
};

@Component({
  selector: 'app-swfp-by-region',
  templateUrl: './swfp-by-region.component.html',
  styleUrls: ['./swfp-by-region.component.scss']
})
export class SwfpByRegionComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  widgetType: 'ch' | 'th' = 'ch';

  // Replace with real data later
  regionData = [
    { name: 'HQ',  y: 126 },
    { name: 'APR', y:  88 },
    { name: 'SAR', y:  73 },
    { name: 'EAP', y:  50 },
    { name: 'ECA', y:  37 }
  ];

  ngOnInit(): void {
    this.loadChart();
  }

  loadWidget(type: 'ch' | 'th') {
    this.widgetType = type;
  }

  private loadChart(): void {
    this.chartOptions = {
      chart: {
        type: 'pie',
        spacingRight: 16,
        spacingLeft: 0,
        events: {
          // ✅ Type the callback `this` as a Highcharts.Chart
          render: function (this: Highcharts.Chart) {
            const chart = this as ChartWithCenter;
            const series = chart.series?.[0] as PieSeriesWithCenter | undefined;
            if (!series) return;

            const total = (series.points || []).reduce((acc, p: any) => acc + (p?.y ?? 0), 0);

            // series.center is [relX, relY, size, innerSize] relative to the plot area
            const center = (series as any).center as [number, number, number, number] | undefined;
            const relX = center?.[0] ?? chart.plotWidth / 2;
            const relY = center?.[1] ?? chart.plotHeight / 2;
            const cx = chart.plotLeft + relX;
            const cy = chart.plotTop + relY;

            const html =
              `<div style="text-align:center;">
                 <div style="font-size:28px;font-weight:700;line-height:1">${total}</div>
                 <div style="font-size:12px;line-height:1.1">By Region</div>
               </div>`;

            if (!chart.customCenter) {
              chart.customCenter = chart.renderer
                .label(html, cx, cy, undefined, undefined, undefined, true) // useHTML
                .attr({ align: 'center', zIndex: 5 })
                .add();
            }

            const bbox = chart.customCenter.getBBox();
            chart.customCenter.attr({ x: cx - bbox.width / 2, y: cy - 20 });
          }
        }
      } as any,
      title: { text: '' },
      credits: { enabled: false },
      tooltip: { pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)' },
      plotOptions: {
        pie: {
          innerSize: '78%',
          size: '88%',
          center: ['35%', '50%'],  // move donut left to make space for legend
          borderRadius: 0,
          showInLegend: true,
          dataLabels: {
            enabled: true,
            distance: 10,
            formatter: function () {
              const pct = Highcharts.numberFormat((this.percentage as number) || 0, 0);
              return `${this.y} (${pct}%)`;
            },
            style: { textOutline: 'none', fontWeight: '500' }
          }
        }
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        useHTML: true,
        itemMarginTop: 6,
        itemMarginBottom: 6,
        labelFormatter: function () {
          const p = this as unknown as Highcharts.Point;
          const pct = Highcharts.numberFormat((p.percentage as number) || 0, 0);
          return `<span class="hc-legend-row">
                    <span class="hc-name">${p.name}</span>
                    <span class="hc-val">${p.y} (${pct}%)</span>
                  </span>`;
        }
      },
      series: [{
        type: 'pie',
        name: 'Region',
        data: this.regionData.map(d => ({ name: d.name, y: d.y }))
      }]
    };
  }

  get totalCount(): number {
    return this.regionData.reduce((sum, r) => sum + (r.y || 0), 0);
  }
}
