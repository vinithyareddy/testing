import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FrameworkService } from '@framework/core/services';
import { PopoverConfig, PopoverPositions } from '@lift/ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HighchartServicesService } from 'services/highchart-services.service';
import { PowerbirestServicesService } from 'services/powerbirest-services.service';
import { SrServicesService } from 'services/sr-services.service';

@Component({
  selector: 'app-tf-reform-mvp',
  templateUrl: './tf-reform-mvp.component.html',
  styleUrls: ['./tf-reform-mvp.component.scss']
})
export class TfReformMvpComponent implements OnInit, OnDestroy {
  public forkJoinDestroy: any;
  ActiveTab: string = 'WB Portfolio';
  noOfActiveUmbrella: number = 0;
  noOfUmbrellaInPipeline: number = 0;
  noOfStandalone: number = 0;
  reductionRation: number = 0;
  sixPlusMonStandalone: number = 0;
  LessThanSixMonStandalone: number = 0;
  upcomingFYTD: number = 0;
  distributionSingedContributionChart = [];
  legendHtml = [];
  distributionStandalone: number = 0;
  distributionUmbrella: number = 0;
  ResponseFlag = false;
  filterMillionUnitCalc = this.srServicesService.filteredunitCalcMillion;
  legendOrder = ['Umbrellas', 'Standalone TFs'];
  @ViewChild('cartboxchartsection', { static: true }) cartboxchartsection: ElementRef;
  subscribeData: any;
  private destroy = new Subject();
  widgetHeaderInfo = '';
  reductionInfo = '';
  widgetHeaderInfo2 = '';
  widgetHeaderInfo3 = '';
  config: PopoverConfig = {
    placement: PopoverPositions.Top,
    adaptivePosition: true,
    container: 'body'
  };
  collibraRefNos = ['MVPWBW1', 'MVPWBW2', 'MVPWBW3', 'MVPWBW4'];

  constructor(public srServicesService: SrServicesService, private highChartsService: HighchartServicesService, public powerbirestService: PowerbirestServicesService, public fwService: FrameworkService, private spinner: NgxSpinnerService) {
    const combineParams = this.fwService.apiGetAppData('routeParams');
    combineParams.module = 'Trust Funds New';
    combineParams.section = 'mvp';
    combineParams.path = window.location.pathname;
    combineParams.Facets = '';
    this.fwService.apiSetAppData('routeParams', combineParams);
    if (this.srServicesService.tabselect === 1) {
      this.srServicesService.TFMvpHomePageTab = 'WB Portfolio';
    }

    if (this.subscribeData) { this.subscribeData.unsubscribe(); }
    this.subscribeData = this.srServicesService.filterData.pipe(
      takeUntil(this.destroy)
    ).subscribe((response: any) => {
      if (response.command === 'filterApply') {
        this.loadData();
      }
    });

    if (this.powerbirestService.tfmetadatalist === undefined) {
      this.powerbirestService.collibrametaData.subscribe((collibrametaData: any) => {
        if ('assets' in collibrametaData && Array.isArray(collibrametaData.assets)) {
          const repDetail = collibrametaData.assets.filter(x => this.collibraRefNos.includes(x.ReferenceNumber));
          repDetail.forEach(x => {
            if (x.ReferenceNumber === 'MVPWBW1') {
              this.widgetHeaderInfo = x.description;
            }
            if (x.ReferenceNumber === 'MVPWBW2') {
              this.reductionInfo = x.description;
            }
            if (x.ReferenceNumber === 'MVPWBW3') {
              this.widgetHeaderInfo2 = x.description;
            }
            if (x.ReferenceNumber === 'MVPWBW4') {
              this.widgetHeaderInfo3 = x.description;
            }
          });
        }
      });
    } else {
      if (this.powerbirestService.tfmetadatalist && 'assets' in this.powerbirestService.tfmetadatalist && Array.isArray(this.powerbirestService.tfmetadatalist.assets)) {
        const repDetail = this.powerbirestService.tfmetadatalist.assets.filter(x => this.collibraRefNos.includes(x.ReferenceNumber));
        repDetail.forEach(x => {
          if (x.ReferenceNumber === 'MVPWBW1') {
            this.widgetHeaderInfo = x.description;
          }
          if (x.ReferenceNumber === 'MVPWBW2') {
            this.reductionInfo = x.description;
          }
          if (x.ReferenceNumber === 'MVPWBW3') {
            this.widgetHeaderInfo2 = x.description;
          }
          if (x.ReferenceNumber === 'MVPWBW4') {
            this.widgetHeaderInfo3 = x.description;
          }
        });
      }
    }

  }

