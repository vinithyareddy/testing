ts:
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { BudgetGlanceService } from 'services/budget-glance.service';

import { BudgetGlanceHighchartServices } from 'services/budgetglance-highchart.service';

import * as Highcharts from 'highcharts';


 

@Component({

  selector: 'app-trs-top-header-widgets',

  templateUrl: './trs-top-header-widgets.component.html',

  styleUrls: ['./trs-top-header-widgets.component.scss']

})

export class TrsTopHeaderWidgetsComponent implements OnInit, OnDestroy {


 

  ResponseFlagMissing = false;

  ResponseFlagTime = false;

  ResponseFlagError = false;

  ResponseFlagBurnrate = false;

  subscribeData: any;

  details = [];

  details1 = [];

  details2 = [];

  details3 = [];

  closedMonth = 0;

  closingMonth = 0;

  openedMonth = 0;

  closedHrPer = 0;

  closingHrPer = 0;

  openHrPer = 0;


 

  trclosedMonth = 0;

  trclosingMonth = 0;

  tropenedMonth = 0;

  trclosedHrPer = 0;

  trclosingHrPer = 0;

  tropenHrPer = 0;


 

  Highcharts: typeof Highcharts = Highcharts;

  compliancePieChartOptions: Highcharts.Options;


 

  BBClosed = 0;

  TFClosed = 0;

  REIMBClosed = 0;


 

  BBClosing = 0;

  TFClosing = 0;

  REIMBClosing = 0;


 

  BBOpened = 0;

  REIMBOpened = 0;

  TFOpened = 0;

  private destroy = new Subject();

  //public filterUnit = 'K';

  // public filterUnitCalc = this.budget_Service.filteredunitCalcThousand;;

  fy: any;

  unitdecimalpoint = 1;

  @ViewChild('cartboxchartsection') cartboxchartsection: ElementRef;

  constructor(private highChartsService: BudgetGlanceHighchartServices, public budget_Service: BudgetGlanceService,

    public Route: Router) {

    if (this.subscribeData) { this.subscribeData.unsubscribe(); }

    this.subscribeData = this.budget_Service.filterData.pipe(

      takeUntil(this.destroy)).subscribe((response: any) => {

        if (response.command === 'filterApply') {

          this.fy = response.Datas.find(y => y.category === 'Fiscal Year');

          this.budget_Service.rmselectedcurrfy = this.fy.value;

          // tslint:disable-next-line:radix

          this.budget_Service.rmselectedprevfy = (parseInt(this.fy.value) - 1).toString();

          this.oninitialdataload();

        }

      });

  }

  ngOnInit(): void {

  }

  resetValues() {

    this.details = [];

    this.details1 = [];

    this.details2 = [];

    this.closedMonth = 0;

    this.closingMonth = 0;

    this.openedMonth = 0;

    this.trclosedMonth = 0;

    this.trclosingMonth = 0;

    this.tropenedMonth = 0;

    this.trclosedHrPer = 0;

    this.trclosingHrPer = 0;

    this.tropenHrPer = 0;


 

    this.BBClosed = 0;

    this.TFClosed = 0;

    this.REIMBClosed = 0;


 

    this.BBClosing = 0;

    this.TFClosing = 0;

    this.REIMBClosing = 0;


 

    this.BBOpened = 0;

    this.REIMBOpened = 0;

    this.TFOpened = 0;

  }

