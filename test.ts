import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  OnInit,
  Renderer2,
  DestroyRef,
  inject,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { SwfpFilterState } from 'app/core/swfp-filter-state/swfp-filter-state';
import { selectEncodedFilter } from 'app/core/swfp-filter-state/swfp-filters.selectors';
import { SwfpApiService } from 'app/modules/shared/swfp-shared/services/swfp-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LiftPopoverComponent } from '@lift/ui';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { LiftSectionLoaderComponent, LiftSkeletonComponent } from '@lift/loaders';
import { SwfpFteByGender } from '../../models/swfp-historical-Insights.model';
import { SwfpQueryBuilderService } from 'app/modules/shared/swfp-shared/services/swfp-query-builder.service';
NoDataToDisplay(Highcharts);

interface ApiResponseItem {
  fiscal_year: string;
  Category: string;
  fte: number;
}

@Component({
  selector: 'app-swfp-by-gender',
  templateUrl: './swfp-by-gender.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HighchartsChartModule,
    LiftPopoverComponent,
    LiftSectionLoaderComponent
  ],
  styleUrls: ['./swfp-by-gender.component.scss']
})
export class SwfpbyGenderComponent implements OnInit, AfterViewInit {
  widgetId: string = 'SWFI_6';
  fullview = false;
  widgetType: any = 'ch';
  responseFlag: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  apiData: ApiResponseItem[] = [];
  genderData: { name: string; y: number }[] = [];

  public fiterDataFromUrl$ = this.store.select(selectEncodedFilter);
  private destroyRef = inject(DestroyRef);

  constructor(
    private render: Renderer2,
    private cdr: ChangeDetectorRef,
    public store: Store<SwfpFilterState>,
    public apiService: SwfpApiService,
    public queryBuilder: SwfpQueryBuilderService,
  ) { }