  ngOnInit(): void {
    setTimeout(() => {
      let tempmenulist = [];
      tempmenulist = this.srServicesService.getTFMenuList(true);
      this.fwService
        .apiUpdateSiteTitle({ title: 'Standard Reports | Trust Funds', link: '/tf' })
        .apiSetLeftNavModel(tempmenulist)
        .apiToggleLeftNav(true)
        .apiToggleHeaderControls({ settings: false, actions: false, help: true, isBeta: false })
        .apiToggleSplashScreen(false).apiActionMenuToggle(false);
    }, 100);
    this.fwService.apiTrackMyPageWithAppInsights({ pageName: 'Standard Reports - Trust Funds', subSections: [] });
    if (sessionStorage.getItem('Standard Report Beta - Trust Fund - MVPW') === null) {
      this.srServicesService.updateDashboardUsageStatsDetails('MVPW');
    }
    this.loadData();
  }

  loadData() {
    this.noOfActiveUmbrella = 0;
    this.noOfUmbrellaInPipeline = 0;
    this.noOfStandalone = 0;
    this.reductionRation = 0;
    this.sixPlusMonStandalone = 0;
    this.LessThanSixMonStandalone = 0;
    this.upcomingFYTD = 0;
    this.distributionStandalone = 0;
    this.distributionUmbrella = 0;
    this.distributionSingedContributionChart = [];
    this.ResponseFlag = false;
    const tfswid008a$ = this.srServicesService.getapiwidgetdataload('tfswid008a');
    const tfswid008b$ = this.srServicesService.getapiwidgetdataload('tfswid008b');
    const tfswid008c$ = this.srServicesService.getapiwidgetdataload('tfswid008c');
    const tfswid009$ = this.srServicesService.getapiwidgetdataload('tfswid009');
    const tfswid010$ = this.srServicesService.getapiwidgetdataload('tfswid010');
    this.forkJoinDestroy = forkJoin([tfswid008a$, tfswid008b$, tfswid008c$, tfswid009$, tfswid010$])
      .subscribe((data) => {
        this.ResponseFlag = true;
        const resdata = data[0].results[0].tables[0].rows;
        const resdata1 = data[1].results[0].tables[0].rows;
        const resdata2 = data[2].results[0].tables[0].rows;
        const resdata3 = data[3].results[0].tables[0].rows;
        const resdata4 = data[4].results[0].tables[0].rows;

        if (resdata.length > 0) {
          const activeUmbrella = resdata.filter(x => x['TF Datasets[Umbrella Program Status (New)]'] === 'Active Umbrellas');
          if (activeUmbrella.length > 0) {
            this.noOfActiveUmbrella = activeUmbrella.reduce((sum, item) => sum + item['[# Umbrella Programs]'], 0);
          }
          const umbrellaPipeline = resdata.filter(x => x['TF Datasets[Umbrella Program Status (New)]'] === 'Umbrellas in Pipeline');
          if (umbrellaPipeline.length > 0) {
            this.noOfUmbrellaInPipeline = umbrellaPipeline.reduce((sum, item) => sum + item['[# Umbrella Programs]'], 0);
          }
        }
        if (resdata1.length > 0) {
          const standalone = resdata1.filter(x => x['TF Datasets[Reform Type Name]'] === 'Standalone TFs');
          if (standalone.length > 0) {
            this.noOfStandalone = standalone.reduce((sum, item) => sum + item['[# Customized Active portfolio]'], 0);
          }
        }
        if (resdata2.length > 0) {
          let baselineValue = 0;
          let currentValue = 0;
          const reductionData = resdata2.filter(x => x['TF Datasets[Reform Type Name]'] === 'Standalone TFs');
          if (reductionData.length > 0) {
            const baselineData = reductionData.filter(x => (x['TF Datasets[Snapshot Type]'] as string).includes('Baseline'));
            if (baselineData.length > 0) {
              baselineValue = baselineData[0]['[# Customized Active portfolio]'] && baselineData[0]['[# Customized Active portfolio]'] !== null ? baselineData[0]['[# Customized Active portfolio]'] : 0;
            }

            const currentData = reductionData.filter(x => (x['TF Datasets[Snapshot Type]'] as string).includes('Current'));
            if (currentData.length > 0) {
              currentValue = currentData[0]['[# Customized Active portfolio]'] && currentData[0]['[# Customized Active portfolio]'] !== null ? currentData[0]['[# Customized Active portfolio]'] : 0;
            }

            this.reductionRation = baselineValue > 0 ? Math.round(((baselineValue - currentValue) / baselineValue) * 100) : 0
          }
        }
        if (resdata3.length > 0) {
          const closingStandalone = resdata3.filter(x => x['Trustee[Fund Class Name]'] === 'IBRD/IDA TFs');
          if (closingStandalone.length > 0) {
            this.sixPlusMonStandalone = closingStandalone[0]['[Past EDD > 6M]'] && closingStandalone[0]['[Past EDD > 6M]'] !== null ? closingStandalone[0]['[Past EDD > 6M]'] : 0;
            this.LessThanSixMonStandalone = closingStandalone[0]['[Past EDD < 6M]'] && closingStandalone[0]['[Past EDD < 6M]'] !== null ? closingStandalone[0]['[Past EDD < 6M]'] : 0;
            this.upcomingFYTD = closingStandalone[0]['[Upcoming FYTD]'] && closingStandalone[0]['[Upcoming FYTD]'] !== null ? closingStandalone[0]['[Upcoming FYTD]'] : 0;
          }
        }

        this.distributionStandalone = 0;
        this.distributionUmbrella = 0;
        if (resdata4.length > 0) {
          const standaloneData = resdata4.filter(x => x['Trustee[Program Type Name]'] === 'Standalone');
          if (standaloneData.length > 0) {
            this.distributionStandalone = standaloneData[0]['[Net Signed Amount until FYTD]'] && standaloneData[0]['[Net Signed Amount until FYTD]'] != null ? standaloneData[0]['[Net Signed Amount until FYTD]'] / this.filterMillionUnitCalc : 0;
          }
          const umbrellaData = resdata4.filter(x => x['Trustee[Program Type Name]'] === 'Umbrella');
          if (umbrellaData.length > 0) {
            this.distributionUmbrella = umbrellaData[0]['[Net Signed Amount until FYTD]'] && umbrellaData[0]['[Net Signed Amount until FYTD]'] != null ? umbrellaData[0]['[Net Signed Amount until FYTD]'] / this.filterMillionUnitCalc : 0;
          }
          this.getDisbursementChart();
        }
      });
  }

