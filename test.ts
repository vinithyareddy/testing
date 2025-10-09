import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Renderer2, DestroyRef, inject } from '@angular/core';
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

// ✅ Define API Response Interface
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
    LiftPopoverComponent
  ],
  styleUrls: ['./swfp-by-gender.component.scss']
})
export class SwfpbyGenderComponent implements OnInit {
  widgetId: string = 'SWFI_6';
  fullview = false;
  widgetType: any = 'ch';

  Highcharts: typeof Highcharts = Highcharts;

  // ✅ Initialize chartOptions to an empty object (prevents undefined binding)
  chartOptions: Highcharts.Options = {};

  apiData: ApiResponseItem[] = [];
  genderData: { name: string; y: number }[] = [];

  public fiterDataFromUrl$ = this.store.select(selectEncodedFilter);
  private destroyRef = inject(DestroyRef);

  constructor(
    private render: Renderer2,
    public store: Store<SwfpFilterState>,
    public apiService: SwfpApiService
  ) {}

  ngOnInit(): void {
    // ✅ Set global option (fixes 'time' undefined globally)
    Highcharts.setOptions({ time: { useUTC: false } });

    // Watch filters and reload data
    this.fiterDataFromUrl$
      .pipe(
        distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
        debounceTime(100),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.loadApiData());

    // Initial load
    this.loadApiData();
  }

  /** ✅ Fetch widget data from API and process for chart */
  private loadApiData(): void {
    this.apiService.getWidgetData(this.widgetId).subscribe({
      next: (response) => {
        console.log('API Response of SWFI_6 => ', response);
        this.apiData = response as ApiResponseItem[];

        this.genderData = this.apiData.map((item) => ({
          name: item.Category,
          y: item.fte
        }));

        // ✅ Avoid empty chart render and delay creation
        if (!this.genderData.length) return;

        setTimeout(() => this.loadChart(), 10);
      },
      error: (err) => {
        console.error('Error loading API data:', err);
        this.genderData = [];
      }
    });
  }

  loadWidget(chartType: any) {
    this.widgetType = chartType;
  }

  /** ✅ Build Highcharts Pie chart dynamically */
  private loadChart(): void {
    const totalCount = this.genderData.reduce((sum, item) => sum + item.y, 0);

    this.chartOptions = {
      time: { useUTC: false }, // ensure internal time object exists

      chart: {
        type: 'pie',
        events: {
          render: function () {
            const chart = this as any;
            const series = chart.series[0] as Highcharts.Series;
            const total = (series.points || []).reduce(
              (acc, p) => acc + ((p as any).y ?? 0),
              0
            );
            const cx = chart.plotLeft + chart.plotWidth / 2;
            const cy = chart.plotTop + chart.plotHeight / 2;

            if (!chart.centerValueText) {
              chart.centerValueText = chart.renderer
                .text(String(total), cx, cy - 6)
                .css({ fontSize: '26px', fontWeight: '700' })
                .attr({ align: 'center' })
                .add();

              chart.centerSubtitleText = chart.renderer
                .text('By Gender', cx, cy + 14)
                .css({ fontSize: '14px', fontWeight: '500' })
                .attr({ align: 'center' })
                .add();
            } else {
              chart.centerValueText.attr({ text: String(total), x: cx, y: cy - 6 });
              chart.centerSubtitleText.attr({ text: 'By Gender', x: cx, y: cy + 14 });
            }
          }
        }
      } as any,

      colors: ['#34a7f2', '#aedcfa'],
      title: { text: '' },
      tooltip: { pointFormat: '<b>{point.y}</b> ({point.percentage:.1f}%)' },
      credits: { enabled: false },

      plotOptions: {
        pie: {
          innerSize: '85%',
          showInLegend: true,
          dataLabels: {
            distance: 7,
            softConnector: true,
            enabled: true,
            formatter: function () {
              const pct = Highcharts.numberFormat((this.percentage as number) || 0, 0);
              return `${this.y} (${pct}%)`;
            },
            style: { textOutline: 'none', fontWeight: '500' }
          }
        }
      },

      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemMarginTop: 5,
        itemMarginBottom: 5,
        useHTML: true,
        itemStyle: { textOutline: 'none', fontWeight: '500', fontSize: '13px' },
        labelFormatter: function () {
          const point = this as unknown as Highcharts.Point;
          const pct = Highcharts.numberFormat((point.percentage as number) || 0, 0);
          return `
            <span class="hc-legend-row">
              <span class="hc-legend-left">
                <span class="hc-legend-marker" style="background:${point.color}"></span>
                <span class="hc-legend-name">${point.name}</span>
              </span>
              <span class="hc-legend-right">${point.y} (${pct}%)</span>
            </span>`;
        }
      },

      series: [
        {
          type: 'pie',
          name: 'Gender',
          size: '90%',
          data: this.genderData.map((d) => ({ name: d.name, y: d.y }))
        }
      ]
    };
  }

  get totalCount(): number {
    return this.genderData.reduce((sum, slice) => sum + (slice.y || 0), 0);
  }

  fullPageView() {
    this.fullview = !this.fullview;
    this.fullview
      ? this.render.addClass(document.body, 'no-scroll')
      : this.render.removeClass(document.body, 'no-scroll');
  }
}
