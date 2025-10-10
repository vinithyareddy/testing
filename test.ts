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

// ✅ API response type
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
export class SwfpbyGenderComponent implements OnInit, AfterViewInit {
  widgetId: string = 'SWFI_6';
  fullview = false;
  widgetType: any = 'ch';

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
    public apiService: SwfpApiService
  ) {}

  ngOnInit(): void {
    // Watch filter changes and reload data
    this.fiterDataFromUrl$
      .pipe(
        distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
        debounceTime(100),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.loadApiData();
      });

    // Load once initially
    this.loadApiData();
  }

  ngAfterViewInit(): void {
    // After Angular renders DOM, ensure chart refreshes
    setTimeout(() => {
      this.cdr.detectChanges();
      window.dispatchEvent(new Event('resize'));
    }, 400);
  }

  /**
   * Fetch API data
   */
  private loadApiData(): void {
    this.apiService.getWidgetData(this.widgetId).subscribe({
      next: (response) => {
        console.log('API Response of SWFI_6 => ', response);
        this.apiData = response as any[];

        // ✅ Map API fields correctly
        this.genderData = this.apiData.map((item) => ({
          name: item.Category,
          y: item.fte
        }));

        // Load chart after data received
        this.loadChart();

        // ✅ Trigger re-render to fix initial display timing
        setTimeout(() => {
          this.cdr.detectChanges();
          window.dispatchEvent(new Event('resize'));
        }, 300);
      },
      error: (err) => {
        console.error('Error loading API data:', err);
        this.genderData = [];
        this.loadChart();
      }
    });
  }

  loadWidget(chartType: any) {
    this.widgetType = chartType;
  }

  /**
   * Build Highcharts Pie chart dynamically
   */
  private loadChart(): void {
    if (!this.genderData || this.genderData.length === 0) {
      return;
    }

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
              chart.centerValueText.attr({
                text: String(total),
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
        pointFormat: '<b>{point.y}</b> ({point.percentage:.1f}%)'
      },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '85%',
          showInLegend: true,
          dataLabels: {
            distance: 7,
            softConnector: true,
            crop: true,
            enabled: true,
            formatter: function () {
              const pct = Highcharts.numberFormat(
                (this.percentage as number) || 0,
                0
              );
              return `${this.y} (${pct}%)`;
            },
            style: { textOutline: 'none', fontWeight: '500' }
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
          return `<span class="hc-legend-row">
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
