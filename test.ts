import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LiftSectionLoaderComponent } from '@lift/loaders';
import { LiftPopoverComponent, PopoverConfig } from '@lift/ui';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LiftSectionLoaderComponent,
    HighchartsChartModule,
    LiftPopoverComponent
  ],
  styleUrls: ['./swfp-by-fcv-status.component.scss'],
})
export class SwfpByFcvStatusComponent implements OnInit, AfterViewInit {
  @ViewChild('chartsection', { static: false }) chartSection!: ElementRef;
  
  ResponseFlag = false;
  collapsed = false;
  widgetType = 'ch';   // ch = chart
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  fcvData: any[] = [];
  config1: PopoverConfig = { showPopoverOnClick: true };
  
  // Screen size tracking
  isMobile = false;
  isTablet = false;
  isDesktop = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.updateScreenSize();
  }

  ngOnInit(): void {
    this.fcvData = [
      { name: 'FCV', value: 104, color: '#95dad9' },
      { name: 'Non-FCV', value: 44, color: '#3e9b9a' },
    ];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.fcvData.length > 0) {
        this.onInitLoad(this.fcvData);
      }
    }, 100);
  }

  loadWidget(type: string) {
    this.widgetType = type;
    if (this.fcvData.length > 0) {
      this.onInitLoad(this.fcvData);
    }
  }

  onInitLoad(data: any[]): void {
    this.ResponseFlag = true;
    const total = data.reduce((acc, cur) => acc + cur.value, 0);

    // Dynamic sizing based on screen size
    const chartHeight = this.getChartHeight();
    const fontSize = this.getFontSize();
    const spacing = this.getSpacing();

    this.chartOptions = {
      chart: {
        type: 'pie',
        height: chartHeight,
        spacingTop: spacing.top,
        spacingBottom: spacing.bottom,
        spacingLeft: spacing.left,
        spacingRight: spacing.right,
        backgroundColor: 'transparent',
      },
      title: {
        verticalAlign: 'middle',
        floating: true,
        useHTML: true,
        y: this.isMobile ? -5 : -10,
        text: `<div style="text-align: center;">
                <span style="font-size:${fontSize.title}px; font-weight:bold; line-height:1.2;">${total}</span><br/>
                <span style="font-size:${fontSize.subtitle}px; line-height:1.2;">By FCV Status</span>
               </div>`,
      },
      tooltip: { 
        pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)',
        style: {
          fontSize: `${fontSize.tooltip}px`
        }
      },
      credits: { enabled: false },
      legend: {
        enabled: !this.isMobile, // Hide legend on mobile for space
        align: 'center',
        verticalAlign: 'bottom',
        layout: this.isMobile ? 'vertical' : 'horizontal',
        itemStyle: {
          fontSize: `${fontSize.legend}px`
        }
      },
      plotOptions: {
        pie: {
          innerSize: this.isMobile ? '75%' : '85%',
          borderRadius: 0,
          showInLegend: !this.isMobile,
          dataLabels: {
            enabled: !this.isMobile, // Hide data labels on mobile
            distance: this.isMobile ? 2 : 5,
            format: this.isMobile ? '{point.percentage:.0f}%' : '{point.y} ({point.percentage:.0f}%)',
            style: {
              fontSize: `${fontSize.dataLabels}px`,
              textOutline: 'none'
            },
            crop: false,
            overflow: 'allow'
          },
          ...(this.widgetType === 'ch'
            ? { 
                startAngle: -90, 
                endAngle: 90, 
                center: ['50%', this.isMobile ? '70%' : '75%'], 
                size: this.isMobile ? '110%' : '140%' 
              }
            : { 
                startAngle: 0, 
                endAngle: 360, 
                center: ['50%', '50%'], 
                size: this.isMobile ? '90%' : '120%' 
              }),
        },
      },
      series: [
        {
          type: 'pie',
          name: 'FCV Status',
          data: data.map(d => ({ name: d.name, y: d.value, color: d.color })),
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                enabled: false
              },
              plotOptions: {
                pie: {
                  dataLabels: {
                    enabled: false
                  }
                }
              }
            }
          },
          {
            condition: {
              maxWidth: 768
            },
            chartOptions: {
              chart: {
                spacingTop: 10,
                spacingBottom: 10,
                spacingLeft: 10,
                spacingRight: 10
              }
            }
          }
        ]
      }
    };
  }

  // Helper methods for responsive sizing
  getChartHeight(): number {
    if (this.isMobile) return 200;
    if (this.isTablet) return 250;
    return 300;
  }

  getFontSize() {
    if (this.isMobile) {
      return {
        title: 20,
        subtitle: 10,
        tooltip: 10,
        legend: 10,
        dataLabels: 9
      };
    }
    if (this.isTablet) {
      return {
        title: 25,
        subtitle: 11,
        tooltip: 11,
        legend: 11,
        dataLabels: 10
      };
    }
    return {
      title: 30,
      subtitle: 12,
      tooltip: 12,
      legend: 12,
      dataLabels: 11
    };
  }

  getSpacing() {
    if (this.isMobile) {
      return { top: 10, bottom: 10, left: 20, right: 20 };
    }
    if (this.isTablet) {
      return { top: 15, bottom: 15, left: 30, right: 30 };
    }
    return { top: 20, bottom: 20, left: 40, right: 50 };
  }

  updateScreenSize(): void {
    const width = window.innerWidth;
    this.isMobile = width < 576;
    this.isTablet = width >= 576 && width < 992;
    this.isDesktop = width >= 992;
  }

  getDetailPage() {
    this.router.navigate(['fcv-status'], { relativeTo: this.route });
  }

  // Enhanced resize handler
  @HostListener('window:resize')
  onResize() {
    this.updateScreenSize();
    
    // Reload chart with new responsive settings
    if (this.fcvData.length > 0) {
      setTimeout(() => {
        this.onInitLoad(this.fcvData);
      }, 100);
    }

    // Force Highcharts reflow
    if (this.Highcharts && (Highcharts as any).charts) {
      (Highcharts as any).charts.forEach((chart: any) => {
        if (chart) {
          chart.reflow();
        }
      });
    }
  }
}



