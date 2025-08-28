import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverConfig } from '@lift/ui';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs';
import { AppState } from 'app/state/app.state';
import { selectFCVStatusData } from 'app/state/workforce/workforce.selectors';
import { ManagerHighchartServices } from 'app/services/manager-highchart.service';

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  styleUrls: ['./swfp-by-fcv-status.component.scss'],
})
export class SwfpByFcvStatusComponent implements OnInit, AfterViewInit {
  ResponseFlag = false;
  collapsed = false;
  widgetType = 'ch';

  PieChart: any = [];
  fcvData: any[] = [];

  config1: PopoverConfig = { showPopoverOnClick: true };

  private destroyRef = inject(DestroyRef);

  @ViewChild('chartsection') chartsection!: ElementRef;

  constructor(
    private highChartsService: ManagerHighchartServices,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.store
      .select(selectFCVStatusData)
      .pipe(
        filter((data) => !!data && Array.isArray(data) && data.length > 0),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.fcvData = data;
        this.onInitLoad(this.fcvData);
      });
  }

  loadWidget(type: string) {
    this.widgetType = type;
  }

  onInitLoad(data: any[]): void {
    this.ResponseFlag = true;

    const total = data.reduce((acc, cur) => acc + cur.value, 0);

    const chartOptions = {
      chartTitle: 'Workforce Supply (FTE)',
      centerVal: total,
      centerTxt: 'By FCV Status',
      chartWidth: this.chartsection.nativeElement.offsetWidth - 30,
      chartHight: 260,
      legendVisible: true,
      dataseries: [
        {
          name: 'FCV Status',
          data: data.map((d) => ({
            name: d.name,
            y: d.value,
            color: d.color,
          })),
        },
      ],
      donut: true,
      roundedEnds: true,
    };

    // use central service
    this.PieChart = this.highChartsService.GetDonutChart(chartOptions);
  }

  expand() {
    this.collapsed = false;
  }
  collapse() {
    this.collapsed = true;
  }

  getDetailPage() {
    this.router.navigate(['fcv-status'], { relativeTo: this.route });
  }
}


<div class="budget-card-box" #chartsection>
  <div class="budget-box-chart">
    <!-- Header -->
    <div class="row card-box-header-sec">
      <div class="widget-heading pointer mt-1 col-md-8">
        <span>
          Workforce Supply (FTE) by FCV Status
          <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
        </span>
      </div>
      <div class="col-md-4 bgt-text-end">
        <div class="zoomicon">
          <span *ngIf="collapsed" (click)="expand()"
            ><img src="assets/images/icons/arrow_up.png"
          /></span>
          <span *ngIf="!collapsed" (click)="collapse()"
            ><img src="assets/images/icons/arrow_down.png"
          /></span>
        </div>
        <div class="togglebtn">
          <div
            class="lft-toggle"
            [class.lft-toggle-active]="widgetType == 'th'"
            (click)="loadWidget('th')"
          >
            <i class="fa fa-table fnticon"></i>
          </div>
          <div
            class="rgt-toggle"
            [class.rgt-toggle-active]="widgetType == 'ch'"
            (click)="loadWidget('ch')"
          >
            <i class="fa fa-bar-chart fnticon"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div [@collapse]="collapsed">
      <!-- Loader -->
      <ng-container *ngIf="!ResponseFlag">
        <div class="loader-img">
          <lift-section-loader></lift-section-loader>
        </div>
      </ng-container>

      <!-- Chart View -->
      <ng-container *ngIf="ResponseFlag">
        <ng-container *ngIf="widgetType == 'ch'">
          <div class="inner-card-box">
            <div class="row">
              <div class="col-md-11 col-lg-11">
                <ng-container *ngFor="let chart of PieChart">
                  <highcharts-chart
                    [Highcharts]="chart.Highcharts"
                    [options]="chart.chartOptions"
                    [constructorType]="chart.chartConstructor"
                  >
                  </highcharts-chart>
                </ng-container>
              </div>
              <div class="col-md-1 col-lg-1"></div>
            </div>
          </div>
        </ng-container>

        <!-- Table View -->
        <ng-container *ngIf="widgetType == 'th'">
          <div class="row table-row">
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th class="tbl_left">FCV Status</th>
                    <th class="tl_left">Units</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of fcvData">
                    <td class="tbl_left">{{ item.name }}</td>
                    <td class="tl_right text-link-color">{{ item.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ng-container>

        <!-- Footer -->
        <div class="viewmore pointer mt-3 pt-3" (click)="getDetailPage()">
          <span>View More&nbsp;&nbsp;</span><i class="fa fa-angle-right"></i>
        </div>
      </ng-container>
    </div>
  </div>
</div>

<ng-template #infotemp>
  <lift-popover
    popoverTitle="Workforce Supply (FTE) by FCV Status"
    popoverText=""
    [config]="config1"
  >
    <span><i class="far fa-info-circle"></i></span>
  </lift-popover>
</ng-template>


.budget-card-box {
  background: #fff;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);

  .widget-heading {
    font-size: 14px;
    font-weight: 600;
    color: #2d2d2d;
  }

  .zoomicon img {
    width: 14px;
    cursor: pointer;
  }

  .togglebtn {
    display: flex;
    justify-content: flex-end;

    .lft-toggle,
    .rgt-toggle {
      width: 28px;
      height: 28px;
      border: 1px solid #d6d6d6;
      border-radius: 4px;
      margin-left: 6px;
      text-align: center;
      line-height: 28px;
      cursor: pointer;

      &.lft-toggle-active,
      &.rgt-toggle-active {
        background-color: #00796b;
        color: #fff;
      }
    }
  }

  .inner-card-box {
    padding: 10px 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    th {
      font-size: 13px;
      font-weight: 600;
      color: #555;
      padding: 6px 0;
      text-align: left;
    }

    td {
      font-size: 13px;
      padding: 4px 0;
    }
  }

  .viewmore {
    font-size: 13px;
    font-weight: 500;
    color: #00796b;
    text-align: right;
  }
}
