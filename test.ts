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

  // Default to chart view; you can wire the table view later if needed
  widgetType: 'ch' | 'th' = 'ch';

  // 👉 Replace this array with real data when you have it
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
        // put the donut a bit left so legend has room
        events: {
          // Draw the center total dynamically
          render: function () {
            const chart = this as Highcharts.Chart & { customCenter?: Highcharts.SVGElement };
            const series = chart.series[0];
            if (!series) return;

            const total = (series.points || []).reduce((acc, p: any) => acc + (p.y ?? 0), 0);
            const c = (series as any).center; // [cx, cy, size, innerSize] relative to plot
            const cx = chart.plotLeft + c[0];
            const cy = chart.plotTop + c[1];

            const html =
              `<div style="text-align:center;">
                 <div style="font-size:28px;font-weight:700;line-height:1">${total}</div>
                 <div style="font-size:12px;line-height:1.1">By Region</div>
               </div>`;

            if (!chart.customCenter) {
              chart.customCenter = chart.renderer
                .label(html, cx, cy, undefined, undefined, undefined, true) // useHTML
                .attr({ align: 'center', zIndex: 5 })
                .css({ cursor: 'default' })
                .add();
            }
            chart.customCenter.attr({ x: cx - (chart.customCenter.getBBox().width / 2), y: cy - 20 });
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
          center: ['35%', '50%'],         // move left for legend
          borderRadius: 0,                 // straight partition, rounded ends kept by donut
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
        useHTML: true,                    // lets us style with flex
        itemMarginTop: 6,
        itemMarginBottom: 6,
        labelFormatter: function () {
          const p = this as unknown as Highcharts.Point;
          const pct = Highcharts.numberFormat((p.percentage as number) || 0, 0);
          return `<span class="hc-legend-row"><span class="hc-name">${p.name}</span><span class="hc-val">${p.y} (${pct}%)</span></span>`;
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

<div class="budget-card-box-lg">
  <div class="budget-box-chart-lg">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center flex-wrap">
      <div class="widget-heading pointer mt-1 d-flex align-items-center">
        <span>
          Workforce Supply (FTE) by Region
          <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
        </span>
      </div>

      <div class="d-flex justify-content-end align-items-center header-icons">
        <div class="togglebtn d-flex">
          <div class="lft-toggle" [class.lft-toggle-active]="widgetType === 'th'" (click)="loadWidget('th')">
            <i class="fa fa-table fnticon" aria-hidden="true"></i>
          </div>
          <div class="rgt-toggle" [class.rgt-toggle-active]="widgetType === 'ch'" (click)="loadWidget('ch')">
            <i class="fa fa-bar-chart fnticon" aria-hidden="true"></i>
          </div>
        </div>
        <div class="d-flex gap-3">
          <span class="view"><i class="fas fa-expand" title="Zoom"></i></span>
          <div class="ellipsis ml-2"><i class="fas fa-ellipsis-v"></i></div>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <ng-container *ngIf="widgetType === 'ch'">
      <div class="inner-card-box-lg">
        <highcharts-chart
          [Highcharts]="Highcharts"
          [options]="chartOptions"
          style="width: 100%; height: 320px; display: block;">
        </highcharts-chart>
      </div>
    </ng-container>

    <!-- View more -->
    <div class="viewmore pointer mt-3 pt-3">
      <span>View More&nbsp;&nbsp;</span><i class="fa fa-angle-right"></i>
    </div>
  </div>
</div>

<ng-template #infotemp>
  <lift-popover popoverTitle="" popoverText="">
    <span><i class="far fa-info-circle"></i></span>
  </lift-popover>
</ng-template>

/* Legend rows: name left, value+% right */
:host ::ng-deep .hc-legend-row {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-width: 160px;
}
:host ::ng-deep .hc-legend-row .hc-name { font-weight: 500; }
:host ::ng-deep .hc-legend-row .hc-val  { font-weight: 600; }

/* Header actions (matches your other widgets) */
.header-icons {
  display: flex;
  align-items: center;
  gap: 12px;

  .togglebtn {
    display: flex;
    .lft-toggle, .rgt-toggle {
      width: 28px; height: 28px;
      border: 1px solid #d6d6d6;
      text-align: center; line-height: 28px;
      cursor: pointer;
      i { font-size: 14px; }
    }
  }

  .view, .ellipsis {
    font-size: 18px;
    color: #0071bc;
    cursor: pointer;
  }
}

/* Space around chart */
.inner-card-box-lg { padding: 6px 0 4px; }
.viewmore { font-size: 13px; font-weight: 500; color: #0071bc; text-align: right; }
