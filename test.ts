<div class="budget-card-box-lg">
  <div class="budget-box-chart-lg">

    <!-- Header -->
    <div class="header-row">
      <div class="widget-heading">
        <span>{{ title }}
          <lift-popover popoverTitle="" popoverText="">
            <i class="far fa-info-circle ml-1"></i>
          </lift-popover>
        </span>
      </div>
    </div>

    <!-- Body -->
    <div class="content-area">
      <!-- Actions INSIDE frame -->
      <div class="header-actions inframe">
        <div class="togglebtn">
          <button class="toggle lft-toggle" [class.active]="view==='table'" (click)="setView('table')">
            <i class="fa fa-table fnticon"></i>
          </button>
          <button class="toggle rgt-toggle" [class.active]="view==='chart'" (click)="setView('chart')">
            <i class="fa fa-bar-chart fnticon"></i>
          </button>
        </div>
        <button class="icon-btn"><i class="fas fa-expand"></i></button>
        <button class="icon-btn"><i class="fas fa-ellipsis-v"></i></button>
      </div>

      <!-- Chart -->
      <ng-container *ngIf="view==='chart'">
        <highcharts-chart
          [Highcharts]="Highcharts"
          [options]="chartOptions"
          style="width: 100%; height: 300px; display: block;">
        </highcharts-chart>
      </ng-container>

      <!-- Table -->
      <ng-container *ngIf="view==='table'">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="text-start">Position</th>
                <th class="text-end">Amount (M)</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of data">
                <td class="text-start">{{ r.position }}</td>
                <td class="text-end">{{ r.amount }}</td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="!data?.length" class="no-data-center">No Data Found !!</div>
        </div>
      </ng-container>

      <!-- View More inside -->
      <div class="viewmore inframe">
        <span>View More</span>
        <i class="fa fa-angle-right"></i>
      </div>
    </div>
  </div>
</div>


.budget-box-chart-lg {
  border: 1px solid #d9e3ea;
  background: #f8fbfd;
  border-radius: 12px;        /* rounder */
  padding: 12px 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06); /* subtle shadow */
  position: relative;         /* allow absolute children */
}

/* Actions inside chart frame */
.header-actions.inframe {
  position: absolute;
  top: 12px;
  right: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* View more inside frame */
.viewmore.inframe {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  color: #0b6cbf;
  font-weight: 600;
  cursor: pointer;
}