  getDisbursementChart() {
    if (this.distributionStandalone === 0 && this.distributionStandalone === 0) {
      return;
    }
    this.distributionSingedContributionChart = [];
    const chartData = [{
      name: 'Distribution of Signed Contribution in last 12 Months',
      data: [{
        name: 'Standalone TFs',
        daxcolumnName: `Trustee[Program Type Name]`,
        y: this.distributionStandalone,
        color: '#C2B7E2'
      },
      {
        name: 'Umbrellas',
        daxcolumnName: `Trustee[Program Type Code]`,
        y: this.distributionUmbrella,
        color: '#85CAF7'
      }],

      size: '100%',
      innerSize: '73%',
    }];

    this.legendHtml = chartData[0].data;
    this.legendHtml = this.legendHtml.sort((a, b) => this.legendOrder.indexOf(a['name']) - this.legendOrder.indexOf(b['name']));
    const legendVisible = false;
    const chartHeight = 175; // this.cartboxchartsection.nativeElement.offsetWidth / 1.8;
    const chartwidth = this.cartboxchartsection.nativeElement.offsetWidth;
    const chartTitle = 'Distribution of Signed Contribution in last 12 Months';
    const minval = 0;
    const maxval = this.distributionStandalone + this.distributionUmbrella;
    const centerTxt = 'Total';
    const centerVal = Number((this.distributionStandalone + this.distributionUmbrella).toFixed(2));
    const xAxisVisible = false;
    const yAxisVisible = false;
    this.distributionSingedContributionChart = this.highChartsService.DountChart(chartData, chartwidth, xAxisVisible,
      yAxisVisible, legendVisible, chartHeight, minval, maxval, centerTxt, centerVal, chartTitle);
  }