  ngOnInit(): void {
    this.fiterDataFromUrl$
      .pipe(
        distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
        debounceTime(100),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((x: SwfpFilterState) => {
        if (x.isApiLoaded) {
          this.responseFlag = false;
          const dynamicFilters: string = this.queryBuilder.buildDynamicFilter(this.widgetId);
          this.loadApiData(dynamicFilters);
        }
      });


    this.loadApiData("");
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
      window.dispatchEvent(new Event('resize'));
    }, 400);
  }

  private loadApiData(dynamicFilters: string): void {
    this.apiService.getWidgetData(this.widgetId, dynamicFilters).subscribe({
      next: (response: any) => {
        this.responseFlag = true;
        this.apiData = response as any[];
        this.genderData = [];

        if (response.length > 0) {
          const totals = response.reduce((acc: Record<string, number>, curr: SwfpFteByGender) => {
            acc[curr.Category as string] = (acc[curr.Category as string] || 0) + curr.fte as number;
            return acc;
          },
            {});
          this.genderData = Object.entries(totals).map(([category, fte]) => ({
            name: category as string,
            y: fte as any,
            //color: (category?.toLocaleLowerCase().includes("non")) ? "#95DAD9" : "#3E9B9A"
          })).sort(function (a, b) {
            return b.name.localeCompare(a.name);
          });

          this.loadChart();
        }

        setTimeout(() => {
          this.cdr.detectChanges();
          window.dispatchEvent(new Event('resize'));
        }, 300);
      },
      error: (err) => {
        this.responseFlag = true;
        console.error('Error loading API data:', err);
        this.genderData = [];
        this.loadChart();
      }
    });
  }

  loadWidget(chartType: any) {
    this.widgetType = chartType;
  }

  private loadChart(): void {
    if (!this.genderData || this.genderData.length === 0) {
      return;
    }
    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    })

    this.chartOptions = {
      accessibility: { enabled: false },
      chart: {
        type: 'pie',
        events: {
          render: function () {
            const chart = this as any;
            if (!chart.series || chart.series.length === 0) return;
            const series = chart.series[0];
            if (!series || !series.points) return;

            const total = (series.points || []).reduce(
              (acc: number, p: any) => acc + ((p.y ?? 0) as number),
              0
            );
            const totalWithSeparator = total.toLocaleString();

            const cx = chart.plotLeft + chart.plotWidth / 2;
            const cy = chart.plotTop + chart.plotHeight / 2;

            if (!chart.centerValueText) {
              chart.centerValueText = chart.renderer
                .text(String(totalWithSeparator), cx, cy - 6)
                .css({ fontSize: '26px', fontWeight: '700' })
                .attr({ align: 'center' })
                .add();
              chart.centerSubtitleText = chart.renderer
                .text('By Gender', cx, cy + 14)
                .css({ fontSize: '14px', fontWeight: '500' })
                .attr({ align: 'center' })
                .add();
            } else {
              chart.centerValueText.attr({
                text: String(totalWithSeparator),
                x: cx,
                y: cy - 6
              });
              chart.centerSubtitleText.attr({
                text: 'By Gender',
                x: cx,
                y: cy + 14
              });
            }
          }
        }
      } as any,
      colors: ['#34a7f2', '#aedcfa'],
      title: { text: '' },
      tooltip: {
        pointFormat: '<b>{point.y:,.0f}</b> ({point.percentage:.0f}%)'
      },
      credits: { enabled: false },
      lang: {
        noData: "No data to display !!" // Customize your no-data message here
      },
      noData: { // Configure noData options
        style: {
          fontWeight: '500',
          fontSize: '18px',
          color: '#bdc3c7',
          fontfamily: "Open Sans"

        }
      },
       plotOptions: {
          pie: {
              innerSize: '85%',
              size: '85%',
              showInLegend: true,
              borderRadius: 0,
              startAngle: -10,
              endAngle: 360,
              dataLabels: {
                  enabled: true,
                  color: '#6b7685',
                  distance: 20,
                  softConnector: true,
                  crop: false,
                  connectorWidth: 1,
                  connectorPadding: 8,
                  //crookDistance: '80%',  // Percentage or pixel value
                  format: '{point.y:,.0f} ({point.percentage:.0f}%)',
                  formatter: function () {
                      const pct = Highcharts.numberFormat(this.percentage || 0, 0);
                      return `${Highcharts.numberFormat(this.y as number, 0, '.', ',')} (${pct}%)`;
                  },
                  style: {
                      fontSize: '12px',
                      fontWeight: '600',
                      textOutline: 'none'
                  },
                  filter: {
                      operator: '>',
                      property: 'percentage',
                      value: 0
                  }
              }
          }
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        itemMarginTop: 5,
        itemMarginBottom: 5,
        layout: 'vertical',
        useHTML: true,
        symbolWidth: 0,
        symbolHeight: 0,
        symbolRadius: 0,
        events: {
          itemClick: function (event: any) {
            event.preventDefault();
          }
        },
        itemStyle: {
          textOutline: 'none',
          fontWeight: '500',
          fontSize: '13px'
        },
        labelFormatter: function () {
          const point = this as unknown as Highcharts.Point;
          const pct = Highcharts.numberFormat(
            (point.percentage as number) || 0,
            0
          );
          return `<div style="display: flex; align-items: center; width: 220px; padding: 4px 0; border-bottom: 1px solid #ebedf0;">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <div style="width: 12px; height: 12px; background: ${point.color}; border-radius: 50%;"></div>
              <span style="font-weight: 350; font-size: 13px; color: #333;">${point.name}</span>
            </div>
            <div style="text-align: right; width: 100px; font-weight: 600; font-size: 13px; color: #333;">${Highcharts.numberFormat(point.y as any, 0, '.', ',')} (${pct}%)</div>
          </div>`;
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Gender',
          size: '90%',
          data: this.genderData.map((d) => ({
            name: d.name,
            y: d.y
          }))
        }
      ]
    };
  }
  get totalCount(): number {
    return this.genderData.reduce((sum, slice) => sum + (slice.y || 0), 0);
  }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview === true) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
  }
}

