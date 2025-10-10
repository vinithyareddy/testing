import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LiftPopoverComponent } from '@lift/ui';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
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
import { DestroyRef, inject } from '@angular/core';
import { LiftSectionLoaderComponent } from '@lift/loaders'; // ← ADD THIS IMPORT

// ==================== ADD THIS MOCK DATA (AFTER IMPORTS, BEFORE INTERFACE) ====================
const MOCK_PROFICIENCY_DATA = [
  // Level 1
  { fiscal_year: '2025', skill_name: 'Level 1', prof_skill_overall_name: 'Awareness', fte: 120 },
  { fiscal_year: '2025', skill_name: 'Level 1', prof_skill_overall_name: 'Skilled', fte: 80 },
  { fiscal_year: '2025', skill_name: 'Level 1', prof_skill_overall_name: 'Advanced', fte: 50 },
  { fiscal_year: '2025', skill_name: 'Level 1', prof_skill_overall_name: 'Expert', fte: 30 },
  
  // Level 2
  { fiscal_year: '2025', skill_name: 'Level 2', prof_skill_overall_name: 'Awareness', fte: 100 },
  { fiscal_year: '2025', skill_name: 'Level 2', prof_skill_overall_name: 'Skilled', fte: 90 },
  { fiscal_year: '2025', skill_name: 'Level 2', prof_skill_overall_name: 'Advanced', fte: 70 },
  { fiscal_year: '2025', skill_name: 'Level 2', prof_skill_overall_name: 'Expert', fte: 40 },
  
  // Level 3
  { fiscal_year: '2025', skill_name: 'Level 3', prof_skill_overall_name: 'Awareness', fte: 110 },
  { fiscal_year: '2025', skill_name: 'Level 3', prof_skill_overall_name: 'Skilled', fte: 95 },
  { fiscal_year: '2025', skill_name: 'Level 3', prof_skill_overall_name: 'Advanced', fte: 60 },
  { fiscal_year: '2025', skill_name: 'Level 3', prof_skill_overall_name: 'Expert', fte: 35 },
  
  // Level 4
  { fiscal_year: '2025', skill_name: 'Level 4', prof_skill_overall_name: 'Awareness', fte: 90 },
  { fiscal_year: '2025', skill_name: 'Level 4', prof_skill_overall_name: 'Skilled', fte: 100 },
  { fiscal_year: '2025', skill_name: 'Level 4', prof_skill_overall_name: 'Advanced', fte: 80 },
  { fiscal_year: '2025', skill_name: 'Level 4', prof_skill_overall_name: 'Expert', fte: 50 },
  
  // Level 5
  { fiscal_year: '2025', skill_name: 'Level 5', prof_skill_overall_name: 'Awareness', fte: 85 },
  { fiscal_year: '2025', skill_name: 'Level 5', prof_skill_overall_name: 'Skilled', fte: 75 },
  { fiscal_year: '2025', skill_name: 'Level 5', prof_skill_overall_name: 'Advanced', fte: 65 },
  { fiscal_year: '2025', skill_name: 'Level 5', prof_skill_overall_name: 'Expert', fte: 45 },
  
  // Level 6
  { fiscal_year: '2025', skill_name: 'Level 6', prof_skill_overall_name: 'Awareness', fte: 95 },
  { fiscal_year: '2025', skill_name: 'Level 6', prof_skill_overall_name: 'Skilled', fte: 85 },
  { fiscal_year: '2025', skill_name: 'Level 6', prof_skill_overall_name: 'Advanced', fte: 55 },
  { fiscal_year: '2025', skill_name: 'Level 6', prof_skill_overall_name: 'Expert', fte: 38 },
  
  // Level 7
  { fiscal_year: '2025', skill_name: 'Level 7', prof_skill_overall_name: 'Awareness', fte: 105 },
  { fiscal_year: '2025', skill_name: 'Level 7', prof_skill_overall_name: 'Skilled', fte: 88 },
  { fiscal_year: '2025', skill_name: 'Level 7', prof_skill_overall_name: 'Advanced', fte: 72 },
  { fiscal_year: '2025', skill_name: 'Level 7', prof_skill_overall_name: 'Expert', fte: 42 },
  
  // Level 8
  { fiscal_year: '2025', skill_name: 'Level 8', prof_skill_overall_name: 'Awareness', fte: 92 },
  { fiscal_year: '2025', skill_name: 'Level 8', prof_skill_overall_name: 'Skilled', fte: 82 },
  { fiscal_year: '2025', skill_name: 'Level 8', prof_skill_overall_name: 'Advanced', fte: 68 },
  { fiscal_year: '2025', skill_name: 'Level 8', prof_skill_overall_name: 'Expert', fte: 48 },
  
  // Level 9
  { fiscal_year: '2025', skill_name: 'Level 9', prof_skill_overall_name: 'Awareness', fte: 98 },
  { fiscal_year: '2025', skill_name: 'Level 9', prof_skill_overall_name: 'Skilled', fte: 78 },
  { fiscal_year: '2025', skill_name: 'Level 9', prof_skill_overall_name: 'Advanced', fte: 58 },
  { fiscal_year: '2025', skill_name: 'Level 9', prof_skill_overall_name: 'Expert', fte: 36 }
];

// ==================== ADD THIS INTERFACE (BEFORE @Component) ====================
interface ProficiencyData {
  fiscal_year: string;
  skill_name: string;
  prof_skill_overall_name: string;
  fte: number;
}

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
    LiftSectionLoaderComponent  // ← ADD THIS TO IMPORTS ARRAY
  ],
  styleUrl: './ss-by-volume-proficiency-level.component.scss'
})
export class SsByVolumeProficiencyLevelComponent {
  widgetId: string = 'SKI_1';
  