  onSelectTab(event) {
    if (this.srServicesService.tabload === '1') {
      this.ActiveTab = event.id;
      this.srServicesService.TFMvpHomePageTab = event.id;
      this.spinner.show();
      setTimeout(() => {

        if (this.srServicesService.MvpCategoryView !== event.id && event.id !== null) {
          this.srServicesService.MvpCategoryView = event.id;
          this.srServicesService.getClearFilterEmitter('filterApply');
          this.srServicesService.GetMvpcategoryChange();
        }

        this.spinner.hide();
      }, 500);
      if (event.id === 'WB Portfolio') {
        this.srServicesService.tabselect = 1;
      } else if (event.id === 'BU Portfolio') {
        this.srServicesService.tabselect = 2;
      } else {
        this.srServicesService.tabselect = 3;
      }
    }


    // if (this.srServicesService.tabload === '1') {
    //   this.ActiveTab = event.id;
    //   //this.spinner.show();
    //   setTimeout(() => {
    //     //this.spinner.hide();
    //     this.srServicesService.getChangeFilterEmitter('filterApply');
    //     //this.Refeshdata = value.id;
    //   }, 500);
    //   if (event.id === 'WB Portfolio') {
    //     this.srServicesService.tabselect = 1;
    //   } else if (event.id === 'BU Portfolio') {
    //     this.srServicesService.tabselect = 2;
    //   } else {
    //     this.srServicesService.tabselect = 3;
    //   }
    // }
  }

  ondrillclick(reportID: any, reportKey: any, categoryname: any) {
    this.powerbirestService.tfDrillReportApply(reportID, reportKey, categoryname);
  }

  ngOnDestroy() {
    //this.srServicesService.TFMvpHomePageTab = '';
    this.srServicesService.MvpCategoryView = 'WBG Portfolio';
    //this.srServicesService.getClearFilterEmitter('filterApply');
    //this.srServicesService.facetFilter = [];
    if (this.forkJoinDestroy) {
      this.forkJoinDestroy.unsubscribe();
    }
    if (this.subscribeData) {
      this.subscribeData.unsubscribe();
    }
    this.destroy.next('');
  }
}