<div [ngClass]="{ 'full-view' : fullview }">
    <div class="budget-card-box-lg" #cartboxchartsection>
        <div class="budget-box-chart-lg">
            <div class="d-flex justify-content-between align-items-center flex-wrap">
                <!-- Left Section -->
                <div class="widget-heading pointer mt-1 col-md-8 d-flex align-items-center">
                    <span class="d-inline-flex">
                        Workforce Supply (FTE) by Gender
                        <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
                    </span>
                </div>

                <!-- Right Section -->
                <div class="col-md-4 d-flex justify-content-end align-items-center header-icons">

                    <!-- Toggle Buttons -->
                    <div class="togglebtn d-flex">
                        <div class="lft-toggle" [class.lft-toggle-active]="widgetType == 'th'"
                            (click)="loadWidget('th')">
                            <i class="far fa-table fnticon" aria-hidden="true"></i>
                        </div>
                        <div class="rgt-toggle" [class.rgt-toggle-active]="widgetType == 'ch'"
                            (click)="loadWidget('ch')">
                            <i class="far fa-chart-bar fnticon" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="d-flex gap-3">
                        <span (click)="fullPageView()" class="view">
                            @if (!fullview) {
                            <i class="fas fa-expand" title="Zoom" alt="Zoom"></i>
                            }
                            @if (fullview) {
                            <i class="fa-light fa-xmark" title="close"></i>
                            }
                        </span>
                        <!-- <div class="ellipsis ml-2">
                            <i class="fas fa-ellipsis-v"></i>
                        </div> -->
                    </div>
                </div>
            </div>


            <div>
                <div>
                    <ng-container *ngIf="!responseFlag">
                        <div class="loader-img">
                            <lift-section-loader></lift-section-loader>
                        </div>
                    </ng-container>
                    <ng-container *ngIf="responseFlag">
                    <ng-container *ngIf="widgetType === 'ch'">
                        <div class="inner-card-box-lg mt-4"><br><br>
                            <div>
                                <ng-container class="chart-section" *ngIf="genderData.length > 0">
                                    <highcharts-chart [Highcharts]="Highcharts" [options]="chartOptions" class="highchart-container"
                                        style="width: 100%; height: 300px; display: block;">
                                    </highcharts-chart>
                                </ng-container>
                                <div *ngIf="genderData.length === 0">
                                <div class="no-data-center">
                                    <span>No data to display !! </span>
                                </div>
                            </div>
                            </div>
                        </div>
                    </ng-container>
                    <ng-container *ngIf="widgetType === 'th' " style="border: 2px">
                        <div class="row table-row">
                            <div class="table-container custom-tabel-cls" *ngIf="genderData.length > 0">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th class="text-start">Gender</th>
                                            <th class="text-end">Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr *ngFor="let row of genderData">
                                            <td class="text-start">{{ row.name }}</td>
                                            <td class="text-end">{{ row.y | number }}({{(row.y/totalCount) * 100 |
                                                number:'1.0-0'}})%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div *ngIf="genderData.length === 0">
                                <div class="no-data-center">
                                    <span>No data to display !! </span>
                                </div>
                            </div>
                        </div>

                    </ng-container>
                    </ng-container>
                </div>
            </div>
            <!-- <div class="viewmore pointer mt-3 pt-3">
                <span>View More&nbsp;&nbsp;</span>
                <i class="fa fa-angle-right"></i>
            </div> -->

        </div>

    </div>

    <ng-template #infotemp>
        <lift-popover class="lift-popover-icon" popoverTitle="Workforce Supply (FTE) by Gender" popoverText="">
            <span><i aria-hidden="true" class="far fa-info-circle"></i></span>
        </lift-popover>
    </ng-template>
</div>



                          // ::ng-deep .highcharts-legend-item {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 10px 0;
//     border-bottom: 1px solid #ddd;
//     min-width: 160px;
//     gap: 30px;
// }
// :host ::ng-deep .highcharts-legend-item>span {
//     display: block !important;
// }

:host ::ng-deep .highcharts-legend .hc-legend-row {
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    min-width: 150px;
    padding-bottom: 3px;
    border-bottom: 1px solid #ebedf0;
}

// :host ::ng-deep .legend-left {
//     font-weight: 100;
//     font-size: 8px;
// }
:host ::ng-deep .hc-legend-name {
    font-weight: 350 !important;
    font-size: 13px !important;
}

:host ::ng-deep .hc-legend-marker {
    font-weight: 350 !important;
    font-size: 13px !important;
}

// ::ng-deep .hc-legend-right {
//     font-weight: 500;
// }

// ::ng-deep .highcharts-legend-item text {
//     font-size: 13px;
//     font-weight: 500;
//     fill: #3333;
//     gap: 30px;
// }

.ellipsis {
    cursor: pointer;
    font-size: 18px;
    margin-left: 12px;
    color: #0071bc;
}

.view {
    font-size: 18px;
    color: #0071bc;
}

.header-icons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;

    i {
        // font-size: 14px !important;
        cursor: pointer;
        font-weight: 100;
    }
}

.widget-heading {
    color: #051223;

    i.fa-info-circle {
        font-size: 12px;
        color: #0071bc;
        margin-left: 4px;
        cursor: pointer;
    }
}

.full-view {
    position: fixed;
    overflow-y: auto;
    overflow-x: hidden;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 99999;
    background-color: #fff;
    padding: 20px;

    .budget-card-box-lg {
        // height: 820px !important;

        .budget-box-chart-lg {
            // height: 840px !important;
            height: calc(92vh) !important;
        }

        .TableView {
            // height: 650px !important;
            // max-height: 680px;
            height: calc(68vh) !important;
            max-height: calc(68vh) !important;
            width: 100%;
        }

        .highchart-container {
            // min-height: 670px !important;
            min-height: calc(68vh) !important;
        }
    }

    .custom-tabel-cls {
        // min-height: 725px !important;
        height: calc(72vh) !important;
    }

    /* ::ng-deep .table {
        // min-height: 725px !important;
        height: calc(72vh) !important;
    } */

    // Full view chart positioning - move entire chart to the left for better balance
    .highchart-container {
        transform: translateX(-80px) !important;
    }

    // Alternative: Move the chart container
    :host ::ng-deep .highcharts-container {
        transform: translateX(-80px) !important;
    }
}

