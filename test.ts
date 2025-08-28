<div class="budget-card-box" #cartboxchartsection>
  <div class="budget-box-chart">
    <div class="row card-box-header-sec">
      <div class="widget-heading pointer mt-1 col-md-8">
        <span>
          {{ widgetTitle }}
          <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
        </span>
      </div>

      <!-- Top-right toolbar -->
      <div class="col-md-4 bgt-text-end">
        <div class="toolbar">
          <div class="btn" [class.btn-selected]="widgetType == 'th'" (click)="loadWidget('th')">
            <i class="fas fa-chart-bar"></i>
          </div>
          <div class="btn" [class.btn-selected]="widgetType == 'ch'" (click)="loadWidget('ch')">
            <i class="far fa-chart-pie"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-wrap">
      <highcharts-chart
        [Highcharts]="Highcharts"
        [options]="chartOptions"
        style="width: 100%; height: 240px; display: block"
      ></highcharts-chart>
    </div>

    <div class="viewmore pointer mt-3 pt-3" (click)="getDetailPage()">
      <span>View All&nbsp;&nbsp;</span>
      <i class="fa fa-angle-right"></i>
    </div>
  </div>
</div>


.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  .btn {
    width: 40px;   // bigger box
    height: 40px;  // bigger box
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #f8fafb;
    border: 1px solid #cbd5e1;
    cursor: pointer;
    transition: all 0.2s ease;

    i {
      font-size: 20px;   // icon size bigger
      color: #64748b;
    }

    &:hover {
      background: #eef5ff;
      border-color: #2f67d2;

      i {
        color: #2f67d2;
      }
    }
  }

  .btn-selected {
    background: #eef5ff;
    border: 1px solid #2f67d2;

    i {
      color: #2f67d2;
    }
  }
}
