// Pagination state for pie charts
currentIndex = 0;           // where we are now
pageSize = 1;               // how many pie charts to show at once


<ng-container *ngIf="widgetType == 'pi'">
  <div class="inner-card-box">

    <div class="row">
      <div class="col-md-12 col-lg-12" #cartboxchartsection>
        <div class="chart-grid">
          <ng-container *ngFor="let trendchart of swfpPieChartByGH">
            <div class="donut-cell">
              <highcharts-chart class="donut-chart"
                  [Highcharts]="trendchart.Highcharts"
                  [options]="trendchart.chartOptions"
                  [constructorType]="trendchart.chartConstructor">
              </highcharts-chart>
            </div>
          </ng-container>

          <ng-container *ngFor="let trendchart of swfpPieChartByGI">
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


    // Merge GH + GI pie charts into one array for pagination
get allPieCharts() {
  return [...this.swfpPieChartByGH, ...this.swfpPieChartByGI];
}

// Return only the slice to show based on currentIndex + pageSize
getCurrentPieCharts() {
  return this.allPieCharts.slice(this.currentIndex, this.currentIndex + this.pageSize);
}

// Move left
onPrev() {
  if (this.currentIndex > 0) {
    this.currentIndex -= this.pageSize;
  }
}

// Move right
onNext() {
  if (this.currentIndex + this.pageSize < this.allPieCharts.length) {
    this.currentIndex += this.pageSize;
  }
}


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


<ng-container *ngIf="widgetType == 'ch'">
  <div class="inner-card-box chart-wrapper">

    <!-- Left arrow -->
    <button class="nav-arrow left-arrow" (click)="onPrevColumn()" 
            [disabled]="currentColIndex === 0">
      <i class="fa fa-chevron-left"></i>
    </button>

    <div class="row">
      <div class="col-md-12 col-lg-12" #cartboxchartsection>
        <div>
          <ng-container *ngFor="let columnChart of getCurrentColumnCharts()">
            <highcharts-chart [Highcharts]="columnChart.Highcharts"
                              [options]="columnChart.chartOptions"
                              [constructorType]="columnChart.chartConstructor">
            </highcharts-chart>
          </ng-container>
        </div>
      </div>
    </div>

    <!-- Right arrow -->
    <button class="nav-arrow right-arrow" (click)="onNextColumn()" 
            [disabled]="currentColIndex + colPageSize >= swfpColumnChart.length">
      <i class="fa fa-chevron-right"></i>
    </button>

  </div>
</ng-container>


// Column chart pagination
currentColIndex = 0;
colPageSize = 1;   // show 1 column chart at a time (can change to 2, etc.)

getCurrentColumnCharts() {
  return this.swfpColumnChart.slice(this.currentColIndex, this.currentColIndex + this.colPageSize);
}

onPrevColumn() {
  if (this.currentColIndex > 0) {
    this.currentColIndex -= this.colPageSize;
  }
}

onNextColumn() {
  if (this.currentColIndex + this.colPageSize < this.swfpColumnChart.length) {
    this.currentColIndex += this.colPageSize;
  }
}
