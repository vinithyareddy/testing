import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HighchartServicesService } from 'services/highchart-services.service';
import { TypeaheadConfig, TypeaheadData } from '@lift/formcontrols/selects';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-expense-by-cost-category',
  templateUrl: './expense-by-cost-category.component.html',
  styleUrl: './expense-by-cost-category.component.scss',
  animations: [
    trigger('collapse', [
      state('false', style({ height: '320px', visibility: 'visible' })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class ExpenseByCostCategoryComponent
  implements AfterViewInit, OnDestroy {

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  private destroy$ = new Subject<void>();

  /** UI State */
  fullview = false;
  collapsed = false;
  selectedVal: 'ch' | 'tb' = 'ch';
  selectedFilter = 'Expense Type';
  ResponseFlag = true;

  /** Chart Holders */
  chartList: any[] = [];
  legendData: any[] = [];

  /** Dropdown */
  filterConfig: TypeaheadConfig = {
    multiple: false,
    placeholder: 'Select'
  };

  filterOptions: TypeaheadData = {
    selectedValue: 'Expense Type',
    items: [
      { label: 'Expense Type', value: 'Expense Type' },
      { label: 'By Components', value: 'By Components' }
    ],
    bindLabel: 'label',
    bindValue: 'value'
  };

  constructor(
    private renderer: Renderer2,
    private chartService: HighchartServicesService
  ) {}

  ngAfterViewInit(): void {
    this.loadCharts();
  }

  /** ----------------------------
   * Chart Loader
   * ---------------------------- */
  loadCharts(): void {
    this.chartList = [];
    this.legendData = [];

    if (this.selectedFilter === 'Expense Type') {
      this.loadExpenseTypeCharts();
    } else {
      this.loadByComponentChart();
    }
  }

  /** ----------------------------
   * Expense Type – Pie Charts
   * ---------------------------- */
  loadExpenseTypeCharts(): void {
    const fixedExpenseData = [
      { name: 'Staff Expenses', y: 88.4, color: '#66C4CA' },
      { name: 'Equipment & Building', y: 4.2, color: '#E15759' },
      { name: 'Depreciation', y: 3.6, color: '#59A14F' },
      { name: 'Communications', y: 5.6, color: '#4E79A7' }
    ];

    const variableExpenseData = [
      { name: 'ET Consultants', y: 43.2, color: '#66C4CA' },
      { name: 'ST Consultants', y: 4.2, color: '#E15759' },
      { name: 'Other Expenses', y: 3.6, color: '#59A14F' },
      { name: 'Service & Support Fees', y: 5.6, color: '#4E79A7' },
      { name: 'Representation', y: 21.4, color: '#2F5597' },
      { name: 'Contractual Services', y: 24.4, color: '#A392D3' }
    ];

    const pieOptions = (title: string, data: any[]) => ({
      chartTitle: title,
      chartWidth: this.chartContainer.nativeElement.offsetWidth / 2 - 16,
      chartHight: 260,
      dataseries: data,
      dataLabelEnable: true,
      legendVisible: true
    });

    this.chartList.push(
      ...this.chartService.GetPieChart(pieOptions('Fixed Expense Breakdown', fixedExpenseData)),
      ...this.chartService.GetPieChart(pieOptions('Variable Expense Breakdown', variableExpenseData))
    );

    this.legendData = [...fixedExpenseData, ...variableExpenseData];
  }

  /** ----------------------------
   * By Components – Horizontal Bar
   * ---------------------------- */
  loadByComponentChart(): void {
    const dataSeries = [
      { name: 'FY 25', data: [1200, 140, 110, 160], color: '#66C4CA' },
      { name: 'FY 26', data: [1150, 120, 130, 140], color: '#3175CA' }
    ];

    const options = {
      chartTitle: 'Expense by Cost Category',
      chartWidth: this.chartContainer.nativeElement.offsetWidth,
      chartHight: 280,
      xAxisCategory: ['Staff', 'ST Consultants', 'Travel', 'Contractual Services'],
      dataseries: dataSeries,
      legendVisible: true,
      xAxisVisible: true,
      yAxisVisible: true,
      dataLabelEnable: false,
      enableScrollbar: true
    };

    this.chartList = this.chartService.GetHorizontalBarChart(options);
    this.legendData = dataSeries;
  }

  /** ----------------------------
   * Events
   * ---------------------------- */
  onFilterChange(event: any): void {
    this.selectedFilter = event.value;
    this.selectedVal = 'ch'; // reset to chart view
    this.loadCharts();
  }

  onTabChanged(val: any): void {
    this.selectedVal = val;
  }

  fullPageView(): void {
    this.fullview = !this.fullview;
    this.fullview
      ? this.renderer.addClass(document.body, 'no-scroll')
      : this.renderer.removeClass(document.body, 'no-scroll');
  }

  expand(): void {
    this.collapsed = false;
  }

  collapse(): void {
    this.collapsed = true;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.loadCharts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
