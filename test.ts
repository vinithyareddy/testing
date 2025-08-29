import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-swfp-by-region',
  templateUrl: './swfp-by-region.component.html',
  styleUrls: ['./swfp-by-region.component.scss']
})
export class SwfpByRegionComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  widgetType: 'ch' | 'th' = 'ch';

  // ✅ Dummy data only. Replace with API data later.
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
    if (type === 'ch') this.loadChart();
  }

  get totalCount(): number {
    return this.regionData.reduce((sum, d) => sum + (d.y || 0), 0);
  }

  private loadChart(): void {
    const _this = this;

    this.chartOptions = {
      chart: {
        type: 'pie',
        spacingLeft: 0,
        spacingRight: 16,
        events: {
          // Draw the center total + subtitle on every render (same pattern as reference)
          render: function (this: Highcharts.Chart) {
            const chart: any = this; // keep typing simple to avoid TS overlaps
            const series = chart.series?.[0];
            if (!series || !series.points?.length) return;

            const total = series.points.reduce((acc: number, p: any) => acc + (p.y || 0), 0);

            // series.center = [cx, cy, diameter, outerR]
            const center = (series as any).center || [this.plotWidth / 2, this.plotHeight / 2];
            const cx = this.plotLeft + center[0];
            const cy = this.plotTop + center[1];

            // Big number
            if (!chart.centerTotal) {
              chart.centerTotal = this.renderer
                .text(String(total), cx, cy - 4)
                .css({ fontSize: '28px', fontWeight: '700' })
                .attr({ align: 'center' })
                .add();
            } else {
              chart.centerTotal.attr({ text: String(total), x: cx, y: cy - 4 });
            }

            // Subtitle
            if (!chart.centerSub) {
              chart.centerSub = this.renderer
                .text('By Region', cx, cy + 14)
                .css({ fontSize: '12px', fontWeight: '500' })
                .attr({ align: 'center' })
                .add();
            } else {
              chart.centerSub.attr({ text: 'By Region', x: cx, y: cy + 14 });
            }
          }
        }
      } as any,
      title: { text: '' },
      tooltip: {
        pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)'
      },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '78%',      // donut thickness (same style as reference)
          size: '88%',           // overall radius
          center: ['35%', '50%'],// leave room for the legend on the right
          showInLegend: true,
          borderRadius: 0,       // straight partition line in the middle
          dataLabels: {
            enabled: true,
            distance: 12,
            formatter: function () {
              const pct = Highcharts.numberFormat(this.percentage || 0, 0);
              return `${this.y} (${pct}%)`;
            }
          }
        }
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemMarginTop: 5,
        itemMarginBottom: 5,
        labelFormatter: function () {
          const p = this as unknown as Highcharts.Point;
          const pct = Highcharts.numberFormat(p.percentage || 0, 0);
          return `${p.name}               ${p.y} (${pct}%)`;
        },
        useHTML: true
      },
      series: [{
        type: 'pie',
        name: 'Region',
        data: _this.regionData.map(d => ({ name: d.name, y: d.y }))
      }]
    };
  }
}
