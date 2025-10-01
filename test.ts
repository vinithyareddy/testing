import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BudgetGlanceService } from 'services/budget-glance.service';
import { BudgetGlanceHighchartServices } from 'services/budgetglance-highchart.service';
import { RMService } from 'services/rm.service';
import Highcharts from 'highcharts';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-final-plans-budgetclass',
  templateUrl: './final-plans-budgetclass.component.html',
  styleUrls: ['./final-plans-budgetclass.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: '420px', visibility: '420px' })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class FinalPlansBudgetclassComponent implements OnDestroy {
  subscribeData: any;
  fullview = false;
  collapsed = false;
  TableData = [];
  selectedVal = 'ch';
  selectedTab = this.budgetservice.selectedTabBudget;
  ResponseFlag = false;
  details = [];
  details1 = [];
  TotalTabledata = [];
  FundGroupChart = [];
  legendHtml = [];
  xAxiscategories = [];
  public filterUnit = this.budgetservice.filterUnitlable;
  unitdecimalpoint = 1;
  private destroy = new Subject();
  public filterUnitCalc = this.budgetservice.filteredunitCalcMillion;

  // Add new properties for dynamic hierarchy
  FilterData: any;
  chartmeasure = 'Cost Object[Cost Object: Resp Fund Center: Department Acronym]';
  queryID = 'budgetglancewid052';
  tablecolumn = 'Dept';

  @ViewChild('cartboxchartsection') cartboxchartsection: ElementRef;

  constructor(private render: Renderer2, private highChartsService: BudgetGlanceHighchartServices, public rm_service: RMService,
    public Route: Router, private budgetservice: BudgetGlanceService) {

    // Add filter subscription for hierarchy detection
    if (this.subscribeData) { this.subscribeData.unsubscribe(); }
    this.subscribeData = this.budgetservice.filterData.pipe(
      takeUntil(this.destroy)
    ).subscribe((response: any) => {
      if (response.command === 'filterApply') {
        this.FilterData = response.Datas;
        this.oninitialdataload();
      }
    });

    this.subscribeData = this.budgetservice.DataApplymillionk.subscribe((response: any) => {
      if (response.command === 'apply') {
        if (response.status === 'million') {
          this.filterUnit = '$M';
          this.unitdecimalpoint = 1;
          this.filterUnitCalc = this.budgetservice.filteredunitCalcMillion;
        }
        if (response.status === 'thousand') {
          this.filterUnit = '$K';
          this.unitdecimalpoint = 0;
          this.filterUnitCalc = this.budgetservice.filteredunitCalcThousand;
        }
        this.getTable();
        this.getBarChart();
      }
    });
  }

  oninitialdataload() {
    if (this.filterUnit === '$M') {
      this.unitdecimalpoint = 1;
      this.filterUnitCalc = this.budgetservice.filteredunitCalcMillion;
    } else if (this.filterUnit === '$K') {
      this.unitdecimalpoint = 0;
      this.filterUnitCalc = this.budgetservice.filteredunitCalcThousand;
    }

    // Add hierarchy detection logic
    const IndexVPU = this.FilterData?.findIndex(x => 
      x.category === 'Cost Obj Responsible VPU' || 
      x.category === 'Cost Obj Requesting VPU'
    ) ?? -1;

    const IndexDeptGroup = this.FilterData?.findIndex(x => 
      x.category === 'Cost Obj Responsible Department Group' || 
      x.category === 'Cost Obj Requesting Department Group'
    ) ?? -1;

    const IndexDept = this.FilterData?.findIndex(x => 
      x.category === 'Cost Obj Responsible Department' || 
      x.category === 'Cost Obj Requesting Department'
    ) ?? -1;

    const IndexDivision = this.FilterData?.findIndex(x => 
      x.category === 'Cost Obj Responsible Division' || 
      x.category === 'Cost Obj Requesting Division'
    ) ?? -1;

    const IndexUnit = this.FilterData?.findIndex(x => 
      x.category === 'Cost Obj Responsible Unit' || 
      x.category === 'Cost Obj Requesting Unit'
    ) ?? -1;

    // Determine which level to display based on filter selection
    if (IndexVPU > -1) {
      // VPU selected → Show Dept Group
      this.chartmeasure = 'Cost Object[Cost Object: Resp Fund Center: Department Group Acronym]';
      this.queryID = 'budgetglancewid052b';
      this.tablecolumn = 'Dept Grp';
    } else if (IndexDeptGroup > -1) {
      // Dept Group selected → Show Dept
      this.chartmeasure = 'Cost Object[Cost Object: Resp Fund Center: Department Acronym]';
      this.queryID = 'budgetglancewid052';
      this.tablecolumn = 'Dept';
    } else if (IndexDept > -1) {
      // Dept selected → Show Unit
      this.chartmeasure = 'Cost Object[Cost Object Responsible Funds Center Acronym]';
      this.queryID = 'budgetglancewid052a';
      this.tablecolumn = 'Unit';
    } else if (IndexDivision > -1) {
      // Division selected → Show Unit
      this.chartmeasure = 'Cost Object[Cost Object Responsible Funds Center Acronym]';
      this.queryID = 'budgetglancewid052a';
      this.tablecolumn = 'Unit';
    } else {
      // Default: Show Dept
      this.chartmeasure = 'Cost Object[Cost Object: Resp Fund Center: Department Acronym]';
      this.queryID = 'budgetglancewid052';
      this.tablecolumn = 'Dept';
    }

    this.ResponseFlag = false;
    this.subscribeData = this.budgetservice.getapiwidgetdataload('budgetglancewid054').subscribe(data => {
      this.details = data.results[0].tables[0].rows;
      this.FundGroupChart = [];
      this.getBarChart();
      this.ResponseFlag = true;
    });

    this.ResponseFlag = false;
    this.subscribeData = this.budgetservice.getapiwidgetdataload(this.queryID).subscribe(data1 => {
      this.details1 = data1.results[0].tables[0].rows;
      this.TableData = [];
      this.TotalTabledata = [];
      this.ResponseFlag = true;
      this.getTable();
    });
  }

  getTable() {
    this.TableData = [];
    this.TotalTabledata = [];
    const xAxisCategory = [];
    const unitarr = [];

    if (this.selectedTab === 'all') {
      this.details1.forEach(ele => {
        if (xAxisCategory.indexOf(ele['Cost Object[Cost Object Budget Class]']) === -1 && ele['Cost Object[Cost Object Budget Class]'] !== null) {
          xAxisCategory.push(ele['Cost Object[Cost Object Budget Class]']);
        }
        if (unitarr.indexOf(ele[this.chartmeasure]) === -1) {
          unitarr.push(ele[this.chartmeasure]);
        }
      });

      let TotalActual = 0, TotalFinal = 0, TotalBurnrate = 0;
      xAxisCategory.forEach(x => {
        let Tactual = 0, Tfinal = 0, Tburnrate = 0;
        unitarr.forEach(u => {
          let actual = 0, final = 0, burnrate = 0; let dept = '', unit = '';
          this.details1.forEach(ele => {
            if (ele['Cost Object[Cost Object Budget Class]'] === x && ele[this.chartmeasure] === u) {
              if (ele['Cost Object[Cost Object Budget Class]'] !== null && ele[this.chartmeasure] !== null) {
                dept = ele['Cost Object[Cost Object Budget Class]'];
                unit = (ele[this.chartmeasure] === null) ? '' : ele[this.chartmeasure];
                actual += ((ele['[WPA Cost]'] === null) ? 0 : (ele['[WPA Cost]']));
                final += ((ele['[WPA Plans, Final]'] === null) ? 0 : (ele['[WPA Plans, Final]']));
              }
            }
          });

          burnrate = (final !== 0) ? Math.round((actual / final) * 100) : 0;
          const reponse = this.TableData.find(z => z.department === dept && z.unit === unit);
          if (reponse === null || reponse === '' || reponse === undefined) {
            Tactual += actual;
            Tfinal += final;
            this.TableData.push({
              department: dept, unit: unit,
              actuals: (actual !== 0) ? this.budgetservice.decimalpointconversion(actual / this.filterUnitCalc, this.unitdecimalpoint) : '',
              finals: (final !== 0) ? this.budgetservice.decimalpointconversion(final / this.filterUnitCalc, this.unitdecimalpoint) : '',
              burnrate: burnrate
            });
          }
        });

        Tburnrate = (Tfinal !== 0) ? Math.round((Tactual / Tfinal) * 100) : 0;
        this.TableData.push({
          department: x + ' Total', unit: '',
          actuals: this.budgetservice.decimalpointconversion(Tactual / this.filterUnitCalc, this.unitdecimalpoint),
          finals: this.budgetservice.decimalpointconversion(Tfinal / this.filterUnitCalc, this.unitdecimalpoint),
          burnrate: Tburnrate
        });

        TotalActual += Tactual;
        TotalFinal += Tfinal;
      });

      xAxisCategory.forEach(ele => {
        const newDept = this.TableData.filter(x => x.department === ele);
        if (newDept.length === 1) {
          this.TableData = this.TableData.filter(y => y.department !== (ele + ' Total'))
        }
      });

      TotalBurnrate = (TotalFinal !== 0) ? Math.round((TotalActual / TotalFinal) * 100) : 0;
      this.TotalTabledata = [{
        department: 'Grand Total',
        unit: '',
        actuals: this.budgetservice.decimalpointconversion(TotalActual / this.filterUnitCalc, this.unitdecimalpoint),
        finals: this.budgetservice.decimalpointconversion(TotalFinal / this.filterUnitCalc, this.unitdecimalpoint),
        burnrate: TotalBurnrate
      }];

    } else if (this.selectedTab !== 'all') {
      this.details1.forEach(ele => {
        if (ele['Fund & Fund Group[Level 2 Fund (Group) Name]'] === this.selectedTab) {
          if (xAxisCategory.indexOf(ele['Cost Object[Cost Object Budget Class]']) === -1 && ele['Cost Object[Cost Object Budget Class]'] !== null) {
            xAxisCategory.push(ele['Cost Object[Cost Object Budget Class]']);
          }
        }
      });

      let TotalActual = 0, TotalFinal = 0, TotalBurnrate = 0;
      xAxisCategory.forEach(x => {
        let Tactual = 0, Tfinal = 0, Tburnrate = 0;
        this.details1.forEach(ele => {
          let dept = '', unit = '', actual = 0, final = 0, burnrate = 0;
          if (ele['Cost Object[Cost Object Budget Class]'] === x && ele['Fund & Fund Group[Level 2 Fund (Group) Name]'] === this.selectedTab) {
            if (ele['Cost Object[Cost Object Budget Class]'] !== null && ele[this.chartmeasure] !== null) {
              dept = ele['Cost Object[Cost Object Budget Class]'];
              unit = (ele[this.chartmeasure] === null) ? '' : ele[this.chartmeasure];
              actual = ((ele['[WPA Cost]'] === null) ? 0 : (ele['[WPA Cost]']));
              final = ((ele['[WPA Plans, Final]'] === null) ? 0 : (ele['[WPA Plans, Final]']));
              burnrate = (final === 0) ? 0 : Math.round((actual / final) * 100);

              Tactual += actual;
              Tfinal += final;

              this.TableData.push({
                department: dept, unit: unit,
                actuals: (actual !== 0) ? this.budgetservice.decimalpointconversion(actual / this.filterUnitCalc, this.unitdecimalpoint) : '',
                finals: (final !== 0) ? this.budgetservice.decimalpointconversion(final / this.filterUnitCalc, this.unitdecimalpoint) : '',
                burnrate: burnrate
              });
            }
          }
        });

        Tburnrate = (Tfinal !== 0) ? Math.round((Tactual / Tfinal) * 100) : 0;
        this.TableData.push({
          department: x + ' Total', unit: '',
          actuals: this.budgetservice.decimalpointconversion(Tactual / this.filterUnitCalc, this.unitdecimalpoint),
          finals: this.budgetservice.decimalpointconversion(Tfinal / this.filterUnitCalc, this.unitdecimalpoint),
          burnrate: Tburnrate
        });

        TotalActual += Tactual;
        TotalFinal += Tfinal;
      });

      xAxisCategory.forEach(ele => {
        const newDept = this.TableData.filter(x => x.department === ele);
        if (newDept.length === 1) {
          this.TableData = this.TableData.filter(y => y.department !== (ele + ' Total'))
        }
      });

      TotalBurnrate = (TotalFinal !== 0) ? Math.round((TotalActual / TotalFinal) * 100) : 0;
      this.TotalTabledata = [{
        department: 'Grand Total',
        unit: '',
        actuals: this.budgetservice.decimalpointconversion(TotalActual / this.filterUnitCalc, this.unitdecimalpoint),
        finals: this.budgetservice.decimalpointconversion(TotalFinal / this.filterUnitCalc, this.unitdecimalpoint),
        burnrate: TotalBurnrate
      }];
    }
  }

  getBarChart() {
    const WpaActuals = [];
    const WpaPlanFinals = [];
    const Burnrate = [];
    this.xAxiscategories = [];
    this.legendHtml = [];

    if (this.selectedTab === 'all') {
      this.details.forEach(element => {
        if (this.xAxiscategories.indexOf(element['Cost Object[Cost Object Budget Class]']) === -1 && element['Cost Object[Cost Object Budget Class]'] !== null) {
          this.xAxiscategories.push(element['Cost Object[Cost Object Budget Class]']);
        }
      });

      this.xAxiscategories.forEach(x => {
        let burnrate = 0; let actual = 0; let final = 0;
        this.details.forEach(element => {
          if (element['Cost Object[Cost Object Budget Class]'] !== null && element['Cost Object[Cost Object Budget Class]'] === x &&
            ((element['[WPA Plans, Final]'] !== 0 && element['[WPA Plans, Final]'] !== null) || (element['[WPA Cost]'] !== 0 && element['[WPA Cost]'] !== null))) {
            actual += (element['[WPA Cost]'] === null) ? 0 : element['[WPA Cost]'];
            final += (element['[WPA Plans, Final]'] === null) ? 0 : (element['[WPA Plans, Final]']);
          }
        });

        burnrate = (final !== 0) ? Math.round((actual / final) * 100) : 0;
        WpaActuals.push(this.budgetservice.decimalpointconversion(actual / this.filterUnitCalc, this.unitdecimalpoint));
        WpaPlanFinals.push(this.budgetservice.decimalpointconversion(final / this.filterUnitCalc, this.unitdecimalpoint));
        Burnrate.push(burnrate);
      });

    } else if (this.selectedTab !== 'all') {
      this.details.forEach(element => {
        if (element['Fund & Fund Group[Level 2 Fund (Group) Name]'] === this.selectedTab) {
          if (this.xAxiscategories.indexOf(element['Cost Object[Cost Object Budget Class]']) === -1 && element['Cost Object[Cost Object Budget Class]'] !== null &&
            ((element['[WPA Plans, Final]'] !== 0 && element['[WPA Plans, Final]'] !== null) || (element['[WPA Cost]'] !== 0 && element['[WPA Cost]'] !== null))) {
            let burnrate = 0; let actual = 0; let final = 0;
            actual += (element['[WPA Cost]'] === null) ? 0 : element['[WPA Cost]'];
            final += (element['[WPA Plans, Final]'] === null) ? 0 : (element['[WPA Plans, Final]']);
            burnrate = (final === 0) ? 0 : (Math.round((actual / final) * 100));

            this.xAxiscategories.push(element['Cost Object[Cost Object Budget Class]']);
            WpaActuals.push(this.budgetservice.decimalpointconversion(actual / this.filterUnitCalc, this.unitdecimalpoint));
            WpaPlanFinals.push(this.budgetservice.decimalpointconversion(final / this.filterUnitCalc, this.unitdecimalpoint));
            Burnrate.push(burnrate);
          }
        }
      });
    }

    const ChartData = [{
      type: 'column',
      name: 'Final Plans',
      color: '#09A2DB',
      pointWidth: 25,
      borderRadius: 3,
      data: WpaPlanFinals,
      dataLabels: (this.filterUnit === '$K') ? {
        enabled: true,
        formatter: function (this: Highcharts.Point) {
          return Highcharts.numberFormat(this.y, 0, '.', ',') + 'K';
        }
      } : {
        enabled: true,
        formatter: function (this: Highcharts.Point) {
          return Highcharts.numberFormat(this.y, 1, '.', ',') + 'M';
        }
      },
      tooltip: (this.filterUnit === '$K') ? {
        pointFormat: '{series.name}: <b>{point.y:,.0f}K</b>'
      } : { pointFormat: '{series.name}: <b>{point.y:,.1f}M</b>' }
    }, {
      type: 'column',
      name: 'Actuals',
      color: '#66C4CA',
      pointWidth: 25,
      borderRadius: 3,
      data: WpaActuals,
      dataLabels: (this.filterUnit === '$K') ? {
        enabled: true,
        formatter: function (this: Highcharts.Point) {
          return Highcharts.numberFormat(this.y, 0, '.', ',') + 'K';
        }
      } : {
        enabled: true,
        formatter: function (this: Highcharts.Point) {
          return Highcharts.numberFormat(this.y, 1, '.', ',') + 'M';
        }
      },
      tooltip: (this.filterUnit === '$K') ? {
        pointFormat: '{series.name}: <b>{point.y:,.0f}K</b>'
      } : { pointFormat: '{series.name}: <b>{point.y:,.1f}M</b>' }
    }, {
      type: 'line',
      name: 'Burn Rate',
      color: '#F9A453',
      borderRadius: 3,
      data: Burnrate,
      yAxis: 1,
      marker: {
        lineWidth: 2,
        lineColor: '#F9A453',
        fillColor: 'white'
      },
      dataLabels: {
        enabled: true,
        allowOverlap: true,
        crop: false,
        overflow: 'none',
        formatter: function (this: Highcharts.Point) {
          return Highcharts.numberFormat(this.y, 0, '.', ',') + '%';
        }
      },
      tooltip: { pointFormat: '{series.name}: <b>{point.y:,.0f}%</b>' }
    }];

    this.legendHtml = ChartData;
    const legendVisible = false;
    const xAxisCategory = this.xAxiscategories;
    const chartHeight = this.fullview === true ? 620 : 330;
    const chartWidth = this.cartboxchartsection.nativeElement.offsetWidth - 30;
    const chartTitle = 'Final Plans Budget Class';
    const xAxisVisible = true;
    const yAxisVisible = true;
    const yAxisTitle = (this.filterUnit === '$K') ? 'Amount (in thousands)' : 'Amount (in Millions)';

    this.FundGroupChart = [];
    let ChartOptions = {};
    ChartOptions = {
      chartTitle: chartTitle,
      chartWidth: chartWidth,
      chartHeight: chartHeight,
      xAxisCategory: xAxisCategory,
      yAxisTitle: yAxisTitle,
      yAxisTitle2: 'Burn Rate (%)',
      legendVisible: legendVisible,
      dataseries: ChartData,
      widgetID: 'rmwid013',
      xAxisVisible: xAxisVisible,
      yAxisVisible: yAxisVisible,
      dataLabelEnable: true
    };

    this.FundGroupChart = this.highChartsService.GetColumnLineChart(ChartOptions);
  }

  onTabChanged(event) {
    this.selectedVal = event.value;
  }

  onselectTabChanged(event) {
    this.selectedTab = event.value;
    this.budgetservice.selectedTabBudget = this.selectedTab;
    this.getTable();
    this.getBarChart();
  }

  expand() {
    this.collapsed = false;
  }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview === true) {
      this.render.addClass(document.body, 'no-scroll');
      setTimeout(() => {
        this.getBarChart();
      }, 0);
    } else {
      this.render.removeClass(document.body, 'no-scroll');
      setTimeout(() => {
        this.getBarChart();
      }, 0);
    }
  }

  collapse() {
    this.collapsed = true;
  }

  getDrilldown() {
    this.budgetservice.getDrillReportData('budgetglancewid054', '');
  }

  ngOnDestroy() {
    this.destroy.next('');
    if (this.subscribeData) {
      this.subscribeData.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.getBarChart();
  }