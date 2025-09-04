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
          <!-- Toggle Buttons -->
          <div class="togglebtn d-flex">
            <div class="lft-toggle" [class.lft-toggle-active]="widgetType == 'th'"
              (click)="loadWidget('th')">
              <i class="fa fa-table fnticon" aria-hidden="true"></i>
            </div>
            <div class="rgt-toggle" [class.rgt-toggle-active]="widgetType == 'ch'"
              (click)="loadWidget('ch')">
              <i class="fa fa-bar-chart fnticon" aria-hidden="true"></i>
            </div>
          </div>

          <div class="d-flex gap-3">
            <span class="view">
              <i class="fas fa-expand" title="Zoom"></i>
            </span>
            <div class="ellipsis ml-2">
              <i class="fas fa-ellipsis-v"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="content-area">
        <highcharts-chart
          [Highcharts]="Highcharts"
          [options]="chartOptions"
          style="width: 90%; height: 290px; display: block;">
        </highcharts-chart>

        <!-- Arrows -->
        <div class="chart-nav">
          <button class="arrow left"><i class="fa fa-chevron-left"></i></button>
          <button class="arrow right"><i class="fa fa-chevron-right"></i></button>
        </div>
      </div>

      <!-- Footer -->
      <div class="viewmore">
        <span>View More</span>
        <i class="fa fa-angle-right"></i>
      </div>
    </div>
  </div>
</div>


.ellipsis {
  cursor: pointer;
  font-size: 18px;
  margin-left: 12px;
  color: #0071bc;
}

.viewmore {
  font-size: 14px;
  color: #0071bc;
  margin-top: 20px;   // push footer further down
}

.header-icons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;

  i {
    font-size: 16px;
    cursor: pointer;
  }
}

.content-area {
  position: relative;   // needed for arrows positioning
  border: 1px solid #ccd5df;
  padding-bottom: 20px; // extra breathing room
}

/* Arrow buttons */
.chart-nav {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  pointer-events: none; // let chart clicks through, except arrows
}

.chart-nav .arrow {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  cursor: pointer;
  pointer-events: all;
}
