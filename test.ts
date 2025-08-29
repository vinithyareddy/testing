import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverConfig } from '@lift/ui';
import * as Highcharts from 'highcharts';

type AgePoint = { category: string; percent: number };

@Component({
  selector: 'app-swfp-by-age-band',
  templateUrl: './swfp-by-age-band.component.html',
  styleUrls: ['./swfp-by-age-band.component.scss'],
})
export class SwfpByAgeBandComponent implements OnInit {
  ResponseFlag = false;
  collapsed = false;
  widgetType: 'ch' | 'th' = 'ch';

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  // Replace with API data later if needed
  ageData: AgePoint[] = [
    { category: '18–29', percent: 35 },
    { category: '30–39', percent: 52 },
    { category: '40–49', percent: 60 },
    { category: '50–59', percent: 74 },
    { category: '60–69', percent: 70 },
  ];

  config1: PopoverConfig = { showPopoverOnClick: true };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.ResponseFlag = true;
    this.buildChart(this.ageData);
  }

  loadWidget(type: 'ch' | 'th') {
    this.widgetType = type;
  }

  private buildChart(data: AgePoint[]) {
    const categories = data.map(d => d.category);
    const values = data.map(d => d.percent);

    const line = '#2a72d4';

    this.chartOptions = {
      chart: { type: 'areaspline' },
      title: { text: '' },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories,
        tickLength: 0,
        lineColor: '#e6e6e6',
        labels: { style: { color: '#555' } },
        title: { text: 'Age Category', style: { fontWeight: '600' } }
      },
      yAxis: {
        max: 100,
        tickInterval: 25,
        gridLineDashStyle: 'ShortDash',
        gridLineColor: '#d9d9d9',
        title: { text: 'Percentage(%)', style: { fontWeight: '600' } },
        labels: { format: '{value}%' }
      },
      tooltip: { valueSuffix: '%', shared: false },
      plotOptions: {
        areaspline: {
          color: line,
          fillOpacity: 0.15,
          lineWidth: 3,
          marker: {
            enabled: true,
            radius: 5,
            lineWidth: 2,
            lineColor: line,
            fillColor: '#fff'
          },
          dataLabels: {
            enabled: true,
            format: '{y}%',
            style: { fontWeight: '700', textOutline: 'none' },
            y: -8
          }
        }
      },
      series: [
        {
          type: 'areaspline',
          name: 'By Age Band',
          data: values
        }
      ]
    };
  }

  getDetailPage() {
    this.router.navigate(['age-band'], { relativeTo: this.route });
  }
}


<div class="budget-card-box">
  <div class="budget-box-chart">
    <!-- Header -->
    <div class="card-box-header-sec d-flex justify-content-between align-items-center">
      <div class="widget-heading pointer mt-1">
        <span>
          Workforce Supply (FTE) by Age Band
          <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
        </span>
      </div>

      <div class="header-icons">
        <div class="lft-toggle" [class.lft-toggle-active]="widgetType === 'th'" (click)="loadWidget('th')">
          <i class="fas fa-table" aria-hidden="true"></i>
        </div>
        <div class="rgt-toggle" [class.rgt-toggle-active]="widgetType === 'ch'" (click)="loadWidget('ch')">
          <i class="fas fa-chart-line" aria-hidden="true"></i>
        </div>
        <div class="view">
          <i class="fas fa-expand"></i>
        </div>
        <div class="ellipsis">
          <i class="fas fa-ellipsis-v"></i>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div [@collapse]="collapsed">
      <ng-container *ngIf="!ResponseFlag">
        <div class="loader-img">
          <lift-section-loader></lift-section-loader>
        </div>
      </ng-container>

      <ng-container *ngIf="ResponseFlag">
        <ng-container *ngIf="widgetType === 'ch'">
          <div class="inner-card-box">
            <highcharts-chart
              [Highcharts]="Highcharts"
              [options]="chartOptions"
              [constructorType]="'chart'"
              style="width: 100%; height: 280px; display: block;">
            </highcharts-chart>
          </div>
        </ng-container>

        <!-- (Optional) A future table view could go here when widgetType === 'th' -->

        <div class="viewmore pointer mt-3 pt-3" (click)="getDetailPage()">
          <span>View More&nbsp;&nbsp;</span><i class="fa fa-angle-right"></i>
        </div>
      </ng-container>
    </div>
  </div>
</div>

<ng-template #infotemp>
  <lift-popover popoverTitle="Workforce Supply (FTE) by Age Band" popoverText="" [config]="config1">
    <span><i class="far fa-info-circle"></i></span>
  </lift-popover>
</ng-template>


.budget-card-box {
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,.1);
  margin-top: 25px;

  .widget-heading {
    margin-right: 16px;

    i.fa-info-circle {
      font-size: 14px;
      color: #0071bc;
      margin-left: 6px;
      cursor: pointer;
    }
  }

  .header-icons {
    display: flex;
    align-items: center;
    gap: 8px;

    .lft-toggle,
    .rgt-toggle,
    .view {
      width: 28px;
      height: 28px;
      border: 1px solid #d6d6d6;
      text-align: center;
      line-height: 28px;
      cursor: pointer;

      i { font-size: 14px; }
    }

    .ellipsis {
      width: 28px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      cursor: pointer;
      color: #0071bc;
    }
  }

  .inner-card-box {
    padding: 10px 0; /* small top gap so chart sits a bit lower */
  }

  .viewmore {
    font-size: 13px;
    font-weight: 500;
    color: #0071bc;
    text-align: right;
  }
}

/* Optional: rotate icons to match your other widgets, if desired
.fa-chart-bar { transform: rotate(270deg) scaleY(-1); display: inline-block; }
.fa-chart-pie { transform: rotate(180deg)  scaleY(-1); display: inline-block; }
*/
