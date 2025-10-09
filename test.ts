import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Renderer2, HostListener, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LiftSectionLoaderComponent } from '@lift/loaders';
import { LiftPopoverComponent, PopoverConfig, PopoverPositions } from '@lift/ui';
import { Store } from '@ngrx/store';
import { SwfpFilterState } from 'app/core/swfp-filter-state/swfp-filter-state';
import { selectEncodedFilter } from 'app/core/swfp-filter-state/swfp-filters.selectors';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SwfpApiService } from 'app/modules/shared/swfp-shared/services/swfp-api.service';
import { SwfpFteByGender } from '../../models/swfp-historical-Insights.model';
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
    LiftSectionLoaderComponent  // Add this import
  ],
  styleUrls: ['./swfp-by-gender.component.scss']
})
export class SwfpbyGenderComponent implements OnInit {
  widgetId: string = "SWFI_6";
  
  // Response flag for loader
  ResponseFlag = false;
  
  fullview = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  widgetType: any = 'ch';
  
  // Gender data with proper typing
  genderData: SwfpFteByGender[] = [];
  
  public fiterDataFromUrl$ = this.store.select(selectEncodedFilter);
  private destroyRef = inject(DestroyRef);

  config: PopoverConfig = {
    placement: PopoverPositions.Top,
    adaptivePosition: true,
    container: 'body'
  };

  constructor(
    private render: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    public store: Store<SwfpFilterState>,
    public apiService: SwfpApiService
  ) { }

  ngOnInit(): void {
    // Subscribe to filter changes
    this.fiterDataFromUrl$.pipe(
      distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
      debounceTime(100),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((x: string) => {
      // Set loader to show
      this.ResponseFlag = false;
      
      // Call API
      this.apiService.getWidgetData(this.widgetId).subscribe((genders: any) => {
        if (genders && genders.length > 0) {
          // Process data - sum up by category (gender)
          const totals = genders.reduce((acc: Record<string, number>, curr: any) => {
            const category = curr.category || 'Unknown';
            acc[category] = (acc[category] || 0) + (curr.fte || curr.value || 0);
            return acc;
          }, {});

          // Transform to array format with colors
          this.genderData = Object.entries(totals).map(([category, fte]) => ({
            category,
            fte: fte as number,
            color: this.getGenderColor(category)
          })).sort((a, b) => b.fte - a.fte); // Sort by FTE descending
        } else {
          this.genderData = [];
        }
        
        // Load chart with processed data
        this.onInitLoad(this.genderData);
      }, (error) => {
        console.error("API Error:", error);
        this.ResponseFlag = true;
        this.genderData = [];
      });
    });
  }

  // Helper method to assign colors based on gender
  private getGenderColor(gender: string): string {
    const genderLower = gender.toLowerCase();
    if (genderLower.includes('male') && !genderLower.includes('female')) {
      return '#34a7f2';
    } else if (genderLower.includes('female')) {
      return '#aedcfa';
    } else {
      return '#95DAD9'; // Default color for other genders
    }
  }

  loadWidget(chartType: any) {
    this.widgetType = chartType;
    if (this.genderData.length > 0) {
      this.onInitLoad(this.genderData);
    }
  }

  // Separate method to build chart - following Raja's pattern
  onInitLoad(data: SwfpFteByGender[]): void {
    this.ResponseFlag = true; // Hide loader, show chart
    
    const totalCount = data.reduce((sum, item) => sum + item.fte, 0);

    this.chartOptions = {
      chart: {
        type: 'pie',
        events: {
          render: function () {
            const chart = this as any;
            const genderSeries = chart.series[0] as Highcharts.Series;
            const totalCount = (genderSeries.points || []).reduce((acc, point) => acc + ((point as any).y ?? 0), 0);
            const cx = chart.plotLeft + chart.plotWidth / 2;
            const cy = chart.plotTop + chart.plotHeight / 2;

            if (!(chart.centerValueText)) {
              chart.centerValueText = chart.renderer
                .text(String(totalCount), cx, cy - 6)
                .css({ fontSize: '26px', fontWeight: '700' })
                .attr({ align: 'center' })
                .add();
              chart.centerSubtitleText = chart.renderer
                .text('By Gender', cx, cy + 14)
                .css({ fontSize: '14px', fontWeight: '500' })
                .attr({ align: 'center' })
                .add();
            } else {
              chart.centerValueText.attr({ text: String(totalCount), x: cx, y: cy - 6 });
              chart.centerSubtitleText.attr({ text: 'By Gender', x: cx, y: cy + 14 });
            }
          }
        }
      } as any,
      colors: data.map(d => d.color),
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
              const pct = Highcharts.numberFormat((this.percentage as number) || 0, 0);
              return `${this.y} (${pct}%)`;
            },
            style: { textoutline: 'none', fontWeight: '500' }
          }
        }
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        itemMarginTop: 5,
        itemMarginBottom: 5,
        layout: 'vertical',
        itemStyle: { textoutline: 'none', fontWeight: '500', fontSize: '13px' },
        useHTML: true,
        labelFormatter: function () {
          const point = this as unknown as Highcharts.Point;
          const pct = Highcharts.numberFormat((point.percentage as number) || 0, 0);
          return `<span class="hc-legend-row">
          <span class="hc-legend-left">
                <span class="hc-legend-marker" style="background:${point.color}"></span>
                <span class="hc-legend-name">${point.name}</span>
          </span>
          <span class="hc-legend-right">${point.y} (${pct}%)</span>
          </span>`;
        }
      },
      series: [{
        type: 'pie',
        name: 'Gender',
        size: '90%',
        data: data.map(d => ({ name: d.category, y: d.fte, color: d.color }))
      }]
    };
  }

  get totalCount(): number {
    return this.genderData.reduce((sum, item) => sum + (item.fte || 0), 0);
  }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview === true) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.genderData.length > 0) {
      this.onInitLoad(this.genderData);
    }
  }
}