html:
<div id="print-section">
    <app-trust-funds-top-header></app-trust-funds-top-header>
    <div class="container-lg mblView desktop-container">
        @if (srServicesService.facetFilter !== null && srServicesService.facetFilter.length > 0) {
        <div class="row">
            <div class="col-12 col-lg-12 col-md-12 col-sm-12">
                <div class="ps-0 pe-0">
                    <app-trust-funds-banner-section></app-trust-funds-banner-section>
                </div>
            </div>
        </div>
        }
        <div class="tf-layout-container">
            <lift-tab-group class="tf-layout-tab-container">
                <lift-tab [title]="'WB PORTFOLIO'" id="WB Portfolio" [active]="this.srServicesService.tabselect === 1"
                    (selectedTab)="onSelectTab($event)">
                    <div class="row mt-3">
                        <div class="col-lg-4 col-md-4 col-sm-4">
                            <div class="tf-wbg-portfolio-frame-container">
                                @if (ResponseFlag == false) {
                                <div class="loader-img">
                                    <lift-section-loader></lift-section-loader>
                                </div>
                                }
                                @if (ResponseFlag == true) {
                                <div class="tf-wbg-portfolio-title"><span>Portfolio Consolidation Progress </span>
                                    <!-- <i aria-hidden="true" title="" class="far fa-info-circle tf-header-title-info"></i> -->
                                    <ng-template [ngTemplateOutlet]="widgetInfotemp"></ng-template>
                                </div>
                                <div class="tf-wbg-portfolio-inner-frame-container mt-4">
                                    <div class="row-content">
                                        <div class="box-content">
                                            <div class="box-content-number"><a href="javascript:;"
                                                    [ngClass]="{'pointer-none':noOfActiveUmbrella <= 0}"
                                                    (click)="noOfActiveUmbrella !== 0 ? ondrillclick('TFUM3004', 'TFMVP%1a', 'No. of Umbrellas') : ''">{{noOfActiveUmbrella}}</a>
                                            </div>
                                            <div class="box-content-text mt-1">No. of Umbrellas</div>
                                        </div>
                                        <div class="box-content">
                                            <div class="box-content-number"><a href="javascript:;"
                                                    [ngClass]="{'pointer-none':noOfStandalone <= 0}"
                                                    (click)="noOfStandalone !== 0 ? ondrillclick('TFUM3007', 'TFMVP%3', 'No. of Standalone TFs') : ''">{{noOfStandalone}}</a>
                                            </div>
                                            <div class="box-content-text mt-1">No. of Standalone TFs</div>
                                        </div>
                                    </div>
                                    <div class="row-content">
                                        <div class="box-content1">
                                            <div class="box-content-number"><a href="javascript:;"
                                                    [ngClass]="{'pointer-none':noOfUmbrellaInPipeline <= 0}"
                                                    (click)="noOfUmbrellaInPipeline !== 0 ? ondrillclick('TFUM3005', 'TFMVP%2', 'No. of Umbrellas in Pipeline') : ''">{{noOfUmbrellaInPipeline}}</a>
                                            </div>
                                            <div class="box-content-text mt-1">No. of Umbrellas in Pipeline</div>
                                        </div>
                                        <div class="box-content1">
                                            <!-- <span> <i aria-hidden="true" title=""
                                                    class="far fa-info-circle tf-mvp-Info"></i></span> -->
                                            <span class="tf-mvp-Info"><ng-template
                                                    [ngTemplateOutlet]="reductionInfotemp"></ng-template></span>
                                            <div class="box-content-number">{{reductionRation}}%</div>
                                            <div class="box-content-text mt-1">Reduction in Standalone TFs</div>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-4">
                            <div class="tf-wbg-portfolio-frame-container">

                                @if (ResponseFlag == false) {

                                <div class="loader-img">
                                    <lift-section-loader></lift-section-loader>
                                </div>

                                }
                                @if (ResponseFlag == true) {

                                <div class="tf-wbg-portfolio-title"><span>Closing of Standalone TFs </span>
                                    <!-- <i aria-hidden="true" title="" class="far fa-info-circle tf-header-title-info"></i> -->
                                    <ng-template [ngTemplateOutlet]="widgetInfotemp2"></ng-template>
                                </div>
                                <div class="tf-wbg-portfolio-inner-frame-container mt-4">
                                    <div class="row-content">
                                        <div class="box-content">
                                            <div class="box-content-number"><a href="javascript:;"
                                                    [ngClass]="{'pointer-none':sixPlusMonStandalone <= 0}"
                                                    (click)="sixPlusMonStandalone !== 0 ? ondrillclick('TFUM3007', 'TFMVP%4', 'Past EDD > 6M') : ''">{{sixPlusMonStandalone}}</a>
                                            </div>
                                            <div class="box-content-text mt-1">Past EDDs 6+ Months</div>
                                        </div>
                                        <div class="box-content">
                                            <div class="box-content-number"><a href="javascript:;"
                                                    [ngClass]="{'pointer-none':LessThanSixMonStandalone <= 0}"
                                                    (click)="LessThanSixMonStandalone !== 0 ? ondrillclick('TFUM3007', 'TFMVP%5', 'Past EDD < 6M') : ''">{{LessThanSixMonStandalone}}</a>
                                            </div>
                                            <div class="box-content-text mt-1">Past EDDs less than 6 Months</div>
                                        </div>
                                    </div>
                                    <div class="row-content">
                                        <div class="box-content1">
                                            <div class="box-content-number"><a href="javascript:;"
                                                    [ngClass]="{'pointer-none':upcomingFYTD <= 0}"
                                                    (click)="upcomingFYTD !== 0 ? ondrillclick('TFUM3007', 'TFMVP%6', 'Upcoming FYTD') : ''">{{upcomingFYTD}}</a>
                                            </div>
                                            <div class="box-content-text mt-1">Upcoming EDDs by FY end</div>
                                        </div>
                                        <div class="empty-box-content1">
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-4">
                            <div class="tf-wbg-portfolio-frame-container">
                                <div #cartboxchartsection></div>
                                @if (ResponseFlag === false) {
                                <div class="loader-img" #cartboxchartsection>
                                    <lift-section-loader></lift-section-loader>
                                </div>
                                }
                                @if (ResponseFlag === true) {
                                <div>
                                    <div class="tf-wbg-portfolio-title"><span>Signed Contributions in last 12
                                            Months ($M) </span>
                                        <!-- <i aria-hidden="true" title=""
                                            class="far fa-info-circle tf-header-title-info"></i> -->
                                        <ng-template [ngTemplateOutlet]="widgetInfotemp3"></ng-template>
                                    </div>
                                    <div class="tf-wbg-portfolio-inner-frame-container">
                                        @if(distributionSingedContributionChart.length > 0){
                                        <div #cartboxchartsection>
                                            @for (chartData of distributionSingedContributionChart; track chartData) {
                                            <ng-container class="chart-section">
                                                <highcharts-chart [Highcharts]="chartData.Highcharts"
                                                    [options]="chartData.chartOptions"
                                                    [constructorType]="chartData.chartConstructor">
                                                </highcharts-chart>
                                            </ng-container>
                                            }
                                            <div class="ps-4">
                                                <ul class="listLegend">
                                                    @for (data of legendHtml; track data) {

                                                    <li><span class="dot"
                                                            [ngStyle]="{'background-color': data.color}"></span>
                                                        &nbsp;&nbsp;{{data.name}}
                                                    </li>
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        }
                                        @if(distributionSingedContributionChart.length === 0){
                                        <div class="no-data-center">
                                            <span>No Data Found</span>
                                        </div>
                                        }
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="tf-wbg-portfolio-container-full mt-4">
                            <app-wb-consolidation-progress-by-vpu></app-wb-consolidation-progress-by-vpu>
                        </div>
                        <div class="tf-wbg-portfolio-container-full mt-4">
                            <app-wb-closing-of-standalones-by-vpu></app-wb-closing-of-standalones-by-vpu>
                        </div>
                        <div class="page-break"></div>
                        <div class="tf-wbg-portfolio-container-full mt-4">
                            <app-wb-distribution-of-signed-contribution></app-wb-distribution-of-signed-contribution>
                        </div>
                    </div>
                </lift-tab>
                <lift-tab [title]="'BU PORTFOLIO'" id="BU Portfolio" [active]="this.srServicesService.tabselect === 2"
                    (selectedTab)="onSelectTab($event)">
                    <app-portfolio-consolidation-progress></app-portfolio-consolidation-progress>
                </lift-tab>
                <lift-tab [title]="'REPORTS'" id="Report" [active]="this.srServicesService.tabselect === 3"
                    (selectedTab)="onSelectTab($event)">
                    <app-reports-tab [reportModule]="'MVP'"></app-reports-tab>
                </lift-tab>
            </lift-tab-group>
        </div>
    </div>
</div>
<ng-template #widgetInfotemp>
    <lift-popover popoverTitle="Portfolio Consolidation Progress" popoverText="{{widgetHeaderInfo}}" [config]="config"
        style="display: inline-block;">
        <span><i aria-hidden="true" class="far fa-info-circle"></i></span>
    </lift-popover>
</ng-template>
<ng-template #reductionInfotemp>
    <lift-popover popoverTitle="Reduction in Standalone TFs" popoverText="{{reductionInfo}}" [config]="config"
        style="display: inline-block;">
        <span><i aria-hidden="true" class="far fa-info-circle"></i></span>
    </lift-popover>
</ng-template>
<ng-template #widgetInfotemp2>
    <lift-popover popoverTitle="Closing of Standalone TFs" popoverText="{{widgetHeaderInfo2}}" [config]="config"
        style="display: inline-block;">
        <span><i aria-hidden="true" class="far fa-info-circle"></i></span>
    </lift-popover>
</ng-template>
<ng-template #widgetInfotemp3>
    <lift-popover popoverTitle="Signed Contributions in last 12 Months ($M)" popoverText="{{widgetHeaderInfo3}}"
        [config]="config" style="display: inline-block;">
        <span><i aria-hidden="true" class="far fa-info-circle"></i></span>
    </lift-popover>
</ng-template>


