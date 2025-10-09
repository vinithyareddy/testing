import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Renderer2, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LiftPopoverComponent } from '@lift/ui';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

// 🔹 New imports for dynamic data integration
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { SwfpFilterState } from 'app/core/swfp-filter-state/swfp-filter-state';
import { selectEncodedFilter } from 'app/core/swfp-filter-state/swfp-filters.selectors';
import { SwfpApiService } from 'app/modules/shared/swfp-shared/services/swfp-api.service';
import { SwfpQueryBuilderService } from 'app/modules/shared/swfp-shared/services/swfp-query-builder.service';
import { SwfpFilterService } from 'app/modules/shared/swfp-shared/services/swfp-filter.service';
import { SwfpModuleEnum } from 'app/enums/swfp-module.enum';
import * as _ from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-ss-by-volume-proficiency-level',
  templateUrl: './ss-by-volume-proficiency-level.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LiftPopoverComponent,
    HighchartsChartModule,
  ],
  styleUrl: './ss-by-volume-proficiency-level.component.scss'
})
export class SsByVolumeProficiencyLevelComponent implements OnInit {

  fullview = false;
  viewMode: 'chart' | 'table' = 'chart';

  constructor(
    private render: Renderer2,
    public queryBuilder: SwfpQueryBuilderService,
    public store: Store<SwfpFilterState>,
    public filterService: SwfpFilterService,
    public apiService: SwfpApiService
  ) {}

  // 🔹 Widget and integration config
  widgetId: string = 'SSSI_1'; // Unique ID for this widget
  module: string = SwfpModuleEnum.HC_WF;
  public fiterDataFromUrl$ = this.store.select(selectEncodedFilter);
  private destroyRef = inject(DestroyRef);

  Highcharts: typeof Highcharts = Highcharts;

  pageSize = 9;
  currentPage = 0;

  allCategories: string[] = [];
  allSeriesData: number[][] = [[], [], [], []];

  legendText = '';

  chartOptions: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: '' },
    credits: { enabled: false },
    xAxis: {
      categories: [],
      title: {
        text: '',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' },
      },
      labels: {
        style: { color: '#111827', fontWeight: '600', fontSize: '12px' }
      },
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Staff Count',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' },
      },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: '#D1D5DB'
    },
    plotOptions: {
      column: {
        groupPadding: 0.2,
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: { enabled: true }
      }
    },
    series: []
  };

  // 🔹 Dynamic data fetching and chart update
  ngOnInit() {
    this.fiterDataFromUrl$
      .pipe(
        distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
        debounceTime(100),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((filters: string) => {
        console.log('Filters:', filters);
        this.fetchWidgetData();
      });
  }

  // 🔹 API call for widget data
  fetchWidgetData() {
    this.apiService.getWidgetData(this.widgetId).subscribe({
      next: (response: any) => {
        console.log('API Response =>', response);
        this.handleApiResponse(response);
      },
      error: (err) => {
        console.error('Error fetching widget data:', err);
      }
    });
  }

  // 🔹 Handle backend response and update chart
  handleApiResponse(response: any) {
    const data = response?.data || [];

    // Example mapping — adjust based on actual backend structure
    this.allCategories = data.map((d: any) => d.proficiencyLevel || 'N/A');

    const awareness = data.map((d: any) => d.awarenessCount ?? 0);
    const skilled = data.map((d: any) => d.skilledCount ?? 0);
    const advanced = data.map((d: any) => d.advancedCount ?? 0);
    const expert = data.map((d: any) => d.expertCount ?? 0);

    this.allSeriesData = [awareness, skilled, advanced, expert];

    this.updateChart();
  }

  // 🔹 Existing chart rendering logic
  updateChart() {
    const start = this.currentPage * this.pageSize;
    const end = Math.min(start + this.pageSize, this.allCategories.length);

    const pageCategories = this.allCategories.slice(start, end);
    const pageSeriesData = this.allSeriesData.map(s => s.slice(start, end));

    const seriesNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
    const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];

    this.chartOptions = {
      ...this.chartOptions,
      xAxis: {
        ...(this.chartOptions.xAxis as Highcharts.XAxisOptions),
        categories: pageCategories
      },
      series: pageSeriesData.map((data, idx) => ({
        type: 'column',
        pointWidth: 22,
        name: seriesNames[idx],
        color: colors[idx],
        showInLegend: true,
        data
      }))
    };
  }

  // 🔹 View and UI methods
  onLeftClick() {}
  onRightClick() {}

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
  }
}
