<ng-container *ngIf="widgetType == 'pi'">
  <div class="inner-card-box">

    <div class="content-area">
      <!-- Left Arrow -->
      <button *ngIf="currentView === 'chart'" class="nav-arrow left-arrow" (click)="prevChart()">
        <i class="fa fa-chevron-left"></i>
      </button>

      <!-- Show only the active pie chart -->
      <highcharts-chart *ngIf="currentView === 'chart' && allPieCharts.length"
        [Highcharts]="allPieCharts[chartIndex]?.Highcharts"
        [options]="allPieCharts[chartIndex]?.chartOptions"
        [constructorType]="allPieCharts[chartIndex]?.chartConstructor"
        style="width:95%; height:290px; display:block;">
      </highcharts-chart>

      <!-- Right Arrow -->
      <button *ngIf="currentView === 'chart'" class="nav-arrow right-arrow" (click)="nextChart()">
        <i class="fa fa-chevron-right"></i>
      </button>
    </div>

    <!-- ✅ Keep legend below -->
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
