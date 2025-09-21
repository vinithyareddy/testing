import { AfterViewInit, Component, computed, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SwfpByManagerFlagGradeService } from '../../services/swfp-by-manager-flag-grade.service';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LiftButtonComponent, LiftButtonGroupComponent, LiftButtonSwitchComponent } from '@lift/formcontrols';
import { LiftSectionLoaderComponent } from '@lift/loaders';
import { LiftPopoverComponent } from '@lift/ui';
import { HighchartsChartModule } from 'highcharts-angular';

type Item = { category: string; unit: number };
type Group = { name: string; items: Item[]; expanded?: boolean };
const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-swfp-by-manager-flag-grade',
  templateUrl: './swfp-by-manager-flag-grade.component.html',
  standalone:true,
        imports:[
    CommonModule,
    FormsModule,
    HttpClientModule,
    LiftSectionLoaderComponent,
    HighchartsChartModule,
    LiftPopoverComponent
],
  styleUrl: './swfp-by-manager-flag-grade.component.scss',

  animations: [
    trigger('collapse', [
      state('false', style({ height: '550px', visibility: 'visible' })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})

export class SwfpByManagerFlagGradeComponent implements OnInit, AfterViewInit, OnDestroy {
  fullview = false;
  widgetType: string = 'ch';
  responseFlag: boolean = false;
  swfpColumnChart: any = [];
  swfpPieChartByGH: any = [];
  swfpPieChartByGI: any = [];
  
  // Navigation properties
  currentDataIndex: number = 0;
  
  // Sample data sets - you can replace this with your actual data
  allDataSets = [
    {
      name: 'Q1 Data',
      tableData: [
        { grp: 'GH', items: [{ cateory: 'Managerial', Unit: '5' }, { cateory: 'Technical', Unit: '110' }] },
        { grp: 'GI', items: [{ cateory: 'Managerial', Unit: '10' }, { cateory: 'Technical', Unit: '200' }] }
      ],
      columnData: {
        xAxisCategory: ['GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH'],
        chartData: [
          {
            name: 'Managerial',
            data: [10, 20, 40, 50, 60, 70, 30, 80],
            color: '#71cecd',
          },
          {
            name: 'Technical',
            data: [20, 10, 50, 40, 70, 60, 50, 90],
            color: '#6b70af',
          }
        ]
      },
      pieDataGH: [
        { name: 'Managerial', color: '#71cecd', y: 5 },
        { name: 'Technical', color: '#6b70af', y: 110 }
      ],
      pieDataGI: [
        { name: 'Managerial', color: '#71cecd', y: 10 },
        { name: 'Technical', color: '#6b70af', y: 200 }
      ]
    },
    {
      name: 'Q2 Data',
      tableData: [
        { grp: 'GH', items: [{ cateory: 'Managerial', Unit: '8' }, { cateory: 'Technical', Unit: '120' }] },
        { grp: 'GI', items: [{ cateory: 'Managerial', Unit: '15' }, { cateory: 'Technical', Unit: '180' }] }
      ],
      columnData: {
        xAxisCategory: ['GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH'],
        chartData: [
          {
            name: 'Managerial',
            data: [15, 25, 35, 45, 55, 65, 35, 75],
            color: '#71cecd',
          },
          {
            name: 'Technical',
            data: [25, 15, 45, 35, 65, 55, 45, 85],
            color: '#6b70af',
          }
        ]
      },
      pieDataGH: [
        { name: 'Managerial', color: '#71cecd', y: 8 },
        { name: 'Technical', color: '#6b70af', y: 120 }
      ],
      pieDataGI: [
        { name: 'Managerial', color: '#71cecd', y: 15 },
        { name: 'Technical', color: '#6b70af', y: 180 }
      ]
    },
    {
      name: 'Q3 Data',
      tableData: [
        { grp: 'GH', items: [{ cateory: 'Managerial', Unit: '12' }, { cateory: 'Technical', Unit: '95' }] },
        { grp: 'GI', items: [{ cateory: 'Managerial', Unit: '20' }, { cateory: 'Technical', Unit: '160' }] }
      ],
      columnData: {
        xAxisCategory: ['GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH'],
        chartData: [
          {
            name: 'Managerial',
            data: [12, 22, 32, 42, 52, 62, 32, 72],
            color: '#71cecd',
          },
          {
            name: 'Technical',
            data: [22, 12, 42, 32, 62, 52, 42, 82],
            color: '#6b70af',
          }
        ]
      },
      pieDataGH: [
        { name: 'Managerial', color: '#71cecd', y: 12 },
        { name: 'Technical', color: '#6b70af', y: 95 }
      ],
      pieDataGI: [
        { name: 'Managerial', color: '#71cecd', y: 20 },
        { name: 'Technical', color: '#6b70af', y: 160 }
      ]
    }
  ];
  
  // Current dataset
  get currentDataSet() {
    return this.allDataSets[this.currentDataIndex];
  }
  
  // Get current table data
  get tableData() {
    return this.currentDataSet.tableData;
  }
  
  legends: any = [{ name: 'Managerial', color: '#71cecd' }, { name: 'Technical', color: '#6b70af' }];
  @ViewChild('cartboxchartsection') cartboxchartsection: ElementRef;
  groups = signal<Group[]>([]);
  
  // Optional grand totals
  grandTotal = computed(() =>
    this.groups().reduce((sum, g) => sum + this.groupTotal(g), 0)
  );
  
  constructor(private service: SwfpByManagerFlagGradeService, private render: Renderer2) {
    this.mapTable();
  }

  groupTotal = (g: Group) => g.items.reduce((s, x) => s + (Number.isFinite(x.unit) ? x.unit : 0), 0);

  mapTable() {
    const normalized: Group[] = this.tableData.map((g: any) => {
      const name = g.grp ?? g.name ?? 'Unknown';
      const items: Item[] = (Array.isArray(g.items) ? g.items : [g.items])
        .filter(Boolean)
        .map((it: any) => ({
          // cope with the typo "cateory" and casing
          category: it.category ?? it.cateory ?? it.Category ?? '',
          unit: Number(it.unit ?? it.Unit ?? 0)
        }));
      return { name, items, expanded: true };
    });
    this.groups.set(normalized);
  }

  toggle(g: Group) {
    g.expanded = !g.expanded;
    // trigger change by re-setting the array reference (signals handle it, but ensure immutability if needed)
    this.groups.set([...this.groups()]);
  }

  // Helper for percentage inside a group
  pct(part: number, total: number) {
    if (!total) return 0;
    return (part / total) * 100;
  }

  trackGroup = (_: number, g: Group) => g.name;
  trackItem = (_: number, it: Item) => it.category + ':' + it.unit;
  
  // Navigation methods for the arrow buttons
  navigateLeft() {
    if (this.currentDataIndex > 0) {
      this.currentDataIndex--;
      this.loadCurrentDataSet();
      console.log('Navigated to:', this.currentDataSet.name);
    }
  }
  
  navigateRight() {
    if (this.currentDataIndex < this.allDataSets.length - 1) {
      this.currentDataIndex++;
      this.loadCurrentDataSet();
      console.log('Navigated to:', this.currentDataSet.name);
    }
  }
  
  // Check if navigation buttons should be disabled
  get canNavigateLeft(): boolean {
    return this.currentDataIndex > 0;
  }
  
  get canNavigateRight(): boolean {
    return this.currentDataIndex < this.allDataSets.length - 1;
  }
  
  // Load data for current dataset
  loadCurrentDataSet() {
    this.mapTable(); // Update table data
    this.onInitLoad(); // Reload charts
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.onInitLoad();
    }, 200);
  }
  
  ngOnInit(): void {
  }
  
  loadWidget(chartType: any) {
    this.widgetType = chartType;
    this.onInitLoad();
  }

  onLoadPieChartByGH() {
    const currentData = this.currentDataSet;
    const chartdata = [{
      name: 'BY GH Grade',
      colorByPoint: true,
      innerSize: '85%',
      data: currentData.pieDataGH
    }];
    
    const chartWidth = 400;
    const chartHeight = 330;
    let ChartOptions = {};
    const chartTitle = 'BY GH Grade';
    const centerVal = currentData.pieDataGH.reduce((sum, item) => sum + item.y, 0);
    const centerTxt = 'BY GH Grade';
    const datalabelsEnabled = true;
    const legendVisible = false;
    
    ChartOptions = {
      chartTitle: chartTitle,
      centerVal: centerVal,
      centerTxt: centerTxt,
      chartWidth: chartWidth,
      chartHight: chartHeight,
      legendVisible: legendVisible,
      dataseries: chartdata,
      xAxisVisible: true,
      yAxisVisible: false,
      dataLabelEnable: datalabelsEnabled
    };
    this.swfpPieChartByGH = this.service.getPieChart(ChartOptions);
  }

  onLoadPieChartByGI() {
    const currentData = this.currentDataSet;
    const chartdata = [{
      name: 'BY GI Grade',
      colorByPoint: true,
      innerSize: '85%',
      data: currentData.pieDataGI
    }];

    const chartWidth = 400;
    const chartHeight = 330;
    let ChartOptions = {};
    const chartTitle = 'BY GI Grade';
    const centerVal = currentData.pieDataGI.reduce((sum, item) => sum + item.y, 0);
    const centerTxt = 'BY GI Grade';
    const datalabelsEnabled = true;
    const legendVisible = false;
    
    ChartOptions = {
      chartTitle: chartTitle,
      centerVal: centerVal,
      centerTxt: centerTxt,
      chartWidth: chartWidth,
      chartHight: chartHeight,
      legendVisible: legendVisible,
      dataseries: chartdata,
      xAxisVisible: true,
      yAxisVisible: false,
      dataLabelEnable: datalabelsEnabled
    };
    this.swfpPieChartByGI = this.service.getPieChart(ChartOptions);
  }
  
  onLoadColumnChart() {
    const currentData = this.currentDataSet;
    let ChartOptions = {};
    
    ChartOptions = {
      chartWidth: this.cartboxchartsection.nativeElement.offsetWidth - 40,
      chartHeight: 330,
      xAxisCategory: currentData.columnData.xAxisCategory,
      legendVisible: false,
      dataseries: currentData.columnData.chartData,
      xAxisVisible: true,
      yAxisVisible: true,
      xAxisTitle: 'Grade',
      yAxisTitle: 'Percentage',
      dataLabelEnable: true,
    };
    this.swfpColumnChart = this.service.getStackedColumnChart(ChartOptions);
    this.responseFlag = true;
  }
  
  onInitLoad() {
    if (this.widgetType === 'ch') { 
      this.onLoadColumnChart();
    }
    if (this.widgetType === 'pi') {
      this.onLoadPieChartByGH();
      this.onLoadPieChartByGI();
    }
  }
  
  ngOnDestroy(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.onInitLoad();
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