  // ==================== ADD THIS LINE ====================
  ResponseFlag = false; // ← ADD THIS for loader functionality
  
  isLeftDisabled = true;
  isRightDisabled = false;
  fullview = false;
  viewMode: 'chart' | 'table' = 'chart';
  
  public fiterDataFromUrl$ = this.store.select(selectEncodedFilter);
  private destroyRef = inject(DestroyRef);
  
  constructor(
    private render: Renderer2,
    public store: Store<SwfpFilterState>,
    public apiService: SwfpApiService
  ) {}

  Highcharts: typeof Highcharts = Highcharts;
  pageSize = 9;
  currentPage = 0;
  
  allCategories: string[] = [];
  allSeriesData: number[][] = [[], [], [], []];
  
  // ==================== ADD THIS LINE ====================
  proficiencyData: ProficiencyData[] = []; // ← ADD THIS to store processed data
  
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

  // ==================== REPLACE YOUR ENTIRE ngOnInit() WITH THIS ====================
  ngOnInit() {
    this.fiterDataFromUrl$.pipe(
      distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
      debounceTime(100),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((x: string) => {
      console.log("filters", x);
      
      this.apiService.getWidgetData(this.widgetId).subscribe((response) => {
        console.log("API Response => ", response);
        
        // TODO: Once API is fixed, use real data
        // For now, use mock data
        this.processProficiencyData(MOCK_PROFICIENCY_DATA);
        
        // When API is fixed, uncomment this:
        // if (response && Array.isArray(response) && response.length > 0) {
        //   this.processProficiencyData(response);
        // } else {
        //   this.proficiencyData = [];
        //   this.ResponseFlag = true;
        //   this.updateChart();
        // }
      }, (error) => {
        console.error("API Error:", error);
        // Use mock data on error
        this.processProficiencyData(MOCK_PROFICIENCY_DATA);
      });
    });
  }

  // ==================== ADD THIS NEW METHOD (AFTER ngOnInit) ====================
  private processProficiencyData(apiData: ProficiencyData[]): void {
    console.log("Processing proficiency data:", apiData);
    
    this.ResponseFlag = true; // Show the chart (hide loader)
    this.proficiencyData = apiData;
    
    // Get unique skill levels (Level 1, Level 2, etc.) - these are categories (x-axis)
    const uniqueLevels = [...new Set(apiData.map(item => item.skill_name))].sort();
    this.allCategories = uniqueLevels;
    
    // Get unique proficiency types (Awareness, Skilled, Advanced, Expert) - these are series
    const proficiencyTypes = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
    
    // Build series data: for each proficiency type, get FTE values for each level
    this.allSeriesData = proficiencyTypes.map(profType => {
      return uniqueLevels.map(level => {
        const found = apiData.find(
          item => item.skill_name === level && item.prof_skill_overall_name === profType
        );
        return found ? found.fte : 0;
      });
    });
    
    console.log("Processed categories:", this.allCategories);
    console.log("Processed series data:", this.allSeriesData);
    
    // Update chart with processed data
    this.updateChart();
  }

  // ==================== REPLACE YOUR ENTIRE updateChart() WITH THIS ====================
  updateChart() {
    const start = this.currentPage * this.pageSize;
    const end = Math.min(start + this.pageSize, this.allCategories.length);
    
    const pageCategories = this.allCategories.slice(start, end);
    const pageSeriesData = this.allSeriesData.map(s => s.slice(start, end));
    
    const seriesNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
    const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];
    
    this.chartOptions = {
      ...this.chartOptions,
      chart: { 
        type: 'column',
        backgroundColor: '#ffffff'
      },
      title: { text: '' },
      credits: { enabled: false },
      xAxis: {
        ...(this.chartOptions.xAxis as Highcharts.XAxisOptions),
        categories: pageCategories,
        title: {
          text: 'Skill Levels',
          style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
        },
        labels: {
          style: { color: '#111827', fontWeight: '600', fontSize: '12px' }
        },
        lineWidth: 0
      },
      yAxis: {
        min: 0,
        title: {
          text: 'FTE Count',
          style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
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
          dataLabels: { 
            enabled: true,
            style: { 
              fontWeight: '600',
              textOutline: 'none'
            }
          }
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          fontWeight: '500',
          fontSize: '13px'
        }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function() {
          let tooltip = `<b>${this.x}</b><br/>`;
          this.points?.forEach(point => {
            tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b><br/>`;
          });
          return tooltip;
        }
      },
      series: pageSeriesData.map((data, idx) => ({
        type: 'column',
        pointWidth: 18,
        name: seriesNames[idx],
        color: colors[idx],
        showInLegend: true,
        data
      }))
    };
    
    // Update navigation button states
    this.isLeftDisabled = this.currentPage === 0;
    const maxPage = Math.ceil(this.allCategories.length / this.pageSize) - 1;
    this.isRightDisabled = this.currentPage >= maxPage;
  }

  // ==================== KEEP YOUR EXISTING METHODS BELOW (NO CHANGES) ====================
  onLeftClick() {
    if (!this.isLeftDisabled) {
      this.currentPage--;
      this.updateChart();
    }
  }

  onRightClick() {
    if (!this.isRightDisabled) {
      this.currentPage++;
      this.updateChart();
    }
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


