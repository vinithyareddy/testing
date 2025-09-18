import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LiftSectionLoaderComponent } from '@lift/loaders';
import { LiftPopoverComponent, PopoverConfig } from '@lift/ui';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LiftSectionLoaderComponent,
    HighchartsChartModule,
    LiftPopoverComponent
  ],
  styleUrls: ['./swfp-by-fcv-status.component.scss'],
})
export class SwfpByFcvStatusComponent implements OnInit, AfterViewInit {
  ResponseFlag = false;
  collapsed = false;
  widgetType = 'ch';   // ch = chart
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  fcvData: any[] = [];
  config1: PopoverConfig = { showPopoverOnClick: true };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.fcvData = [
      { name: 'FCV', value: 104, color: '#95dad9' },
      { name: 'Non-FCV', value: 44, color: '#3e9b9a' },
    ];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.fcvData.length > 0) {
        this.onInitLoad(this.fcvData);
      }
    }, 100);
  }

  loadWidget(type: string) {
    this.widgetType = type;
    if (this.fcvData.length > 0) {
      this.onInitLoad(this.fcvData);
    }
  }

  onInitLoad(data: any[]): void {
    this.ResponseFlag = true;
    const total = data.reduce((acc, cur) => acc + cur.value, 0);

    this.chartOptions = {
      chart: {
        type: 'pie',
        spacingTop: 20,
        spacingBottom: 20,
        spacingLeft: 40,
        spacingRight: 50,
      },
      title: {
        verticalAlign: 'middle',
        floating: true,
        useHTML: true,
        y: -10,
        text: `<span style="font-size:30px; font-weight:bold">${total}</span><br/><span style="font-size:12px">By FCV Status</span>`,
      },
      tooltip: { pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)' },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '85%',
          borderRadius: 0,
          showInLegend: true,
          dataLabels: {
            enabled: true,
            distance: 5,
            format: '{point.y} ({point.percentage:.0f}%)',
            crop: false,
            overflow: 'allow'
          },
          ...(this.widgetType === 'ch'
            ? { startAngle: -90, endAngle: 90, center: ['50%', '75%'], size: '140%' }
            : { startAngle: 0, endAngle: 360, center: ['50%', '50%'], size: '120%' }),
        },
      },
      series: [
        {
          type: 'pie',
          name: 'FCV Status',
          data: data.map(d => ({ name: d.name, y: d.value, color: d.color })),
        },
      ],
    };
  }

  getDetailPage() {
    this.router.navigate(['fcv-status'], { relativeTo: this.route });
  }

  // ✅ Force chart to reflow responsively
  @HostListener('window:resize')
  onResize() {
    if (this.Highcharts && (Highcharts as any).charts) {
      (Highcharts as any).charts.forEach((chart: any) => {
        if (chart) {
          chart.reflow();
        }
      });
    }
  }
}


.budget-card-box {
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 5px;

  .widget-heading {
    margin-right: 20px;
    i.fa-info-circle {
      font-size: 14px;
      color: #0071bc;
      margin-left: 6px;
      cursor: pointer;
    }
  }

  .header-icons {
    margin-bottom: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;

    div {
      width: 28px;
      height: 28px;
      border: 1px solid #d6d6d6;
      text-align: center;
      line-height: 28px;
      cursor: pointer;

      i {
        font-size: 14px;
      }
    }

    .ellipsis {
      border: none;
      color: #0071bc;
    }
  }

  .inner-card-box {
    padding: 40px 0 10px 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    highcharts-chart {
      width: 100% !important;
      height: 100% !important;
      min-height: 230px; // keeps same visual size as before
      display: block;
    }
  }

  .viewmore {
    font-size: 13px;
    font-weight: 500;
    color: #0071bc;
    text-align: right;
  }
}

.fa-chart-bar {
  display: inline-block;
  transform: rotate(270deg) scaleY(-1);
}

.fa-chart-pie {
  display: inline-block;
  transform: rotate(180deg) scaleY(-1);
}


<div class="budget-card-box" #chartsection>
  <div class="budget-box-chart">

    <!-- Header -->
    <div class="card-box-header-sec d-flex justify-content-between align-items-center">
      <!-- Title -->
      <div class="widget-heading pointer mt-1">
        <span class="d-inline-flex">
          Workforce Supply (FTE) by FCV Status
          <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
        </span>
      </div>

      <!-- Icons -->
      <div class="header-icons">
        <div class="lft-toggle" [class.lft-toggle-active]="widgetType == 'th'" (click)="loadWidget('th')">
          <i class="fas fa-chart-bar" aria-hidden="true"></i>
        </div>
        <div class="rgt-toggle" [class.rgt-toggle-active]="widgetType == 'ch'" (click)="loadWidget('ch')">
          <i class="far fa-chart-pie" aria-hidden="true"></i>
        </div>
        <div class="ellipsis">
          <i class="fas fa-ellipsis-v"></i>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div>
      <ng-container *ngIf="!ResponseFlag">
        <div class="loader-img">
          <lift-section-loader></lift-section-loader>
        </div>
      </ng-container>

      <!-- Chart View -->
      <ng-container *ngIf="ResponseFlag">
        <ng-container *ngIf="widgetType == 'ch' || widgetType == 'th'">
          <div class="inner-card-box">
            <highcharts-chart
              [Highcharts]="Highcharts"
              [options]="chartOptions"
              [constructorType]="'chart'">
            </highcharts-chart>
          </div>
        </ng-container>

        <!-- View More -->
        <div class="viewmore pointer mt-3 pt-3" (click)="getDetailPage()">
          <span>View More&nbsp;&nbsp;</span><i class="fa fa-angle-right"></i>
        </div>
      </ng-container>
    </div>
  </div>
</div>

<ng-template #infotemp>
  <lift-popover popoverTitle="Workforce Supply (FTE) by FCV Status" popoverText="" [config]="config1">
    <span><i class="far fa-info-circle"></i></span>
  </lift-popover>
</ng-template>
