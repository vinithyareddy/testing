import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, DestroyRef, HostListener, inject, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LiftPopoverComponent } from '@lift/ui';
import { LiftSectionLoaderComponent } from '@lift/loaders';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { SwfpFilterState } from 'app/core/swfp-filter-state/swfp-filter-state';
import { selectEncodedFilter } from 'app/core/swfp-filter-state/swfp-filters.selectors';
import { SwfpApiService } from 'app/modules/shared/swfp-shared/services/swfp-api.service';
import * as _ from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs';

// Define interface for the data model (following Raja's pattern)
interface SkillProficiencyData {
  skill_name: string;
  proficiency: string;
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
    LiftSectionLoaderComponent
  ],
  styleUrl: './ss-by-volume-proficiency-level.component.scss'
})
export class SsByVolumeProficiencyLevelComponent implements OnInit {
  widgetId: string = 'SKI_1';
  
  isLeftDisabled = true;
  isRightDisabled = false;
  fullview = false;
  viewMode: 'chart' | 'table' = 'chart';
  ResponseFlag = false;
  
  public fiterDataFromUrl$ = this.store.select(selectEncodedFilter);
  private destroyRef = inject(DestroyRef);
  
  constructor(
    private render: Renderer2,
    public store: Store<SwfpFilterState>,
    public apiService: SwfpApiService
  ) { }

  Highcharts: typeof Highcharts = Highcharts;
  
  pageSize = 9;
  currentPage = 0;
  
  // Store the raw processed data (like Raja stores locationData, ageData, etc.)
  skillProficiencyData: SkillProficiencyData[] = [];
  
  allCategories: string[] = [];
  allSeriesData: number[][] = [[], [], [], []];
  
  chartOptions: Highcharts.Options = {};

  ngOnInit(): void {
    // Following Raja's exact pattern
    this.fiterDataFromUrl$.pipe(
      distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
      debounceTime(100),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((x: string) => {
      
      this.apiService.getWidgetData(this.widgetId).subscribe((response: any) => {
        console.log("API Response => ", response);
        
        this.skillProficiencyData = [];
        
        if (response && response.length > 0) {
          // Step 1: Group by skill_name and proficiency, sum FTE
          const grouped: { [skillName: string]: { [proficiency: string]: number } } = {};
          
          response.forEach((item: any) => {
            const skill = item.skill_name;
            const proficiency = item.proficiency;
            const fte = item.fte || 0;
            
            if (!skill || !proficiency) return;
            
            if (!grouped[skill]) {
              grouped[skill] = {};
            }
            
            if (!grouped[skill][proficiency]) {
              grouped[skill][proficiency] = 0;
            }
            
            grouped[skill][proficiency] += Number(fte);
          });
          
          // Step 2: Extract categories and series data
          this.allCategories = Object.keys(grouped).sort();
          
          const proficiencyOrder = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
          
          this.allSeriesData = proficiencyOrder.map(proficiency => {
            return this.allCategories.map(skill => {
              return grouped[skill][proficiency] || 0;
            });
          });
          
          console.log("Processed Categories:", this.allCategories);
          console.log("Processed Series Data:", this.allSeriesData);
        }
        
        // Call chart building method (Raja's pattern)
        this.buildChart();
      });
    });
  }

  // Following Raja's pattern - separate method for chart building
  buildChart(): void {
    this.ResponseFlag = true;
    
    const start = this.currentPage * this.pageSize;
    const end = Math.min(start + this.pageSize, this.allCategories.length);
    
    const pageCategories = this.allCategories.slice(start, end);
    const pageSeriesData = this.allSeriesData.map(s => s.slice(start, end));
    
    const seriesNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
    const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];
    
    this.chartOptions = {
      chart: { 
        type: 'column',
        backgroundColor: '#ffffff'
      },
      title: { text: '' },
      credits: { enabled: false },
      xAxis: {
        categories: pageCategories,
        title: {
          text: '',
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
          text: 'Staff Count',
          style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
        },
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#D1D5DB'
      },
      tooltip: {
        shared: true
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
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom'
      },
      series: pageSeriesData.map((data, idx) => ({
        type: 'column',
        pointWidth: 22,
        name: seriesNames[idx],
        color: colors[idx],
        data
      }))
    };
    
    // Update pagination buttons
    this.isLeftDisabled = this.currentPage === 0;
    const maxPage = Math.ceil(this.allCategories.length / this.pageSize) - 1;
    this.isRightDisabled = this.currentPage >= maxPage;
  }

  // Following Raja's pattern - loadWidget method
  loadWidget(type: 'chart' | 'table') {
    this.viewMode = type;
    // Chart is already built, just switching view
  }

  onLeftClick() {
    if (!this.isLeftDisabled) {
      this.currentPage--;
      this.buildChart(); // Rebuild chart with new page
    }
  }

  onRightClick() {
    if (!this.isRightDisabled) {
      this.currentPage++;
      this.buildChart(); // Rebuild chart with new page
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

  // Following Raja's pattern - resize handler
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.buildChart();
  }
}