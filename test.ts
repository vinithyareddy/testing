<ng-container *ngIf="widgetType == 'ch'">
  <div class="inner-card-box">

    <div class="content-area">
      <!-- Left Arrow -->
      <button *ngIf="currentView === 'chart'" class="nav-arrow left-arrow" (click)="prevChart()">
        <i class="fa fa-chevron-left"></i>
      </button>

      <!-- Show only the active column chart -->
      <highcharts-chart *ngIf="currentView === 'chart' && swfpColumnChart.length"
        [Highcharts]="swfpColumnChart[chartIndex]?.Highcharts"
        [options]="swfpColumnChart[chartIndex]?.chartOptions"
        [constructorType]="swfpColumnChart[chartIndex]?.chartConstructor"
        style="width:95%; height:290px; display:block;">
      </highcharts-chart>

      <!-- Right Arrow -->
      <button *ngIf="currentView === 'chart'" class="nav-arrow right-arrow" (click)="nextChart()">
        <i class="fa fa-chevron-right"></i>
      </button>
    </div>

    <!-- ✅ Keep your legend here -->
    <div class="pl-4 legend-bottom" *ngIf="legends.length > 0">
      <ul class="listLegend">
        <ng-container *ngFor="let data of legends">
          <li>
            <span class="dot" [ngStyle]="{'background-color': data.color}"></span>
            &nbsp;&nbsp;{{data.name}}
          </li>
        </ng-container>
      </ul>
    </div>

  </div>
</ng-container>