.lift-popover-icon {
    margin-top: -5px;
}

.lft-toggle {
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    width: 30px;
    height: 30px;
}

.rgt-toggle {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    width: 30px;
    height: 30px;
}

.fa-chart-bar {
    display: inline-block;
    transform: rotate(270deg) scaleY(-1);
   // margin-left: 9px;
   // margin-top: 8px;
   // font-size: 12px !important;
}

.budget-box-chart-lg {
    min-height: 476px !important;
}

.fa-expand {
   // -webkit-text-stroke: 0.5px white;
}

.fa-ellipsis-v {
    font-size: 14px;
    -webkit-text-stroke: 0.3px white;
}

.ellipsis {
    margin-top: -2px;
}

.rgt-toggle-active {
    color: #0071BC;
}

::ng-deep .custom-tabel-cls {
    height: 320px !important
}


import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  OnInit,
  Renderer2,
  DestroyRef,
  inject,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { SwfpFilterState } from 'app/core/swfp-filter-state/swfp-filter-state';
import { selectEncodedFilter } from 'app/core/swfp-filter-state/swfp-filters.selectors';
import { SwfpApiService } from 'app/modules/shared/swfp-shared/services/swfp-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LiftPopoverComponent } from '@lift/ui';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { LiftSectionLoaderComponent, LiftSkeletonComponent } from '@lift/loaders';
import { SwfpFteByGender } from '../../models/swfp-historical-Insights.model';
import { SwfpQueryBuilderService } from 'app/modules/shared/swfp-shared/services/swfp-query-builder.service';
NoDataToDisplay(Highcharts);

interface ApiResponseItem {
  fiscal_year: string;
  Category: string;
  fte: number;
}

@Component({
  selector: 'app-swfp-by-gender',
  templateUrl: './swfp-by-gender.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HighchartsChartModule,
    LiftPopoverComponent,
    LiftSectionLoaderComponent
  ],
  styleUrls: ['./swfp-by-gender.component.scss']
})
export class SwfpbyGenderComponent implements OnInit, AfterViewInit {
  widgetId: string = 'SWFI_6';
  fullview = false;
  widgetType: any = 'ch';
  responseFlag: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  apiData: ApiResponseItem[] = [];
  genderData: { name: string; y: number }[] = [];

  public fiterDataFromUrl$ = this.store.select(selectEncodedFilter);
  private destroyRef = inject(DestroyRef);

  constructor(
    private render: Renderer2,
    private cdr: ChangeDetectorRef,
    public store: Store<SwfpFilterState>,
    public apiService: SwfpApiService,
    public queryBuilder: SwfpQueryBuilderService,
  ) { }

