<div class="inner-card-box">

  <div class="content-area">
    <!-- Left Arrow -->
    <button *ngIf="currentView === 'chart'" class="nav-arrow left-arrow" (click)="prevChart()">
      <i class="fa fa-chevron-left"></i>
    </button>

    <!-- Column Chart -->
    <ng-container *ngIf="widgetType === 'ch' && currentView === 'chart'">
      <highcharts-chart
        [Highcharts]="swfpColumnChart[chartIndex]?.Highcharts"
        [options]="swfpColumnChart[chartIndex]?.chartOptions"
        [constructorType]="swfpColumnChart[chartIndex]?.chartConstructor"
        style="width:95%; height:290px; display:block;">
      </highcharts-chart>
    </ng-container>

    <!-- Pie Charts -->
    <ng-container *ngIf="widgetType === 'pi' && currentView === 'chart'">
      <highcharts-chart
        [Highcharts]="allPieCharts[chartIndex]?.Highcharts"
        [options]="allPieCharts[chartIndex]?.chartOptions"
        [constructorType]="allPieCharts[chartIndex]?.chartConstructor"
        style="width:95%; height:290px; display:block;">
      </highcharts-chart>
    </ng-container>

    <!-- Right Arrow -->
    <button *ngIf="currentView === 'chart'" class="nav-arrow right-arrow" (click)="nextChart()">
      <i class="fa fa-chevron-right"></i>
    </button>
  </div>

</div>


currentView: string = 'chart';   // chart | table
chartIndex: number = 0;          // track which chart is active
allPieCharts: any[] = [];        // flatten GH + GI pie arrays

ngOnInit(): void {
  // When loading pie charts, flatten into one list for easy navigation
  this.allPieCharts = [...this.swfpPieChartByGH, ...this.swfpPieChartByGI];
}

prevChart() {
  if (this.widgetType === 'pi') {
    this.chartIndex = (this.chartIndex - 1 + this.allPieCharts.length) % this.allPieCharts.length;
  } else if (this.widgetType === 'ch') {
    this.chartIndex = (this.chartIndex - 1 + this.swfpColumnChart.length) % this.swfpColumnChart.length;
  }
}

nextChart() {
  if (this.widgetType === 'pi') {
    this.chartIndex = (this.chartIndex + 1) % this.allPieCharts.length;
  } else if (this.widgetType === 'ch') {
    this.chartIndex = (this.chartIndex + 1) % this.swfpColumnChart.length;
  }
}


.content-area {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border: none;
  font-size: 18px;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);

  &.left-arrow { left: 10px; }
  &.right-arrow { right: 10px; }
}