// Responsive breakpoints
$mobile: 576px;
$tablet: 768px;
$desktop: 992px;
$large: 1200px;

.budget-card-box {
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  width: 100%;
  box-sizing: border-box;
  
  // Responsive padding
  padding: 15px;
  
  @media (min-width: $tablet) {
    padding: 20px;
  }
  
  @media (min-width: $desktop) {
    padding: 25px;
  }

  .widget-heading {
    margin-right: 20px;
    font-size: 14px;
    line-height: 1.4;
    
    // Responsive font sizes
    @media (max-width: #{$mobile - 1px}) {
      font-size: 12px;
      margin-right: 10px;
    }
    
    @media (min-width: $desktop) {
      font-size: 16px;
    }
    
    i.fa-info-circle {
      font-size: 14px;
      color: #0071bc;
      margin-left: 6px;
      cursor: pointer;
      
      @media (max-width: #{$mobile - 1px}) {
        font-size: 12px;
        margin-left: 4px;
      }
    }
  }

  .header-icons {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    
    @media (max-width: #{$mobile - 1px}) {
      gap: 4px;
      margin-bottom: 15px;
    }
    
    @media (min-width: $tablet) {
      gap: 8px;
      margin-bottom: 25px;
    }
    
    @media (min-width: $desktop) {
      margin-bottom: 30px;
    }

    div {
      width: 28px;
      height: 28px;
      border: 1px solid #d6d6d6;
      text-align: center;
      line-height: 28px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      // Responsive icon sizes
      @media (max-width: #{$mobile - 1px}) {
        width: 24px;
        height: 24px;
        line-height: 24px;
      }
      
      @media (min-width: $large) {
        width: 32px;
        height: 32px;
        line-height: 32px;
      }

      &:hover {
        background-color: #f0f8ff;
        border-color: #0071bc;
      }

      &.lft-toggle-active,
      &.rgt-toggle-active {
        background-color: #0071bc;
        color: white;
      }

      i {
        font-size: 14px;
        
        @media (max-width: #{$mobile - 1px}) {
          font-size: 12px;
        }
        
        @media (min-width: $large) {
          font-size: 16px;
        }
      }
    }

    .ellipsis {
      border: none;
      color: #0071bc;
      
      &:hover {
        background-color: transparent;
        color: #005a94;
      }
    }
  }

  // Header section responsive layout
  .card-box-header-sec {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
    
    @media (max-width: #{$mobile - 1px}) {
      flex-direction: column;
      gap: 10px;
      align-items: stretch;
      margin-bottom: 10px;
      
      .header-icons {
        justify-content: center;
        margin-bottom: 10px;
      }
    }
    
    @media (min-width: $tablet) {
      align-items: center;
      margin-bottom: 20px;
    }
  }

  .inner-card-box {
    padding: 20px 0 10px 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    
    // Responsive padding
    @media (max-width: #{$mobile - 1px}) {
      padding: 10px 0 5px 0;
    }
    
    @media (min-width: $tablet) {
      padding: 30px 0 15px 0;
    }
    
    @media (min-width: $desktop) {
      padding: 40px 0 10px 0;
    }

    highcharts-chart {
      width: 100% !important;
      height: 100% !important;
      display: block;
      
      // Responsive min-heights
      min-height: 180px;
      
      @media (min-width: $tablet) {
        min-height: 220px;
      }
      
      @media (min-width: $desktop) {
        min-height: 250px;
      }
      
      @media (min-width: $large) {
        min-height: 280px;
      }
      
      // Ensure chart container is responsive
      ::ng-deep {
        .highcharts-container {
          width: 100% !important;
          height: 100% !important;
        }
        
        .highcharts-root {
          width: 100% !important;
          height: 100% !important;
        }
        
        .highcharts-background {
          fill: transparent;
        }
      }
    }
  }

  .viewmore {
    font-size: 13px;
    font-weight: 500;
    color: #0071bc;
    text-align: right;
    cursor: pointer;
    transition: color 0.2s ease;
    padding: 10px 0;
    
    // Responsive font sizes
    @media (max-width: #{$mobile - 1px}) {
      font-size: 11px;
      text-align: center;
      padding: 8px 0;
    }
    
    @media (min-width: $desktop) {
      font-size: 14px;
    }
    
    &:hover {
      color: #005a94;
    }
    
    i {
      transition: transform 0.2s ease;
    }
    
    &:hover i {
      transform: translateX(2px);
    }
  }

  // Loader responsive styles
  .loader-img {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    
    @media (max-width: #{$mobile - 1px}) {
      min-height: 150px;
    }
  }
}