  ngOnInit(): void {
    this.fiterDataFromUrl$
      .pipe(
        distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
        debounceTime(100),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((x: SwfpFilterState) => {
        if (x.isApiLoaded) {
          this.responseFlag = false;
          const dynamicFilters: string = this.queryBuilder.buildDynamicFilter(this.widgetId);
          this.loadApiData(dynamicFilters);
        }
      });


    this.loadApiData("");
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
      window.dispatchEvent(new Event('resize'));
    }, 400);
  }

  private loadApiData(dynamicFilters: string): void {
    this.apiService.getWidgetData(this.widgetId, dynamicFilters).subscribe({
      next: (response: any) => {
        this.responseFlag = true;
        this.apiData = response as any[];
        this.genderData = [];

        if (response.length > 0) {
          const totals = response.reduce((acc: Record<string, number>, curr: SwfpFteByGender) => {
            acc[curr.Category as string] = (acc[curr.Category as string] || 0) + curr.fte as number;
            return acc;
          },
            {});
          this.genderData = Object.entries(totals).map(([category, fte]) => ({
            name: category as string,
            y: fte as any,
            //color: (category?.toLocaleLowerCase().includes("non")) ? "#95DAD9" : "#3E9B9A"
          })).sort(function (a, b) {
            return b.name.localeCompare(a.name);
          });

          this.loadChart();
        }

        setTimeout(() => {
          this.cdr.detectChanges();
          window.dispatchEvent(new Event('resize'));
        }, 300);
      },
      error: (err) => {
        this.responseFlag = true;
        console.error('Error loading API data:', err);
        this.genderData = [];
        this.loadChart();
      }
    });
  }

  loadWidget(chartType: any) {
    this.widgetType = chartType;
  }

  private loadChart(): void {
    if (!this.genderData || this.genderData.length === 0) {
      return;
    }
    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    })

    this.chartOptions = {
      accessibility: { enabled: false },
      chart: {
        type: 'pie',
        events: {
          render: function () {
            const chart = this as any;
            if (!chart.series || chart.series.length === 0) return;
            const series = chart.series[0];
            if (!series || !series.points) return;

            const total = (series.points || []).reduce(
              (acc: number, p: any) => acc + ((p.y ?? 0) as number),
              0
            );
            const totalWithSeparator = total.toLocaleString();

            const cx = chart.plotLeft + chart.plotWidth / 2;
            const cy = chart.plotTop + chart.plotHeight / 2;

            if (!chart.centerValueText) {
              chart.centerValueText = chart.renderer
                .text(String(totalWithSeparator), cx, cy - 6)
                .css({ fontSize: '26px', fontWeight: '700' })
                .attr({ align: 'center' })
                .add();
              chart.centerSubtitleText = chart.renderer
                .text('By Gender', cx, cy + 14)
                .css({ fontSize: '14px', fontWeight: '500' })
                .attr({ align: 'center' })
                .add();
            } else {
              chart.centerValueText.attr({
                text: String(totalWithSeparator),
                x: cx,
                y: cy - 6
              });
              chart.centerSubtitleText.attr({
                text: 'By Gender',
                x: cx,
                y: cy + 14
              });
            }
          }
        }
      } as any,
      colors: ['#34a7f2', '#aedcfa'],
      title: { text: '' },
      tooltip: {
        pointFormat: '<b>{point.y:,.0f}</b> ({point.percentage:.0f}%)'
      },
      credits: { enabled: false },
      lang: {
        noData: "No data to display !!" // Customize your no-data message here
      },
      noData: { // Configure noData options
        style: {
          fontWeight: '500',
          fontSize: '18px',
          color: '#bdc3c7',
          fontfamily: "Open Sans"

        }
      },
       plotOptions: {
          pie: {
              innerSize: '85%',
              size: '85%',
              showInLegend: true,
              borderRadius: 0,
              startAngle: -10,
              endAngle: 360,
              dataLabels: {
                  enabled: true,
                  color: '#6b7685',
                  distance: 20,
                  softConnector: true,
                  crop: false,
                  connectorWidth: 1,
                  connectorPadding: 8,
                  //crookDistance: '80%',  // Percentage or pixel value
                  format: '{point.y:,.0f} ({point.percentage:.0f}%)',
                  formatter: function () {
                      const pct = Highcharts.numberFormat(this.percentage || 0, 0);
                      return `${Highcharts.numberFormat(this.y as number, 0, '.', ',')} (${pct}%)`;
                  },
                  style: {
                      fontSize: '12px',
                      fontWeight: '600',
                      textOutline: 'none'
                  },
                  filter: {
                      operator: '>',
                      property: 'percentage',
                      value: 0
                  }
              }
          }
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        itemMarginTop: 5,
        itemMarginBottom: 5,
        layout: 'vertical',
        useHTML: true,
        symbolWidth: 0,
        symbolHeight: 0,
        symbolRadius: 0,
        events: {
          itemClick: function (event: any) {
            event.preventDefault();
          }
        },
        itemStyle: {
          textOutline: 'none',
          fontWeight: '500',
          fontSize: '13px'
        },
        labelFormatter: function () {
          const point = this as unknown as Highcharts.Point;
          const pct = Highcharts.numberFormat(
            (point.percentage as number) || 0,
            0
          );
          return `<div style="display: flex; align-items: center; width: 220px; padding: 4px 0; border-bottom: 1px solid #ebedf0;">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <div style="width: 12px; height: 12px; background: ${point.color}; border-radius: 50%;"></div>
              <span style="font-weight: 350; font-size: 13px; color: #333;">${point.name}</span>
            </div>
            <div style="text-align: right; width: 100px; font-weight: 600; font-size: 13px; color: #333;">${Highcharts.numberFormat(point.y as any, 0, '.', ',')} (${pct}%)</div>
          </div>`;
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Gender',
          size: '90%',
          data: this.genderData.map((d) => ({
            name: d.name,
            y: d.y
          }))
        }
      ]
    };
  }
  get totalCount(): number {
    return this.genderData.reduce((sum, slice) => sum + (slice.y || 0), 0);
  }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview === true) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
  }
}
