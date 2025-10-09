
ts:
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import { Component, OnInit, Renderer2 } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { LiftButtonComponent, LiftButtonGroupComponent, LiftButtonSwitchComponent } from '@lift/formcontrols';

import { LiftSectionLoaderComponent } from '@lift/loaders';

import { LiftPopoverComponent } from '@lift/ui';

import * as Highcharts from 'highcharts';

import { HighchartsChartModule } from 'highcharts-angular';

import { AfterViewInit, DestroyRef, inject, } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ActivatedRoute, Router } from '@angular/router';

import { PopoverConfig, PopoverPositions } from '@lift/ui';

import { Store } from '@ngrx/store';

import { SwfpFilterState } from 'app/core/swfp-filter-state/swfp-filter-state';

import { selectEncodedFilter } from 'app/core/swfp-filter-state/swfp-filters.selectors';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import * as _ from 'lodash';

import { SwfpFilterService } from 'app/modules/shared/swfp-shared/services/swfp-filter.service';

import { SwfpQueryBuilderService } from 'app/modules/shared/swfp-shared/services/swfp-query-builder.service';

import { SwfpModuleEnum } from 'app/enums/swfp-module.enum';

import { SwfpApiService } from 'app/modules/shared/swfp-shared/services/swfp-api.service';

import { SwfpWidgetDataParams } from 'app/modules/shared/swfp-shared/models/app-swfp-widget.model';

 

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

  widgetId: string = "SWFI_6";

  fullview = false;

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions!: Highcharts.Options;

  widgetType: any = 'ch';

  genderData = [

    { name: 'Male', y: 166 },

    { name: 'Female', y: 148 }

  ];

  public fiterDataFromUrl$ = this.store.select(selectEncodedFilter);

  private destroyRef = inject(DestroyRef);

  constructor(private render: Renderer2, public store: Store<SwfpFilterState>, public apiService: SwfpApiService) { }

 

  ngOnInit(): void {

    this.fiterDataFromUrl$.pipe(distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),

      debounceTime(100),

      takeUntilDestroyed(this.destroyRef)

    ).subscribe((x: string) => {

      console.log("filters", x);

 

      this.apiService.getWidgetData(this.widgetId).subscribe((x) => {

 

        console.log("API Response => ", x);

      });

 

    });

    this.loadChart();

  }

 

  loadWidget(chartType: any) {

    this.widgetType = chartType;

  }

 

  private loadChart(): void {

    const totalCount = this.genderData.reduce((sum, item) => sum + item.y, 0);

 

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

            // connectorWidth: 0,

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

        data: this.genderData.map(d => ({ name: d.name, y: d.y }))

      }]

    };

  }

  get totalCount(): number {

    return this.genderData.reduce((genderSeries, genderSlice) => genderSeries + (genderSlice.y || 0), 0);

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

 