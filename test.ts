import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  styleUrls: ['./swfp-by-fcv-status.component.scss']
})
export class SwfpByFcvStatusComponent {
  Highcharts: typeof Highcharts = Highcharts;

  /** Provide your values (default matches the screenshot) */
  @Input() fcv = 44;          // FCV count (dark teal)
  @Input() nonFcv = 104;      // Non-FCV count (light teal)
  @Input() widgetTitle = 'Workforce Supply (FTE) by FCV Status';

  private colorFCV = '#0B6F6A';
  private colorNonFCV = '#78C9C5';

  chartOptions: Highcharts.Options;

  constructor() {
    const total = this.fcv + this.nonFcv;

    this.chartOptions = {
      // stash total so render event can read it
      __total: total as any,

      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        spacing: [10, 10, 0, 10],
        events: {
          render: function () {
            const chart = this as Highcharts.Chart;
            const total = (chart.options as any).__total as number;

            const cx = chart.plotLeft + chart.plotWidth / 2;
            const cy = chart.plotTop + chart.plotHeight * 0.88;

            (chart as any).__centerValue?.destroy();
            (chart as any).__centerSub?.destroy();

            (chart as any).__centerValue = chart.renderer
              .text(Highcharts.numberFormat(total, 0), cx, cy - 6)
              .attr({ align: 'center' })
              .css({
                fontSize: '38px',
                fontWeight: '600',
                color: '#1a1a1a',
                fontFamily:
                  'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
              })
              .add();

            (chart as any).__centerSub = chart.renderer
              .text('By FCV Status', cx, cy + 20)
              .attr({ align: 'center' })
              .css({
                fontSize: '16px',
                color: '#3c3c3c',
                fontFamily:
                  'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
              })
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
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '85%'],
          size: '140%',
          innerSize: '70%',
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            formatter: function () {
              const p = Math.round((this.point.percentage || 0));
              return `${this.y}(${p}%)`;
            },
            distance: 18,
            style: {
              color: '#3c3c3c',
              fontSize: '13px',
              textOutline: 'none',
              fontFamily:
                'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
            }
          }
        }
      },

      series: [
        {
          type: 'pie',
          data: [
            { name: 'Non - FCV', y: this.nonFcv, color: this.colorNonFCV },
            { name: 'FCV', y: this.fcv, color: this.colorFCV }
          ]
        }
      ] as Highcharts.SeriesOptionsType[]
    };
  }
}

<div class="card">
  <div class="card-header">
    <div class="title">{{ widgetTitle }}</div>
    <div class="icons">
      <span class="icon-bar" aria-hidden="true"></span>
      <span class="icon-refresh" aria-hidden="true"></span>
    </div>
  </div>

  <div class="chart-wrap">
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: 240px; display: block"
    ></highcharts-chart>
  </div>

  <div class="legend">
    <span class="dot dot-fcv"></span> FCV
    <span class="dot dot-non"></span> Non - FCV
  </div>

  <div class="view-more">View More <span class="arrow">›</span></div>
</div>

$fcv: #0b6f6a;      // dark teal
$nonfcv: #78c9c5;   // light teal
$card-bg: #ffffff;
$border: #e7e7e7;
$text: #1a1a1a;

.card {
  background: $card-bg;
  border: 1px solid $border;
  border-radius: 12px;
  padding: 10px 12px 6px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.02);
  width: 340px;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;

  .title {
    color: $text;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.25;
  }

  .icons {
    display: flex;
    gap: 6px;

    .icon-bar,
    .icon-refresh {
      width: 26px; height: 26px;
      border: 1px solid $border;
      border-radius: 6px;
      position: relative;
      background: #f8fafb;
    }
    .icon-bar::before {
      content: '';
      position: absolute; inset: 7px 9px;
      border-left: 3px solid #b4c0c9;
      border-right: 3px solid #d2dbe1;
    }
    .icon-refresh::before {
      content: '↻';
      position: absolute;
      top: 2px; left: 7px;
      font-size: 18px; color: #95a3ad;
    }
  }
}

.chart-wrap {
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 4px 2px 0 2px;
  margin: 4px 0 6px;
}

.legend {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 14px;
  color: #2f2f2f;
  padding: 2px 6px 8px;

  .dot {
    display: inline-block;
    width: 10px; height: 10px;
    border-radius: 50%;
    margin-right: 6px;
  }
  .dot-fcv { background: $fcv; }
  .dot-non { background: $nonfcv; }
}

.view-more {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  color: #2563eb;
  cursor: pointer;
  padding-right: 4px;

  .arrow { font-size: 18px; margin-left: 4px; }
}

:host ::ng-deep .highcharts-data-label text {
  font-weight: 500;
}
