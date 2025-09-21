// Shared pagination state for charts (column & pie)
currentIndex = 0;
pageSize = 1;

// Return current slice depending on chart type
getCurrentCharts() {
  if (this.widgetType === 'ch') {
    return this.swfpColumnChart.slice(this.currentIndex, this.currentIndex + this.pageSize);
  }
  if (this.widgetType === 'pi') {
    return [...this.swfpPieChartByGH, ...this.swfpPieChartByGI].slice(this.currentIndex, this.currentIndex + this.pageSize);
  }
  return [];
}

// Left arrow
onPrev() {
  if (this.currentIndex > 0) {
    this.currentIndex -= this.pageSize;
  }
}

// Right arrow
onNext() {
  const total = this.widgetType === 'ch'
    ? this.swfpColumnChart.length
    : [...this.swfpPieChartByGH, ...this.swfpPieChartByGI].length;

  if (this.currentIndex + this.pageSize < total) {
    this.currentIndex += this.pageSize;
  }
}


<ng-container *ngIf="widgetType == 'ch'">
  <div class="inner-card-box chart-wrapper">

    <button class="nav-arrow left-arrow" (click)="onPrev()" [disabled]="currentIndex === 0">
      <i class="fa fa-chevron-left"></i>
    </button>

    <div class="row">
      <div class="col-md-12 col-lg-12" #cartboxchartsection>
        <div>
          <ng-container *ngFor="let columnChart of getCurrentCharts()">
            <highcharts-chart [Highcharts]="columnChart.Highcharts"
                              [options]="columnChart.chartOptions"
                              [constructorType]="columnChart.chartConstructor">
            </highcharts-chart>
          </ng-container>
        </div>
      </div>
    </div>

    <button class="nav-arrow right-arrow" (click)="onNext()"
      [disabled]="currentIndex + pageSize >= swfpColumnChart.length">
      <i class="fa fa-chevron-right"></i>
    </button>

  </div>
</ng-container>


<ng-container *ngIf="widgetType == 'pi'">
  <div class="inner-card-box chart-wrapper">

    <button class="nav-arrow left-arrow" (click)="onPrev()" [disabled]="currentIndex === 0">
      <i class="fa fa-chevron-left"></i>
    </button>

    <div class="row">
      <div class="col-md-12 col-lg-12" #cartboxchartsection>
        <div class="chart-grid">
          <ng-container *ngFor="let trendchart of getCurrentCharts()">
            <div class="donut-cell">
              <highcharts-chart class="donut-chart"
                                [Highcharts]="trendchart.Highcharts"
                                [options]="trendchart.chartOptions"
                                [constructorType]="trendchart.chartConstructor">
              </highcharts-chart>
            </div>
          </ng-container>
        </div>
      </div>
    </div>

    <button class="nav-arrow right-arrow" (click)="onNext()"
      [disabled]="currentIndex + pageSize >= (swfpPieChartByGH.length + swfpPieChartByGI.length)">
      <i class="fa fa-chevron-right"></i>
    </button>

  </div>
</ng-container>


.chart-wrapper {
  position: relative;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 6px 10px;
  cursor: pointer;
  z-index: 10;

  &.left-arrow { left: 5px; }
  &.right-arrow { right: 5px; }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
