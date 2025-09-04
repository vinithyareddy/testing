<div class="budget-card-box-lg">
  <div class="budget-box-chart-lg">
    <!-- Header -->
    <div class="header-row">
      <div class="d-flex justify-content-between align-items-center flex-wrap">
        <!-- Left Section -->
        <div class="widget-heading pointer mt-1 col-md-8 d-flex align-items-center">
          <span>
            Workforce Supply (FTE) by Grade
            <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
          </span>
        </div>

        <!-- Right Section -->
        <div class="col-md-4 d-flex justify-content-end align-items-center header-icons">
          <div class="togglebtn d-flex">
            <div class="lft-toggle" [class.lft-toggle-active]="widgetType == 'th'" (click)="loadWidget('th')">
              <i class="fa fa-table fnticon" aria-hidden="true"></i>
            </div>
            <div class="rgt-toggle" [class.rgt-toggle-active]="widgetType == 'ch'" (click)="loadWidget('ch')">
              <i class="fa fa-bar-chart fnticon" aria-hidden="true"></i>
            </div>
          </div>
          <div class="d-flex gap-3">
            <span class="view"><i class="fas fa-expand" title="Zoom"></i></span>
            <div class="ellipsis ml-2"><i class="fas fa-ellipsis-v"></i></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="content-area">
      <highcharts-chart
        [Highcharts]="Highcharts"
        [options]="chartOptions"
        style="width: 100%; height: 290px; display: block;">
      </highcharts-chart>
    </div>

    <!-- Footer always at bottom of card -->
    <div class="viewmore">
      <span>View More</span>
      <i class="fa fa-angle-right"></i>
    </div>
  </div>
</div>
