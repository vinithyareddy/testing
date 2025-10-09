import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { LiftPopoverComponent } from '@lift/ui';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { Store } from '@ngrx/store';
import { SwfpFilterState } from 'app/core/swfp-filter-state/swfp-filter-state';
import { selectEncodedFilter } from 'app/core/swfp-filter-state/swfp-filters.selectors';
import { SwfpQueryBuilderService } from 'app/modules/shared/swfp-shared/services/swfp-query-builder.service';
import { SwfpApiService } from 'app/modules/shared/swfp-shared/services/swfp-api.service';
import { SwfpModuleEnum } from 'app/enums/swfp-module.enum';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-ss-by-volume-proficiency-level',
  templateUrl: './ss-by-volume-proficiency-level.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LiftPopoverComponent, HighchartsChartModule],
  styleUrls: ['./ss-by-volume-proficiency-level.component.scss']
})
export class SsByVolumeProficiencyLevelComponent implements OnInit, AfterViewInit {
  widgetId: string = 'SWFI_1';
  module: string = SwfpModuleEnum.HC_WF;

  fullview = false;
  viewMode: 'chart' | 'table' = 'chart';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  allCategories: string[] = [];
  allSeriesData: number[][] = [[], [], [], []];
  private destroyRef = inject(DestroyRef);

  constructor(
    private store: Store<SwfpFilterState>,
    private queryBuilder: SwfpQueryBuilderService,
    private apiService: SwfpApiService
  ) {}

  fiterDataFromUrl$ = this.store.select(selectEncodedFilter);

  ngOnInit(): void {
    this.fiterDataFromUrl$
      .pipe(distinctUntilChanged((a, b) => _.isEqual(a, b)), debounceTime(200), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadData());
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.loadData(), 200);
  }

  loadData(): void {
    this.apiService.getWidgetData(this.widgetId).subscribe({
      next: (res: any) => {
        console.log('📊 Proficiency JSON =>', res);
        const data = res?.data || [];
        this.allCategories = data.map((d: any) => d.level);
        const awareness = data.map((d: any) => d.Awareness);
        const skilled = data.map((d: any) => d.Skilled);
        const advanced = data.map((d: any) => d.Advanced);
        const expert = data.map((d: any) => d.Expert);

        const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];

        this.chartOptions = {
          chart: { type: 'column' },
          title: { text: '' },
          credits: { enabled: false },
          xAxis: { categories: this.allCategories },
          yAxis: {
            title: { text: 'Staff Count' },
            gridLineDashStyle: 'Dash'
          },
          legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal'
          },
          tooltip: {
            shared: true,
            headerFormat: '<b>{point.key}</b><br/>',
            pointFormat: '{series.name}: {point.y} FTE<br/>'
          },
          plotOptions: {
            column: { groupPadding: 0.2, pointPadding: 0.05, borderWidth: 0, dataLabels: { enabled: true } }
          },
          series: [
            { type: 'column', name: 'Awareness', data: awareness, color: colors[0] },
            { type: 'column', name: 'Skilled', data: skilled, color: colors[1] },
            { type: 'column', name: 'Advanced', data: advanced, color: colors[2] },
            { type: 'column', name: 'Expert', data: expert, color: colors[3] }
          ]
        };
      },
      error: (err) => console.error('❌ Error loading widget data', err)
    });
  }
}
