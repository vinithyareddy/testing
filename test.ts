// src/app/fcv-status-widget/fcv-status-widget.component.ts
import { Component, Input, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-fcv-status-widget',
  templateUrl: './fcv-status-widget.component.html',
  styleUrls: ['./fcv-status-widget.component.scss']
})
export class FcvStatusWidgetComponent implements OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;

  // Supply your own numbers if you like
  @Input() fcv = 44;        // FCV count (dark teal)
  @Input() nonFcv = 104;    // Non-FCV count (light teal)
  @Input() title = 'Workforce Supply (FTE) by FCV Status';

  // colors tuned to match the screenshot
  private colorFCV = '#0B6F6A';
  private colorNonFCV = '#78C9C5';

  chartOptions: Highcharts.Options = {};
  private centerValue?: Highcharts.SVGElement;
  private centerSub?: Highcharts.SVGElement;

  constructor() {
    const total = this.nonFcv + this.fcv;

    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        spacing: [10, 10, 0, 10],
        // draw/update the center labels
        events: {
          render: function () {
            const chart = this as Highcharts.Chart;
            const total = (chart.options as any).__total as number;

            const cx = chart.plotLeft + chart.plotWidth / 2;
            const cy = chart.plotTop + chart.plotHeight * 0.88; // push down to arc center

            // remove and re-create each render (cheap + reliable)
            (chart as any).__centerValue?.destroy();
            (chart as any).__centerSub?.destroy();

            (chart as any).__centerValue = chart.renderer
              .text(
                Highcharts.numberFormat(total, 0),
                cx,
                cy - 6
              )
              .attr({ align: 'center' })
              .css({
                fontSize: '38px',
                fontWeight: '600',
                color: '#1a1a1a',
                fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
              })
              .add();

            (chart as any).__centerSub = chart.renderer
              .text('By FCV Status', cx, cy + 20)
              .attr({ align: 'center' })
              .css({
                fontSize: '16px',
                color: '#3c3c3c',
                fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
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
          center: ['50%', '85%'],     // puts the semi-donut low in the card
          size: '140%',
          innerSize: '70%',
          borderWidth: 0,
          allowPointSelect: false,
          dataLabels: {
            enabled: true,
            // show "value(%)" beside the arc like the screenshot
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

      // we stash total on options so the render event can read it
      // (Highcharts keeps 'this.options' stable)
      __total: total as any,

      series: [
        {
          type: 'pie',
          data: [
            {
              name: 'Non - FCV',
              y: this.nonFcv,
              color: this.colorNonFCV
            },
            {
              name: 'FCV',
              y: this.fcv,
              color: this.colorFCV
            }
          ]
        }
      ] as Highcharts.SeriesOptionsType[]
    };
  }

  ngOnDestroy(): void {
    // nothing to clean up — labels are chart-owned
  }
}
