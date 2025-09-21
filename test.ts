<!-- Column Chart View -->
<ng-container *ngIf="widgetType == 'ch'">
  <div class="inner-card-box chart-wrapper">
    <!-- Left arrow -->
    <button class="nav-arrow left-arrow">
      <i class="fa fa-chevron-left"></i>
    </button>

    <div class="row">
      <div class="col-md-12 col-lg-12" #cartboxchartsection>
        <div>
          <ng-container *ngFor="let columnChart of swfpColumnChart">
            <highcharts-chart [Highcharts]="columnChart.Highcharts"
                              [options]="columnChart.chartOptions"
                              [constructorType]="columnChart.chartConstructor">
            </highcharts-chart>
          </ng-container>
        </div>
      </div>
    </div>

    <!-- Right arrow -->
    <button class="nav-arrow right-arrow">
      <i class="fa fa-chevron-right"></i>
    </button>

    <div class="pl-4 legend-bottom" *ngIf="legends.length > 0">
      <ul class="listLegend">
        <ng-container *ngFor="let data of legends">
          <li><span class="dot" [ngStyle]="{'background-color': data.color}"></span>
            &nbsp;&nbsp;{{data.name}}
          </li>
        </ng-container>
      </ul>
    </div>
  </div>
</ng-container>


<!-- Pie Chart View -->
<ng-container *ngIf="widgetType == 'pi'">
  <div class="inner-card-box chart-wrapper">
    <!-- Left arrow -->
    <button class="nav-arrow left-arrow">
      <i class="fa fa-chevron-left"></i>
    </button>

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

    <!-- Right arrow -->
    <button class="nav-arrow right-arrow">
      <i class="fa fa-chevron-right"></i>
    </button>

    <div class="pl-4 legend-bottom" *ngIf="legends.length > 0">
      <ul class="listLegend">
        <ng-container *ngFor="let data of legends">
          <li><span class="dot" [ngStyle]="{'background-color': data.color}"></span>
            &nbsp;&nbsp;{{data.name}}
          </li>
        </ng-container>
      </ul>
    </div>
  </div>
</ng-container>




.chart-wrapper {
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
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 6px 8px;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);

  i {
    font-size: 14px;
    color: #333;
  }

  &.left-arrow {
    left: -20px;
  }

  &.right-arrow {
    right: -20px;
  }
}


onPrev() {
  console.log("Previous clicked");
  // logic to switch dataset or chart
}

onNext() {
  console.log("Next clicked");
  // logic to switch dataset or chart
}

<button class="nav-arrow left-arrow" (click)="onPrev()">
  <i class="fa fa-chevron-left"></i>
</button>
<button class="nav-arrow right-arrow" (click)="onNext()">
  <i class="fa fa-chevron-right"></i>
</button>