// Icon transformations
.fa-chart-bar {
  display: inline-block;
  transform: rotate(270deg) scaleY(-1);
}

.fa-chart-pie {
  display: inline-block;
  transform: rotate(180deg) scaleY(-1);
}

// Additional responsive utilities
@media (max-width: #{$mobile - 1px}) {
  .budget-card-box {
    margin: 2px;
    border-radius: 4px;
  }
}

@media (min-width: $tablet) and (max-width: #{$desktop - 1px}) {
  .budget-card-box {
    margin: 3px;
  }
}

// Print styles
@media print {
  .budget-card-box {
    box-shadow: none;
    border: 1px solid #ddd;
    break-inside: avoid;
    
    .header-icons {
      display: none;
    }
  }
}

// High DPI displays
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .budget-card-box {
    .widget-heading,
    .viewmore {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }
}

// Focus styles for accessibility
.budget-card-box {
  .header-icons div:focus,
  .viewmore:focus {
    outline: 2px solid #0071bc;
    outline-offset: 2px;
  }
}

// Container queries support (if available)
@container (max-width: 400px) {
  .budget-card-box .widget-heading {
    font-size: 11px;
  }
}


<div class="budget-card-box" #chartsection>
  <div class="budget-box-chart">

    <!-- Header -->
    <div class="card-box-header-sec">
      <!-- Title -->
      <div class="widget-heading pointer mt-1">
        <span class="d-inline-flex align-items-center">
          <span class="widget-title">Workforce Supply (FTE) by FCV Status</span>
          <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
        </span>
      </div>

      <!-- Icons -->
      <div class="header-icons">
        <div class="lft-toggle" 
             [class.lft-toggle-active]="widgetType == 'th'" 
             (click)="loadWidget('th')"
             tabindex="0"
             role="button"
             aria-label="Switch to bar chart view"
             (keydown.enter)="loadWidget('th')"
             (keydown.space)="loadWidget('th')">
          <i class="fas fa-chart-bar" aria-hidden="true"></i>
        </div>
        <div class="rgt-toggle" 
             [class.rgt-toggle-active]="widgetType == 'ch'" 
             (click)="loadWidget('ch')"
             tabindex="0"
             role="button"
             aria-label="Switch to pie chart view"
             (keydown.enter)="loadWidget('ch')"
             (keydown.space)="loadWidget('ch')">
          <i class="far fa-chart-pie" aria-hidden="true"></i>
        </div>
        <div class="ellipsis"
             tabindex="0"
             role="button"
             aria-label="More options">
          <i class="fas fa-ellipsis-v" aria-hidden="true"></i>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="chart-container">
      <!-- Loading State -->
      <ng-container *ngIf="!ResponseFlag">
        <div class="loader-img" role="status" aria-label="Loading chart data">
          <lift-section-loader></lift-section-loader>
        </div>
      </ng-container>

      <!-- Chart View -->
      <ng-container *ngIf="ResponseFlag">
        <ng-container *ngIf="widgetType == 'ch' || widgetType == 'th'">
          <div class="inner-card-box">
            <highcharts-chart
              [Highcharts]="Highcharts"
              [options]="chartOptions"
              [constructorType]="'chart'"
              role="img"
              [attr.aria-label]="'Pie chart showing workforce supply by FCV status. FCV: ' + (fcvData[0]?.value || 0) + ', Non-FCV: ' + (fcvData[1]?.value || 0)">
            </highcharts-chart>
          </div>
        </ng-container>

        <!-- Mobile Legend (when chart legend is hidden) -->
        <div class="mobile-legend d-block d-sm-none" *ngIf="fcvData.length > 0">
          <div class="legend-items d-flex justify-content-center flex-wrap gap-3 mt-2">
            <div class="legend-item d-flex align-items-center" *ngFor="let item of fcvData">
              <div class="legend-color" 
                   [style.background-color]="item.color"
                   style="width: 12px; height: 12px; margin-right: 6px; border-radius: 2px;"></div>
              <span class="legend-text" style="font-size: 11px;">
                {{item.name}}: {{item.value}} ({{((item.value / (fcvData.reduce((acc, cur) => acc + cur.value, 0))) * 100).toFixed(0)}}%)
              </span>
            </div>
          </div>
        </div>

        <!-- View More -->
        <div class="viewmore pointer mt-3 pt-3" 
             (click)="getDetailPage()"
             tabindex="0"
             role="button"
             aria-label="View more details about FCV status"
             (keydown.enter)="getDetailPage()"
             (keydown.space)="getDetailPage()">
          <span>View More&nbsp;&nbsp;</span>
          <i class="fa fa-angle-right" aria-hidden="true"></i>
        </div>
      </ng-container>
    </div>
  </div>
</div>

<!-- Info Popover Template -->
<ng-template #infotemp>
  <lift-popover popoverTitle="Workforce Supply (FTE) by FCV Status" 
                popoverText="This chart displays the distribution of full-time equivalent workforce by FCV (Fragile, Conflict, and Violence) status classification." 
                [config]="config1">
    <span role="button" 
          tabindex="0"
          aria-label="Information about this chart"
          (keydown.enter)="$event.target.click()"
          (keydown.space)="$event.target.click()">
      <i class="far fa-info-circle" aria-hidden="true"></i>
    </span>
  </lift-popover>
</ng-template>