  oninitialdataload() {

    this.resetValues();

    this.ResponseFlagMissing = false;

    // missing time

    this.subscribeData = this.budget_Service.getapiwidgetdataload('budgetglancewid067').subscribe(data => {

      this.details = data.results[0].tables[0].rows;

      this.details.forEach(x => {

        if (x['RM Data[TRS Month Flag]'] !== null) {

          if (x['RM Data[TRS Month Flag]'] === 'Closed Months') {

            this.closedMonth = (x['[Missing Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[Missing Time, Hours]'], this.unitdecimalpoint) : 0;

            this.closedHrPer = (x['[Adjusted Required, Hours]'] !== null) ? Math.round((x['[Missing Time, Hours]'] / x['[Adjusted Required, Hours]']) * 100) : 0;

          }

          if (x['RM Data[TRS Month Flag]'] === 'Closing Months') {

            this.closingMonth = (x['[Missing Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[Missing Time, Hours]'], this.unitdecimalpoint) : 0;

            this.closingHrPer = (x['[Adjusted Required, Hours]'] !== null) ? Math.round((x['[Missing Time, Hours]'] / x['[Adjusted Required, Hours]']) * 100) : 0;

          }

          if (x['RM Data[TRS Month Flag]'] === 'Open Months') {

            this.openedMonth = (x['[Missing Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[Missing Time, Hours]'], this.unitdecimalpoint) : 0;

            this.openHrPer = (x['[Adjusted Required, Hours]'] !== null) ? Math.round((x['[Missing Time, Hours]'] / x['[Adjusted Required, Hours]']) * 100) : 0;

          }


 

        }

      });

      this.ResponseFlagMissing = true;

    });

    // time entered

    this.ResponseFlagError = false;

    this.subscribeData = this.budget_Service.getapiwidgetdataload('budgetglancewid069').subscribe(data1 => {

      this.details1 = data1.results[0].tables[0].rows;


 

      this.details1.forEach(x => {

        if (x['RM Data[TRS Month Flag]'] !== null) {

          if (x['RM Data[TRS Month Flag]'] === 'Closed Months') {

            this.trclosedMonth = (x['[Entered Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[Entered Time, Hours]'], this.unitdecimalpoint) : 0;

            this.trclosedHrPer = (x['[Adjusted Required, Hours]'] !== null) ? Math.round((x['[Entered Time, Hours]'] / x['[Adjusted Required, Hours]']) * 100) : 0;

          }

          if (x['RM Data[TRS Month Flag]'] === 'Closing Months') {

            this.trclosingMonth = (x['[Entered Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[Entered Time, Hours]'], this.unitdecimalpoint) : 0;

            this.trclosingHrPer = (x['[Adjusted Required, Hours]'] !== null) ? Math.round((x['[Entered Time, Hours]'] / x['[Adjusted Required, Hours]']) * 100) : 0;

          }

          if (x['RM Data[TRS Month Flag]'] === 'Open Months') {

            this.tropenedMonth = (x['[Entered Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[Entered Time, Hours]'], this.unitdecimalpoint) : 0;

            this.tropenHrPer = (x['[Adjusted Required, Hours]'] !== null) ? Math.round((x['[Entered Time, Hours]'] / x['[Adjusted Required, Hours]']) * 100) : 0;

          }


 

        }

      });

      this.ResponseFlagError = true;

      const chartMissingPercent = Math.min(this.closedHrPer, 100);


 

      this.compliancePieChartOptions = {

        chart: {

          type: 'pie',

          backgroundColor: 'transparent',

          height: 100,

          width: 100

        },

        title: { text: undefined },

        tooltip: { enabled: false },

        plotOptions: {

          pie: {

            innerSize: '75%',

            dataLabels: { enabled: false },

            colors: ['#36A2EB', '#E0E0E0'] // Blue: missing, Grey: remainder

          }

        },

        series: [{

          type: 'pie',

          data: [

            { name: 'Missing Time', y: chartMissingPercent },

            { name: 'Other', y: 100 - chartMissingPercent }

          ]

        }]

      };

    });

    // time in error

    this.ResponseFlagTime = false;

    this.subscribeData = this.budget_Service.getapiwidgetdataload('budgetglancewid068').subscribe(data2 => {

      this.details2 = data2.results[0].tables[0].rows;

      this.details2.forEach(x => {

        if (x['RM Data[TRS Month Flag]'] !== null && x['Fund & Fund Group[Level 2 Fund (Group) Name]'] !== null) {

          if (x['Fund & Fund Group[Level 2 Fund (Group) Name]'] === 'BB') {

            if (x['RM Data[TRS Month Flag]'] === 'Closed Months') {

              this.BBClosed = (x['[In-Error Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[In-Error Time, Hours]'], this.unitdecimalpoint) : 0;

            }

            if (x['RM Data[TRS Month Flag]'] === 'Closing Months') {

              this.BBClosing = (x['[In-Error Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[In-Error Time, Hours]'], this.unitdecimalpoint) : 0;

            }

            if (x['RM Data[TRS Month Flag]'] === 'Open Months') {

              this.BBOpened = (x['[In-Error Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[In-Error Time, Hours]'], this.unitdecimalpoint) : 0;

            }

          }

          if (x['Fund & Fund Group[Level 2 Fund (Group) Name]'] === 'TF') {

            if (x['RM Data[TRS Month Flag]'] === 'Closed Months') {

              this.TFClosed = (x['[In-Error Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[In-Error Time, Hours]'], this.unitdecimalpoint) : 0;

            }

            if (x['RM Data[TRS Month Flag]'] === 'Closing Months') {

              this.TFClosing = (x['[In-Error Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[In-Error Time, Hours]'], this.unitdecimalpoint) : 0;

            }

            if (x['RM Data[TRS Month Flag]'] === 'Open Months') {

              this.TFOpened = (x['[In-Error Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[In-Error Time, Hours]'], this.unitdecimalpoint) : 0;

            }

          }

          if (x['Fund & Fund Group[Level 2 Fund (Group) Name]'] === 'REIMB') {

            if (x['RM Data[TRS Month Flag]'] === 'Closed Months') {

              this.REIMBClosed = (x['[In-Error Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[In-Error Time, Hours]'], this.unitdecimalpoint) : 0;

            }

            if (x['RM Data[TRS Month Flag]'] === 'Closing Months') {

              this.REIMBClosing = (x['[In-Error Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[In-Error Time, Hours]'], this.unitdecimalpoint) : 0;

            }

            if (x['RM Data[TRS Month Flag]'] === 'Open Months') {

              this.REIMBOpened = (x['[In-Error Time, Hours]'] !== null) ? this.budget_Service.decimalpointconversion(x['[In-Error Time, Hours]'], this.unitdecimalpoint) : 0;

            }

          }


 

        }

      });

      this.ResponseFlagTime = true;

    });

  }

  ngOnDestroy() {

    this.destroy.next('');

    if (this.subscribeData) {

      this.subscribeData.unsubscribe();

    }

  }

}